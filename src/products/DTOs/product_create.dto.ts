// product_create.dto.ts
export class CreateProductDto {
  name: string;
  price: number;
  category: string;
  lang?: string; // optional if we want to specify language or default to 'en'
}
