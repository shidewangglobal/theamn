#!/usr/bin/env node
/**
 * Build docs/STUDIO-GUIDE.pdf from docs/STUDIO-GUIDE.md using Chrome headless.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const mdPath = path.join(root, 'docs/STUDIO-GUIDE.md');
const htmlPath = path.join(root, 'docs/STUDIO-GUIDE.print.html');
const pdfPath = path.join(root, 'docs/STUDIO-GUIDE.pdf');

const md = fs.readFileSync(mdPath, 'utf8');
const body = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>THE AMN — Sanity Studio Guide</title>
  <style>
    @page { margin: 18mm 16mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1a1a1a;
      max-width: 780px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 { font-size: 22pt; margin: 0 0 8px; letter-spacing: -0.02em; }
    h2 { font-size: 14pt; margin: 28px 0 10px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
    h3 { font-size: 12pt; margin: 20px 0 8px; color: #333; }
    p, li { margin: 0 0 8px; }
    ul { padding-left: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 10pt; }
    th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f5f5f7; font-weight: 600; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5pt; }
    pre {
      background: #f5f5f7;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      padding: 12px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    a { color: #0066aa; text-decoration: none; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
    strong { font-weight: 600; }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e5e5e5;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
${body}
<div class="footer">THE AMN Limited · Studio guide · theamn.network · Generated ${new Date().toISOString().slice(0, 10)}</div>
</body>
</html>`;

fs.writeFileSync(htmlPath, html);

const chrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromeArgs = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath,
];

execFileSync(chrome, chromeArgs, { stdio: 'inherit' });
fs.unlinkSync(htmlPath);

console.log(`PDF written to ${pdfPath}`);
