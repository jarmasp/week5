import { Injectable } from "@nestjs/common";
import { NEWS } from "./news.constants";
import { NewsHelper } from "./helpers/news.helper";
import { QuerySourceDto } from "./dto/query-source.dto";

@Injectable()
export class NewsService {
  constructor(private readonly newsHelper: NewsHelper) {}

  async searchBySource(querySourceDto: QuerySourceDto) {
    const { q, source } = querySourceDto;
    switch (source.toLowerCase()) {
      case NEWS.NYT:
        return this.newsHelper.getNYT(q);

      case NEWS.GUARDIAN:
        return this.newsHelper.getGuardian(q);

      case NEWS.APINEWS:
        return this.newsHelper.getNewsAPI(q);

      case NEWS.ALL:
        return this.newsHelper.getMergedNews(q);

      default:
        return (
          `Invalid source. To search The York Times articles write nyt, to search The Guardian articles write guardian, to search The newsAPI articles write newsAPI or write all to search all sources` &&
          this.newsHelper.getMergedNews(q)
        );
    }
  }
}
