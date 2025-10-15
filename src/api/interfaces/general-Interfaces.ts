export interface CategoryInterfaz {
  title: string | null;
  description: string | null;
  id: number | null;
  picture: string | null;
}

export interface ProducInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  pictures?: string[];
  category: {
    title: string;
    description: string;
    id: number;
    picture: string;
  };
  tags: {
    title: string;
    id: number;
  }[];
}
