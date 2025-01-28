import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./DTOs/create_user.dto";
import { UpdateUserDto } from "./DTOs/update_user.dto";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const newUser = new this.userModel({
      ...body,
      subscriptionDate: new Date().toISOString(),
    });
    return newUser.save();
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return deletedUser;
  }

  async updateUser(id: string, newUser: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, newUser, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  async addExpenseToUser(userId: string, expenseId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { expenses: expenseId } },
      { new: true },
    );
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async bulkCreate(usersData: Array<Partial<User>>) {
    return this.userModel.insertMany(usersData);
  }

  async getAllUsersPaginated(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
