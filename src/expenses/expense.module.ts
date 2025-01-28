import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpensesService } from './expense.service';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { TimeMiddleware } from '../middlewares/time.middleware';
import { ValidAppMiddleware } from '../middlewares/valid-app.middleware';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
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
