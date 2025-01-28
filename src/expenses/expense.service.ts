import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./DTOs/create_expense.dto";
import { UpdateExpenseDto } from "./DTOs/update_expense.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ExpensesService {
  constructor(private readonly usersService: UsersService) {}
  
  private expenses = [
    {
      id: 1,
      category: "Food",
      productName: "Dinner",
      quantity: 2,
      price: 15,
      totalPrice: 30,
      userId: 1
    },
    {
      id: 2,
      category: "Transportation",
      productName: "Petrol",
      quantity: 30,
      price: 3,
      totalPrice: 90,
      userId: 2
    }
  ];

  getAllExpenses() {
    return this.expenses;
  }

  getExpenseById(id: number) {
    return this.expenses.find(el => el.id === id);
  }

  createExpense(body: CreateExpenseDto, userId: number) {
    const existingUser = this.usersService.getUserById(userId);
    if (!existingUser) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    const newExpense = {
      id: lastId + 1,
      category: body.category,
      productName: body.productName,
      quantity: body.quantity,
      price: body.price,
      totalPrice: body.quantity * body.price,
      userId
    };

    this.expenses.push(newExpense);
    return newExpense;
  }

  deleteExpense(id: number) {
    const index = this.expenses.findIndex(el => el.id === id);
    if (index === -1) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    return this.expenses.splice(index, 1);
  }

  updateExpense(id: number, newExpense: UpdateExpenseDto) {
    const index = this.expenses.findIndex((x) => x.id === id);

    if (index === -1) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

    const expense = this.expenses[index];

    if (newExpense.category) expense.category = newExpense.category;
    if (newExpense.productName) expense.productName = newExpense.productName;
    if (newExpense.quantity) expense.quantity = newExpense.quantity;
    if (newExpense.price) expense.price = newExpense.price;

    if (newExpense.price && newExpense.quantity) {
      expense.totalPrice = newExpense.price * newExpense.quantity;
    } else if (newExpense.price) {
      expense.totalPrice = newExpense.price * expense.quantity;
    } else if (newExpense.quantity) {
      expense.totalPrice = expense.price * newExpense.quantity;
    }

    return expense;
  }
}