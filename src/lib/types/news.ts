export interface NewsArticle {
  id: string;
  teamId: string;
  title: string;
  excerpt: string;
  category: 'match' | 'transfer' | 'injury' | 'general';
  source: string;
  publishedAt: string;
  imageUrl?: string;
}
