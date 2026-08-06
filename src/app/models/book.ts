export interface Book {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly language: string;
  readonly coverUrl: string;
  readonly pdfUrl: string;
  readonly fileSize: number;
  readonly sourceBookId: number | null;
}

export interface BookCatalog {
  readonly generatedAt: string;
  readonly source: string;
  readonly count: number;
  readonly books: Book[];
}
