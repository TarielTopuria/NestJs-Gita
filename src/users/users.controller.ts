import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./DTOs/create_user.dto";
import { UpdateUserDto } from "./DTOs/update_user.dto";
import { IsAdmin } from "./admin.guard";

@Controller('users')
export class UserController {

  constructor(private usersService: UsersService) { }
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param() params) {
    const user = this.usersService.getUserById(Number(params.id));
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Post()
  @UseGuards(IsAdmin)
  createUser(@Body() body: CreateUserDto) {
    const createdUser = this.usersService.createUser(body);
    if (!createdUser.firstName || !createdUser.lastName || !createdUser.email) throw new HttpException('name and age is required', HttpStatus.BAD_REQUEST);
    return createdUser;
  }

  @Delete(':id')
  @UseGuards(IsAdmin)
  deleteUser(@Param() params) {
    return this.usersService.deleteUser(Number(params.id));
  }

  @Put(':id')
  @UseGuards(IsAdmin)
  updateUser(@Param() params, @Body() updateDto: UpdateUserDto) {
    return this.usersService.updateUser(Number(params.id), updateDto);
  }
}