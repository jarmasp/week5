import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users, UsersSchema } from 'src/repositories/schemas/users.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      }
    ]), 
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`, 
      signOptions: { expiresIn: '60s' },
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
