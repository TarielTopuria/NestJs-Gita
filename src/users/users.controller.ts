import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./DTOs/create_user.dto";
import { UpdateUserDto } from "./DTOs/update_user.dto";
import { IsAdmin } from "./admin.guard";

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @UseGuards(IsAdmin)
  async createUser(@Body() body: CreateUserDto) {
    if (!body.firstName || !body.lastName || !body.email) {
      throw new HttpException(
        'firstName, lastName, and email are required',
        HttpStatus.BAD_REQUEST
      );
    }

    const createdUser = await this.usersService.createUser(body);
    return createdUser;
  }

  @Delete(':id')
  @UseGuards(IsAdmin)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Put(':id')
  @UseGuards(IsAdmin)
  async updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateDto);
  }
}
