import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './DTOs/product_create.dto';
import { UpdateProductDto } from './DTOs/product_update.dto';
import { Product } from './schema/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }

  async getAllProducts(
    lang: string,
    header: { auth_token: string },
    categoryQuery?: string,
    price?: number,
    id?: string,
    userId?: mongoose.Schema.Types.ObjectId
  ): Promise<any[]> {
    if (!header?.auth_token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const filter: any = {};
    if (lang) filter.lang = lang;
    if (categoryQuery) {
      filter.category = new RegExp(`^${categoryQuery}$`, 'i');
    }
    if (id) {
      filter._id = id;
    }
    if (price) {
      filter.price = { $gt: price };
    }

    let products = await this.productModel.find(filter).lean().exec();

    if (userId) {
      const user = await this.usersService.getUserById(userId);
      if (user && this.isSubscriptionActive(user.subscriptionDate)) {
        products = products.map((p) => ({
          ...p,
          price: p.price * 0.8,
        }));
      }
    }

    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new HttpException('Product Not Found!', HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  async createProduct(body: CreateProductDto): Promise<Product> {
    if (!body.name || !body.price || !body.category) {
      throw new HttpException(
        'Name, price and category are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProduct = new this.productModel({
      ...body,
      createdAt: new Date().toISOString(),
    });

    return newProduct.save();
  }

  async deleteProduct(id: string): Promise<Product> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return deleted;
  }

  async updateProduct(id: string, newProduct: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, newProduct, { new: true })
      .exec();

    if (!updated) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  private isSubscriptionActive(subscriptionDateString: string): boolean {
    if (!subscriptionDateString) return false;
    const subscriptionDate = new Date(subscriptionDateString);
    const now = new Date();
    const diffMs = now.getTime() - subscriptionDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }
}
