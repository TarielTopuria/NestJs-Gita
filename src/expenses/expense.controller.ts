import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ExpensesService } from "./expense.service";
import { CreateExpenseDto } from "./DTOs/create_expense.dto";
import { UpdateExpenseDto } from "./DTOs/update_expense.dto";

@Controller('expenses')
export class ExpenseController {

  constructor(private expensesService: ExpensesService) { }
  @Get()
  getExpenses() {
    return this.expensesService.getAllExpenses();
  }

  @Get(':id')
  getExpenseById(@Param() params) {
    const expense = this.expensesService.getExpenseById(Number(params.id));
    if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    return expense;
  }

  @Post()
  createExpense(@Body() body: CreateExpenseDto) {
    const createdExpense = this.expensesService.createExpense(body);
    if (!createdExpense.category || !createdExpense.productName || !createdExpense.quantity || !createdExpense.price || !createdExpense.quantity) throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    return createdExpense;
  }

  @Delete(':id')
  deleteExpense(@Param() params) {
    return this.expensesService.deleteExpense(Number(params.id));
  }

  @Put(':id')
  updateExpense(@Param() params, @Body() updateDto: UpdateExpenseDto) {
    return this.expensesService.updateExpense(Number(params.id), updateDto);
  }
}