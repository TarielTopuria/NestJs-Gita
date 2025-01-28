// expense.service.ts
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateExpenseDto } from "./DTOs/create_expense.dto";
import { UpdateExpenseDto } from "./DTOs/update_expense.dto";
import { UsersService } from "src/users/users.service";
import { Expense } from "./schema/expense.schema";


@Injectable()
export class ExpensesService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Expense.name) private readonly expenseModel: Model<Expense>,
  ) { }

  async getAllExpenses(): Promise<Expense[]> {
    return this.expenseModel.find().exec();
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return this.expenseModel.findById(id).populate('userId').exec();
  }

  async createExpense(body: CreateExpenseDto, userId: string): Promise<Expense> {
    const existingUser = await this.usersService.getUserById(userId);
    if (!existingUser) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const totalPrice = body.quantity * body.price;
    const newExpense = new this.expenseModel({
      category: body.category,
      productName: body.productName,
      quantity: body.quantity,
      price: body.price,
      totalPrice,
      userId,
    });

    const savedExpense = await newExpense.save();

    await this.usersService.addExpenseToUser(userId, savedExpense.id);

    return savedExpense;
  }


  async deleteExpense(id: string): Promise<Expense> {
    const deleted = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    }
    return deleted;
  }


  async updateExpense(id: string, newExpense: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    }

    if (newExpense.category) expense.category = newExpense.category;
    if (newExpense.productName) expense.productName = newExpense.productName;
    if (typeof newExpense.quantity === 'number') expense.quantity = newExpense.quantity;
    if (typeof newExpense.price === 'number') expense.price = newExpense.price;

    expense.totalPrice = expense.price * expense.quantity;

    await expense.save();
    return expense;
  }
}
