import { Module } from "@nestjs/common"
import { ExpenseController } from "./expense.controller"
import { ExpensesService } from "./expense.service"

@Module({
  controllers: [ExpenseController],
  providers: [ExpensesService]
})

export class ExpenseModule { }