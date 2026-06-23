export type CaseStudyPreview = {
  id: string;
  client: string;
  location: string;
  challenge: string;
  turnaround: string;
  metric?: string;
  beforeImage: string;
  afterImage: string;
};

export const caseStudiesPreview: CaseStudyPreview[] = [
  {
    id: 'khao-yai',
    client: 'InterContinental Khao Yai',
    location: 'Thailand',
    challenge:
      'An iconic rail-themed resort finding it difficult to translate its rich historical narrative and unique rail-carriage concept into engaging digital formats.',
    turnaround:
      'Brought the fictional persona of Somsak to life by transforming the entire social media presence into a curated editorial trip told entirely through his perspective.',
    metric: '+20% organic engagement',
    beforeImage: '/images/case-preview/khao-yai-before.png',
    afterImage: '/images/case-preview/khao-yai-after.png',
  },
  {
    id: 'six-senses',
    client: 'Six Senses Shaharut',
    location: 'Israel',
    challenge:
      'A remote, high-end sanctuary needing a distinct positioning strategy to captivate global ultra-high-net-worth travelers.',
    turnaround:
      'Reimagined the online digital presence into a living day-and-time storybook that allows audiences to experience the vast stillness of the Negev desert.',
    beforeImage: '/images/case-preview/six-senses-before.png',
    afterImage: '/images/case-preview/six-senses-after.png',
  },
  {
    id: 'shinta-mani',
    client: 'Shinta Mani Wild',
    location: 'Cambodia',
    challenge:
      'A world-class tented resort struggling to project the unique, playful spirit of its founder and the richness of its guest itineraries.',
    turnaround:
      "Transformed generic social pages into a monthly themed diary driven by the founder's persona.",
    metric: '+15% organic engagement',
    beforeImage: '/images/case-preview/shinta-before.png',
    afterImage: '/images/case-preview/shinta-after.png',
  },
];

export const curatingService = {
  subtitle: 'Brand Storytelling & Content',
  title: "Curating Your Brand's Aesthetic",
  description:
    'Revamping luxury content playbooks and standardizing social media layouts for authentic, highly engaging brand storytelling across premium hospitality properties.',
  items: [
    'Luxury content playbooks',
    'Social media layout systems & standardized templates',
    'Persona-driven storytelling & curated editorial trips',
  ],
  heroImage: '/images/luxury-content-hero.png',
};
