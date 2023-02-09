import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users, UsersDocument } from "../repositories/schemas/users.schemas";
import { Model } from "mongoose";
import { hash } from "bcrypt";
import { SaveNewsDto } from "./dto/save-news.dto";
import { RegisterUserDto } from "../users/dto/register-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModule: Model<UsersDocument>
  ) {}

  async register(userObject: RegisterUserDto) {
    const { password } = userObject;
    const hashedPassword = await hash(password, 10);
    userObject = { ...userObject, password: hashedPassword };

    return this.usersModule.create(userObject) && `User  was created`;
  }

  async findAll() {
    return this.usersModule.find({});
  }

  async findOne(id: string) {
    return this.usersModule.findById(id);
  }

  async update(id: string, userObject: UpdateUserDto) {
    const { password } = userObject;
    const hashedPassword = await hash(password, 10);
    userObject = { ...userObject, password: hashedPassword };

    const updateUser = await this.usersModule.findByIdAndUpdate(id, userObject);

    return updateUser && `User with ${id} was updated`;
  }

  async remove(id: string) {
    return (
      this.usersModule.findByIdAndDelete(id) && `User with ${id} was removed`
    );
  }

  async saveNews(id: string, newsObject: SaveNewsDto) {
    const user = await this.usersModule.findById(id);
    user.savedNews.push(newsObject);

    return user.save() && newsObject;
  }

  async getSavedNews(id: string) {
    return this.usersModule.findById(id, "savedNews");
  }
}
