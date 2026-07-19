export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  slug: string;
  label: string;
  items: FaqItem[];
}
