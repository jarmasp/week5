import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SaveNewsDto } from "./dto/save-news.dto";
import { AuthGuard } from "@nestjs/passport";
import { RegisterUserDto } from "../users/dto/register-user.dto";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async create(@Body() RegisterAuthDto: RegisterUserDto) {
    return this.usersService.register(RegisterAuthDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Post(":id/save-news")
  @UseGuards(AuthGuard("jwt"))
  async readLater(@Param("id") id: string, @Body() saveNewsDto: SaveNewsDto) {
    return this.usersService.saveNews(id, saveNewsDto);
  }

  @Get(":id/saved-news")
  @UseGuards(AuthGuard("jwt"))
  async getSavedArticles(@Param("id") id: string) {
    return this.usersService.getSavedNews(id);
  }
}
