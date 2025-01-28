import { Body, Controller, DefaultValuePipe, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PricePipe } from './Pipes/price.pipe';
import { CreateProductDto } from './DTOs/product_create.dto';
import { UpdateProductDto } from './DTOs/product_update.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Get()
  getAllProductsWithCategory(
    @Headers('auth_token') authToken: string,
    @Headers('user_id') userId: string,
    @Query('category') categoryQuery: string,
    @Query('price', new PricePipe({ optional: false })) price: number,
    @Query('id', new ParseIntPipe({ optional: true })) id: number,
    @Query('lang', new DefaultValuePipe('en')) lang: string
  ) {
    const parsedUserId = userId ? parseInt(userId, 10) : undefined;
    return this.productsService.getAllProducts(lang, { auth_token: authToken }, categoryQuery, Number(price), id, parsedUserId);
  };

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id) {
    return this.productsService.getProductById(id);
  };

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  };

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id) {
    return this.productsService.deleteProduct(id);
  };

  @Put(':id')
  updateProduct(@Param() params, @Body() updateDto: UpdateProductDto) {
    return this.productsService.updateProduct(Number(params.id), updateDto);
  };
}
