import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { Users, UsersDocument } from "src/repositories/schemas/users.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModule: Model<UsersDocument>,
    private jwtService: JwtService
  ) {}

  async login(userObject: LoginAuthDto) {
    const { name, password } = userObject;
    const foundUser = await this.usersModule.findOne({ name });

    if (!foundUser) {
      throw new NotFoundException(`User ${name} not found`);
    }

    const checkPassword = await compare(password, foundUser.password);

    if (!checkPassword) {
      throw new UnauthorizedException("Incorrect password");
    }

    const payload = { id: foundUser._id, name: foundUser.name };
    const token = this.jwtService.sign(payload);

    const userData = {
      id: foundUser._id,
      user: foundUser.name,
      token,
    };

    return `Login successful` && userData;
  }
}
