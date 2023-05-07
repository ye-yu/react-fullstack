export interface SearchOptions {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  options: {
    id: number;
    label: string;
  }[];
}
