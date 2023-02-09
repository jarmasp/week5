import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { NewsHelper } from "./helpers/news.helper";

@Module({
  controllers: [NewsController],
  imports: [HttpModule],
  providers: [NewsService, NewsHelper],
})
export class NewsModule {}
