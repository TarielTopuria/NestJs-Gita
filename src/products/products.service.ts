import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IProducts } from './DTOs/products.interface';
import { CreateProductDto } from './DTOs/product_create.dto';
import { UpdateProductDto } from './DTOs/product_update.dto';

@Injectable()
export class ProductsService {
  private productsEn: IProducts[] = [
    {
      id: 1,
      name: "Apple",
      price: 2,
      category: "Food",
      createdAt: "2024-12-21T21:29:05.744Z",
    },
    {
      id: 2,
      name: "Banana",
      price: 3,
      category: "Food",
      createdAt: "2024-12-20T21:29:05.744Z",
    },
  ];

  private productsKa: IProducts[] = [
    {
      id: 1,
      name: "ვაშლი",
      price: 2,
      category: "საკვები",
      createdAt: "2024-12-21T21:29:05.744Z",
    },
    {
      id: 2,
      name: "ბანანი",
      price: 3,
      category: "საკვები",
      createdAt: "2024-12-20T21:29:05.744Z",
    },
  ];

  getAllProducts(
    lang: string,
    header: { auth_token: string; },
    categoryQuery?: string,
    price?: number,
    id?: number
  ) {
    if (!header.auth_token) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    const products = lang === 'ka' ? this.productsKa : this.productsEn;

    let filteredProducts = products;

    if (categoryQuery) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === categoryQuery.toLowerCase()
      );
    }

    if (price) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price > price
      );
    }

    if (id) {
      filteredProducts = filteredProducts.filter((product) => product.id === id);
    }

    return filteredProducts;
  };

  getProductById(id: number) {
    const product = this.productsEn.find(el => el.id === id);
    if (!product) throw new HttpException("Product Not Found!", HttpStatus.BAD_REQUEST);
    return product;
  }

  createProduct(body: CreateProductDto) {
    const lastId = this.productsEn[this.productsEn.length - 1]?.id || 0;

    if (!body.name || !body.price || !body.category) throw new HttpException("Name, price and category are required", HttpStatus.BAD_REQUEST);

    const newProduct = {
      id: lastId + 1,
      name: body.name,
      price: body.price,
      category: body.category,
      createdAt: new Date().toISOString()
    }

    this.productsEn.push(newProduct);

    return newProduct;
  }

  deleteProduct(id: number) {
    const index = this.productsEn.findIndex(el => el.id === id);
    if (index === -1) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productsEn.splice(index, 1);
  }

  updateProduct(id: number, newProduct: UpdateProductDto) {
    const index = this.productsEn.findIndex((x) => x.id === id);

    if (index === -1) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const product = this.productsEn[index];

    if (newProduct.name) product.name = newProduct.name;
    if (newProduct.price) product.price = newProduct.price;
    if (newProduct.category) product.category = newProduct.category;

    return product;
  }
}
