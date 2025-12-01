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
  category_id: number | null;
  tags: {
    title: string;
    id: number;
  }[];
}

export interface TagsInterface{
  title:string | null,
  id: number | null;
}