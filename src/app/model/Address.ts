export interface Address {
  id: number;
  street: string;
  number: string;
  visitedAt?: string | null;
  visitUnallowed: boolean;
  visitTime?: string | null;
  visited?: boolean | null;
  blockId?: number | null;
}
