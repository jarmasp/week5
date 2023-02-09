import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { map, reduce } from "rxjs/operators";
import {
  displayNYT,
  displayTheGuardian,
  displayNewsApi,
} from "../interfaces/utils";
import { Observable } from "rxjs";
import { displayInterface } from "../interfaces/news.interface";
import { merge } from "rxjs";

@Injectable()
export class NewsHelper {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getNYT(q: string): Promise<Observable<displayInterface[]>> {
    const url = `${this.configService.get<string>(
      "NYT_URL"
    )}?q=${q}&api-key=${this.configService.get<string>("NYT_KEY")}`;

    return this.httpService
      .get(url)
      .pipe(map((res) => res.data.response.docs.map(displayNYT)));
  }

  async getGuardian(q: string): Promise<Observable<displayInterface[]>> {
    const url = `${this.configService.get<string>(
      "theGuardian_URL"
    )}?q=${q}&api-key=${this.configService.get<string>(
      "GUARDIAN_KEY"
    )}${this.configService.get<string>("theGuardianAuthors")}`;

    return this.httpService
      .get(url)
      .pipe(map((res) => res.data.response.docs.map(displayTheGuardian)));
  }

  async getNewsAPI(q: string): Promise<Observable<displayInterface[]>> {
    const url = `${this.configService.get<string>(
      "news_URL"
    )}?q=${q}&apiKey=${this.configService.get<string>("NEWSAPI_KEY")}`;

    return this.httpService
      .get(url)
      .pipe(map((res) => res.data.response.docs.map(displayNewsApi)));
  }

  async getMergedNews(q: string): Promise<Observable<displayInterface[]>> {
    const NYTNews = await this.getNYT(q);
    const guardianNews = await this.getGuardian(q);
    const newsApiNews = await this.getNewsAPI(q);

    return merge(guardianNews, NYTNews, newsApiNews).pipe(
      reduce((acc, value) => [...acc, ...value])
    );
  }
}
