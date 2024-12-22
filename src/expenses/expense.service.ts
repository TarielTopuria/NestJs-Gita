import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./DTOs/create_expense.dto";
import { UpdateExpenseDto } from "./DTOs/update_expense.dto";

@Injectable()
export class ExpensesService {
  private expenses = [{
    id: 1,
    category: "Food",
    productName: "Dinner",
    quantity: 2,
    price: 15,
    totalPrice: 30
  },
  {
    id: 2,
    category: "Transportation",
    productName: "Petrol",
    quantity: 30,
    price: 3,
    totalPrice: 90
  }];

  getAllExpenses() {
    return this.expenses;
  }

  getExpenseById(id: number) {
    return this.expenses.find(el => el.id === id);
  }

  createExpense(body: CreateExpenseDto) {
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    const newExpense = {
      id: lastId + 1,
      category: body.category,
      productName: body.productName,
      quantity: body.quantity,
      price: body.price,
      totalPrice: body.quantity * body.price
    }

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