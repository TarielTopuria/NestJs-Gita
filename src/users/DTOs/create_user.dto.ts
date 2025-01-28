import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  
  @IsNotEmpty()
  @IsString()
  lastName: string;
  
  @IsNotEmpty()
  @IsString()
  email: string;
  
  @IsString()
  phoneNumber?: string;
  
  @IsString()
  gender?: string;
}
