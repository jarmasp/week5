import { IsNotEmpty, IsString } from "class-validator";

export class QuerySourceDto {
  @IsNotEmpty()
  @IsString()
  q: string;

  @IsNotEmpty()
  @IsString()
  source: string;
}
