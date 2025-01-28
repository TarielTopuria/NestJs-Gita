import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./DTOs/create_user.dto";
import { UpdateUserDto } from "./DTOs/update_user.dto";

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      firstName: "Tato",
      lastName: "Topuria",
      email: "TatoTophuria@gmail.com",
      phoneNumber: "123456789",
      gender: "Male",
      subscriptionDate: "2024-12-01T10:00:00.000Z"
    },
    {
      id: 2,
      firstName: "Giorgi",
      lastName: "Giorgadze",
      email: "GiorgiGiorgadze@gmail.to",
      phoneNumber: "0987654321",
      gender: "Male",
      subscriptionDate: "2024-11-13T10:00:00.000Z"
    },
  ];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    return this.users.find(el => el.id === id);
  }

  createUser(body: CreateUserDto) {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      subscriptionDate: new Date().toISOString()
    }

    this.users.push(newUser);

    return newUser;
  }

  deleteUser(id: number) {
    const index = this.users.findIndex(el => el.id === id);
    if (index === -1) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.users.splice(index, 1);
  }

  updateUser(id: number, newUser: UpdateUserDto) {
    const index = this.users.findIndex((x) => x.id === id);

    if (index === -1) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (newUser.firstName) this.users[index].firstName = newUser.firstName;
    if (newUser.lastName) this.users[index].lastName = newUser.lastName;
    if (newUser.email) this.users[index].email = newUser.email;
    if (newUser.phoneNumber) this.users[index].phoneNumber = newUser.phoneNumber;
    if (newUser.gender) this.users[index].gender = newUser.gender;

    return this.users[index];
  }
}