// expense.controller.ts
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ExpensesService } from "./expense.service";
import { CreateExpenseDto } from "./DTOs/create_expense.dto";
import { UpdateExpenseDto } from "./DTOs/update_expense.dto";
import { HasUserId } from "src/users/hasUser.guard";

@Controller('expenses')
export class ExpenseController {
  constructor(private expensesService: ExpensesService) { }

  @Get()
  async getExpenses() {
    return this.expensesService.getAllExpenses();
  }

  @Get(':id')
  async getExpenseById(@Param('id') id: string) {
    const expense = await this.expensesService.getExpenseById(id);
    if (!expense) {
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    }
    return expense;
  }

  @Post()
  @UseGuards(HasUserId)
  async createExpense(@Req() request, @Body() body: CreateExpenseDto) {
    const userId = request.userId;

    if (!body.category || !body.productName || !body.quantity || !body.price) {
      throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    }

    const createdExpense = await this.expensesService.createExpense(body, userId);
    return createdExpense;
  }


  @Delete(':id')
  async deleteExpense(@Param('id') id: string) {
    return this.expensesService.deleteExpense(id);
  }

  @Put(':id')
  async updateExpense(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    return this.expensesService.updateExpense(id, updateDto);
  }
}
