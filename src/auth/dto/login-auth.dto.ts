import { IsNotEmpty, Length, IsString } from "class-validator";

export class LoginAuthDto {
  @IsNotEmpty()
  @Length(3, 12)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Length(8, 24)
  @IsString()
  password: string;
}
