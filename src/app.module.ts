import { Module } from "@nestjs/common";
import { NewsController } from "./news/news.controller";
import { NewsService } from "./news/news.service";
import { NewsModule } from "./news/news.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { NewsHelper } from "./news/helpers/news.helper";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NewsModule,
    HttpModule,
    UsersModule,
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsHelper],
})
export class AppModule {}
