export interface CraftItem {
  id: string;
  name: string;
  category: 'Tekstil' | 'Kayu' | 'Logam' | 'Mebel' | 'Miniatur';
  region: 'Bugis (Sengkang)' | 'Makassar' | 'Toraja' | 'Mandar';
  material: string;
  dimensions: string;
  price: number;
  artisanName: string;
  imageUrl: string;
  philosophy: string;
  motifs: string[];
  story: string;
  artisanNotes: string;
  ratings: number;
  dimensions_cm: { w: number; h: number; d: number };
}

export interface TeamMember {
  name: string;
  role: string;
  details: string;
}

export interface ProblemStatement {
  title: string;
  points: string[];
}

export interface ProposalSectionData {
  title: string;
  content: string | string[];
}
