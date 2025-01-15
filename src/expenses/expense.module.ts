import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpensesService } from './expense.service';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { TimeMiddleware } from '../middlewares/time.middleware';
import { ValidAppMiddleware } from '../middlewares/valid-app.middleware';

@Module({
  controllers: [ExpenseController],
  providers: [ExpensesService],
})
export class ExpenseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidAppMiddleware, TimeMiddleware, PermissionMiddleware)
      .forRoutes(ExpenseController);
  }
}
