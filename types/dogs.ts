
export interface Dog {
  id: string | number;
  name: string;
  age: number | string;
  breed: string;
  img: string;
  zip_code: string;
  city?: string;
  state?: string
}