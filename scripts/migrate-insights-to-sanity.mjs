#!/usr/bin/env node
/**
 * One-time migration: src/content/insights/*.md → Sanity insight documents.
 *
 * Required env:
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET (default: production)
 *   SANITY_API_WRITE_TOKEN
 *
 * Usage: npm run migrate:insights
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fsSync.existsSync(envPath)) return;

  const content = fsSync.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();
const insightsDir = path.join(root, 'src/content/insights');
const publicDir = path.join(root, 'public');

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.');
  console.error('Add them to .env in the project root (see .env.example).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 10);

function parseInline(text) {
  const children = [];
  const markDefs = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        _key: key(),
        text: text.slice(lastIndex, match.index),
        marks: [],
      });
    }

    const token = match[0];
    if (token.startsWith('**')) {
      children.push({
        _type: 'span',
        _key: key(),
        text: token.slice(2, -2),
        marks: ['strong'],
      });
    } else if (token.startsWith('*')) {
      children.push({
        _type: 'span',
        _key: key(),
        text: token.slice(1, -1),
        marks: ['em'],
      });
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const markKey = key();
        markDefs.push({ _key: markKey, _type: 'link', href: linkMatch[2] });
        children.push({
          _type: 'span',
          _key: key(),
          text: linkMatch[1],
          marks: [markKey],
        });
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      _key: key(),
      text: text.slice(lastIndex),
      marks: [],
    });
  }

  if (!children.length) {
    children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  }

  return { children, markDefs };
}

function blockFromText(text, style = 'normal', listItem) {
  const { children, markDefs } = parseInline(text);
  return {
    _type: 'block',
    _key: key(),
    style,
    listItem,
    level: listItem ? 1 : undefined,
    children,
    markDefs,
  };
}

function markdownToBlocks(markdown) {
  const tokens = marked.lexer(markdown);
  const blocks = [];

  for (const token of tokens) {
    if (token.type === 'heading') {
      blocks.push(blockFromText(token.text, token.depth === 2 ? 'h2' : 'h3'));
    } else if (token.type === 'paragraph') {
      blocks.push(blockFromText(token.text));
    } else if (token.type === 'blockquote') {
      blocks.push(blockFromText(token.text, 'blockquote'));
    } else if (token.type === 'list') {
      for (const item of token.items) {
        blocks.push(blockFromText(item.text, 'normal', token.ordered ? 'number' : 'bullet'));
      }
    } else if (token.type === 'table') {
      const rows = [
        { _key: key(), cells: token.header.map((cell) => cell.text) },
        ...token.rows.map((row) => ({
          _key: key(),
          cells: row.map((cell) => cell.text),
        })),
      ];
      blocks.push({
        _type: 'table',
        _key: key(),
        rows,
      });
    } else if (token.type === 'hr') {
      blocks.push(blockFromText('---'));
    }
  }

  return blocks;
}

async function uploadImage(relativePath) {
  const normalized = relativePath.replace(/^\//, '');
  const filePath = path.join(publicDir, normalized);

  try {
    await fs.access(filePath);
  } catch {
    console.warn(`  ⚠ Image not found: ${filePath}`);
    return undefined;
  }

  const buffer = await fs.readFile(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  });

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };
}

async function migrateFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, path.extname(filePath));

  const existing = await client.fetch(
    `*[_type == "insight" && slug.current == $slug][0]._id`,
    { slug },
  );

  if (existing) {
    console.log(`  ↷ Skipping ${slug} (already exists)`);
    return;
  }

  const coverImage = await uploadImage(data.coverImage || '/images/hero-cover.jpeg');
  const ogImage = data.ogImage ? await uploadImage(data.ogImage) : coverImage;

  const doc = {
    _type: 'insight',
    title: data.title,
    titleEmphasis: data.titleEmphasis || undefined,
    slug: { _type: 'slug', current: slug },
    description: data.description,
    category: data.category || 'Insights',
    layout: data.category === 'Q&A' ? 'qa' : 'standard',
    coverImage,
    body: markdownToBlocks(content.trim()),
    faqs: (data.faqs || []).map((item) => ({
      _type: 'faqItem',
      _key: key(),
      question: item.question,
      answer: item.answer,
    })),
    closingTitle: data.closingTitle || 'The bottom line',
    closing: data.closing,
    publishDate: new Date(data.publishDate).toISOString(),
    updatedDate: data.updatedDate ? new Date(data.updatedDate).toISOString() : undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    seo: {
      _type: 'seo',
      metaTitle: data.seoTitle || undefined,
      metaDescription: data.seoDescription || undefined,
      ogImage: ogImage || undefined,
    },
  };

  await client.create(doc);
  console.log(`  ✓ Migrated ${slug}`);
}

async function main() {
  const files = (await fs.readdir(insightsDir)).filter((name) => name.endsWith('.md'));
  console.log(`Migrating ${files.length} insights to Sanity (${projectId}/${dataset})...`);

  for (const file of files) {
    await migrateFile(path.join(insightsDir, file));
  }

  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
