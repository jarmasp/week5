import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { AuthGuard } from "@nestjs/passport";
import { QuerySourceDto } from "./dto/query-source.dto";

@Controller("api")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get("news")
  @UseGuards(AuthGuard("jwt"))
  async getNews(@Query() querySourceDto: QuerySourceDto) {
    return this.newsService.searchBySource(querySourceDto);
  }
}
