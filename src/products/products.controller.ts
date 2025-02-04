// products.controller.ts
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common'; // if needed
import { ProductsService } from './products.service';
import { PricePipe } from './Pipes/price.pipe';
import { CreateProductDto } from './DTOs/product_create.dto';
import { UpdateProductDto } from './DTOs/product_update.dto';
import mongoose from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProductsWithCategory(
    @Headers('auth_token') authToken: string,
    @Headers('user_id') userId: mongoose.Schema.Types.ObjectId,
    @Query('category') categoryQuery: string,
    // We still use PricePipe for demonstration, or you can remove it if you want
    @Query('price', new PricePipe({ optional: false })) price: number,
    // We'll treat 'id' as a string, because it's a Mongo _id
    @Query('id') id: string,
    @Query('lang', new DefaultValuePipe('en')) lang: string
  ) {
    // userId is optional, so if not present it stays undefined
    const finalUserId = userId || undefined;

    return this.productsService.getAllProducts(
      lang,
      { auth_token: authToken },
      categoryQuery,
      price,
      id,
      finalUserId
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateDto);
  }
}
