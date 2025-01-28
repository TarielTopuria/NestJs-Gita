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
  Query,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./DTOs/create_user.dto";
import { UpdateUserDto } from "./DTOs/update_user.dto";
import { IsAdmin } from "./admin.guard";
import { faker } from '@faker-js/faker';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) { }

  @Get()
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    let pageNum = +page || 1;
    let limitNum = +limit || 10;

    limitNum = Math.min(limitNum, 50);

    return this.usersService.getAllUsersPaginated(pageNum, limitNum);
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

  @Get('count')
  async getUsersCount() {
    return this.usersService.countUsers();
  }


  @Post('seed')
  async seedUsers() {
    const usersToCreate = 30000;
    const bulkData = [];

    for (let i = 0; i < usersToCreate; i++) {
      bulkData.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        gender: faker.person.sex(),
        subscriptionDate: new Date().toISOString(),
      });
    }

    await this.usersService.bulkCreate(bulkData);

    return { message: `${usersToCreate} users created` };
  }
}
