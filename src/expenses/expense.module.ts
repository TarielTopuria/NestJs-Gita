import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseController } from './expense.controller';
import { ExpensesService } from './expense.service';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { TimeMiddleware } from '../middlewares/time.middleware';
import { ValidAppMiddleware } from '../middlewares/valid-app.middleware';
import { UserModule } from 'src/users/users.module';
import { Expense, ExpenseSchema } from './schema/expense.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }])
  ],
  controllers: [ExpenseController],
  providers: [ExpensesService],
})
export class ExpenseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimeMiddleware, PermissionMiddleware)
      .forRoutes(ExpenseController);
  }
}
