export type ArchetypeTile = {
  id: string;
  src: string;
  alt: string;
};

export type ArchetypeQuadSlot = number | 'title';

export type ArchetypePreview = {
  id: string;
  name: string;
  tagline: string;
  titleCard: string;
  tiles: ArchetypeTile[];
  /** 1-based tile index for the large 2×2 hero */
  hero: number;
  /** Four 1×1 squares beside the hero */
  quad: [ArchetypeQuadSlot, ArchetypeQuadSlot, ArchetypeQuadSlot, ArchetypeQuadSlot];
  /** Eight 1×1 squares in two rows below — 12 unit squares total */
  bottom: [number, number, number, number, number, number, number, number];
};

const tileSet = (slug: string, label: string): ArchetypeTile[] =>
  Array.from({ length: 18 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
      id: `${slug}-${num}`,
      src: `/images/archetype-tiles/${slug}/${num}.jpg`,
      alt: `${label} social tile ${i + 1}`,
    };
  });

export const archetypesPreview: ArchetypePreview[] = [
  {
    id: 'rail-heritage',
    name: 'Rail Heritage',
    tagline: 'Editorial voice for heritage storytelling',
    titleCard: 'Rail Heritage',
    tiles: tileSet('rail-heritage', 'Rail Heritage'),
    hero: 8,
    quad: [1, 2, 3, 'title'],
    bottom: [5, 6, 7, 9, 10, 11, 12, 13],
  },
  {
    id: 'desert-sanctuary',
    name: 'Desert Sanctuary',
    tagline: 'Stillness in a distinct feed',
    titleCard: 'Desert Sanctuary',
    tiles: tileSet('desert-sanctuary', 'Desert Sanctuary'),
    hero: 14,
    quad: [1, 2, 'title', 3],
    bottom: [4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'wild-diary',
    name: 'Wild Diary',
    tagline: 'Playful spirit, its own social language',
    titleCard: 'Wild Diary',
    tiles: tileSet('wild-diary', 'Wild Diary'),
    hero: 2,
    quad: [1, 3, 4, 'title'],
    bottom: [5, 6, 7, 8, 9, 10, 11, 12],
  },
];

export const archetypeSectionCopy = {
  label: 'Highlighted Aesthetic Archetypes',
  subtitle: "Transformed social presence, shaped by each brand's essence",
};
