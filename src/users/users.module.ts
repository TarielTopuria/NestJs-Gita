import { Module } from "@nestjs/common"
import { UserController } from "./users.controller"
import { UsersService } from "./users.service"
import { User, UserSchema } from "./schema/user.schema"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService]
})

export class UserModule { }