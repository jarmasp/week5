import { IsNotEmpty } from "class-validator";

export class SaveNewsDto {

  @IsNotEmpty()
  source: string
  
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  author: string
  
  @IsNotEmpty()
  publishedAt: string

  @IsNotEmpty()
  url: string

}