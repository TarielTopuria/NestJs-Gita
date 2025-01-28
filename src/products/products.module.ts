import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
