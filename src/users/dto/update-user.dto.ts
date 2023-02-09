import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, Length, IsString } from "class-validator";
import { RegisterUserDto } from "./register-user.dto";

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsNotEmpty()
  @Length(3, 12)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Length(8, 24)
  @IsString()
  password: string;
}
