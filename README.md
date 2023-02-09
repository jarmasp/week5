# Week 5 - News aggregator

APi built using NestJS framework.

Searches for articles in the New York Times and The Guardian news papers APIs, any search can be done in either of the sources or both of them

## Run Locally

Clone the project

```bash
  git clone https://gitlab.com/tp-node.js-2022/week-5.git
```

Go to the project directory

```bash
  cd week-5
```

Install dependencies

```bash
  npm i
  nestjs/axios @1.0.0,
  nestjs/common @9.0.0,
  nestjs/core @9.0.0,
  nestjs/platform-express @9.0.0,
  reflect-metadata @0.1.13,
  rimraf @3.0.2,
  rxjs @7.2.0
```

Start the server

```bash
  npm run start
```

## API Reference

#### Get all items

```http
  GET /news?search=keyword&source=sources
```

| Parameter | Type     | Description                                                                                                                                               |
| :-------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search`  | `string` | **Required**. The keywords want to search for, "rain" for example, logical operator can be used to search for multiple words "rain&landslide" for example |
| `source`  | `string` | **Required**. The source for the news you are looking for, be it New York Times (nyc), The Guardian (guardian), newsAPI (apinews) or all                  |

Searches for articles that contain the keyword(s) from the specified source(s).

## Tech Stack

**Server:**

    nestjs/cli @9.0.0,
    nestjs/schematics @9.0.0,
    nestjs/testing @9.0.0,
    types/express @4.17.13,
    types/jest @28.1.8,
    types/node @16.0.0,
    types/supertest @2.0.11,
    typescript-eslint/eslint-plugin @5.0.0,
    typescript-eslint/parser @5.0.0,
    eslint @8.0.1,
    eslint-config-prettier @8.3.0,
    eslint-plugin-prettier @4.0.0,
    jest @28.1.3,
    prettier @2.3.2,
    source-map-support @0.5.20,
    supertest @6.1.3,
    ts-jest @28.0.8,
    ts-loader @9.2.3,
    ts-node @10.0.0,
    tsconfig-paths @4.1.0,
    typescript @4.7.4

# Patterns and anti-patterns

## NestJS design patterns 

Singleton:

NestJS implements this pattern when we define our classes as providers in a module, this classes can later be injected and the instance of the injected class will be the same if/when 
is shared with other modules

Dependecy injection: 

As mentioned before in NestJS classes can be injected, to do this the decorator @Injectable() must be used. When done correctly the class can be used in services and controllers through
a module, when it's injected in the constructor. 

Decorator: 

NestJS Makes extensive use of the typescript decorator syntax in classes and objects alike, decorators can also be used within method, property and parameter declarations to add extra
functionality or specify the behaviour of the code.

Chain of responsability: 

NestJS provides middleware much alike ExpressJS, but it's worth mentioning that NestJS also provides with out the box custom middleware with the name of guards, interceptors and pipes.
All of these middlewares function as a chain of responsability, as example we can have a middleware (class validation pipe) that validates the data of a login attemp, another middleware (guard) 
that verifies de username and password and a third middleware (interceptor) that do transforms the data in the response object that the user will recieve. 
 
## Which patterns can be used on your application?

Proxy:

The proxy design pattern will allow me to future proof the API calls to the news sources, as of now being only 3 APIs calling them all it's not an expensive operation, but if the application had 
to scale and add several more news sources APIs and several more clients it could easily become an expensive operation, another aspect to take into account would be security, this time around it's 
not a big deal, but if this was a paid service a security proxy would be ideal to make the APIs calls and be sure if the client has the appropiate credentials to make the request (for example if the 
app had several paying tier, at tier 1 we have someone who pays 5 dollars a month and have acces to five news sources and at tier 10 we have someone who pays 15 dollars a month and has access to 20 
news sources)

    // news.service.ts
    @Injectable()
    export class NewsService {
      constructor(private readonly newsHelper: NewsHelper) {}

      async searchBySource(q: string, source: string) {
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
            return `Invalid source. To search The York Times articles write nyt, to search The Guardian articles write guardian, to search The newsAPI articles write newsAPI or write all to search all sources`;
        }
      }

The news.services.ts became a proxy and the news.helper.ts file interacts with the APIs

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


Facade: 

In the single end-point to search for news articles the facade design pattern is being utilized; the complex sub sistem of fetching data from the several news APIs, the choice of which one to use,
and the serialization/formatting of the news sources into a singular layout to display the results is being presented to the user in the facade of a single point API

## How those patterns could be implemented?

In the case of the facade design pattern, all of the following are calling external APIs and serialize the result into the same layout 

    private async getNYTNews(q: string): Promise<Observable<displayInterface[]>> {
      const NYT_Key = this.configService.get<string>('NYT_KEY')

      try {
        return this.httpService
          .get(`${NYT_URL}?q=${q}&api-key=${NYT_Key}`)
          .pipe(
            map(res => res.data.response.docs
              .map(displayNYT))
          );
      }
      catch {
        throw new ServiceUnavailableException(`The New York times doesn't respond`);
      }
    } 


    private async getTheGuardianNews(q: string): Promise<Observable<displayInterface[]>> {
      const theGuardian_Key = this.configService.get<string>('GUARDIAN_KEY')

      try {
        return this.httpService
          .get(`${theGuardian_URL}?q=${q}&api-key=${theGuardian_Key}${theGuardianAuthors}`)
          .pipe(
            map(res => res.data.response.results
              .map(displayTheGuardian))
          );
      }
      catch {
        throw new ServiceUnavailableException(`The Guardian doesn't respond`);
      }
    }

    private async getApiNews(q: string): Promise<Observable<displayInterface[]>> {
      const newsAPI_KEY = this.configService.get<string>('NEWSAPI_KEY');

      try {
        return this.httpService
          .get(`${news_URL}?q=${q}&apiKey=${newsAPI_KEY}`)
          .pipe(
            map(res => res.data.articles
              .map(displayNewsApi))
          );
      }
      catch {
        throw new ServiceUnavailableException(`The newsAPI doesn't respond`);
      }
    }

    private async searchAll(q: string) {
      const NYTNews = await this.getNYTNews(q);
      const guardianNews = await this.getTheGuardianNews(q);
      const newsApiNews = await this.getApiNews(q);

      return merge(guardianNews, NYTNews, newsApiNews).pipe(reduce((acc, value) => [...acc, ...value]));
    } 

The end user doesn't see any of this taking place, 

    async searchBySource(q: string, source: string) {
      switch (source.toLowerCase()) {
        case 'nyt':
          return this.getNYTNews(q);
        
        case 'guardian':
          return this.getTheGuardianNews(q)
        
        case 'apinews':
          return this.getApiNews(q)
        
        case 'all':
          return this.searchAll(q)
    
        default:
          throw new BadRequestException(`Invalid source.
           To search The York Times articles write nyt, 
           to search The Guardian articles write guardian, 
           to search The newsAPI articles write newsAPI 
           or write all to search all sources`)
          && this.getTheGuardianNews;
      }
    }

This functions makes sure that to search a topic the user only has to write the desired source and the search topic

    @Get()
    @UseGuards(AuthGuard('jwt'))
      async getNews(@Query('q') query: string, @Query('source') source: string) {
        return this.newsService.searchBySource(query, source);
    }

And this controller exposes all of it on a single end-point that could be called facade for the users

## How to implement the Dependency Injection pattern in Typescript?

In the module file I'm importing the moongose module 

    // auth.module.ts
    import { MongooseModule } from '@nestjs/mongoose';

    @Module({
      imports: [MongooseModule.forFeature([
        {
          name: Users.name,
          schema: UsersSchema,
        }
      ]), 

Then inside the services file inside the class declaration we use the @InjectModel decorator but we should focus on the usersModule, this avoid manual instanciation 

    // auth.service.ts
    @Injectable()
    export class AuthService {
      constructor(
        @InjectModel(Users.name) private usersModule: Model<UsersDocument>,
        private jwtService: JwtService
      ) {}

Now we can use any method defined in usersModule, this being created from moongose includes the finOne method as showed in the example below

    async login(userObject: LoginAuthDto) {
      const { name, password } = userObject;
      const findUser = await this.usersModule.findOne({ name });

Checkout how this.usersModule can use the findOne method of mongoose, this.usersModule is an instance of UsersModule that was injected in the constructor of AuthService 

## What is an antipattern? 

Much like design patterns, antipatterns are solutions to common problems, but althought antipatterns may solve the problem it introduces it's own set of problems; antipatterns are harder to mantain over time,
are more susceptible to propagation errors and are overall harder to read and troubleshoot 

## Removed antipatterns

Bloat, spaghetti code and Functional Decomposition: 

In the news.services.ts file were several private functions that were called inside other private functions (4 to be precise), this was a case of functional decomposition, 
besides that all of the function took almost a 130 lines of code, now it's reduced to 30 lines, and the cherry on top would be the poor readability of the code that was there.   

Now the functions previously defined in news service have a class of their own and live in the news helper file, this class is imported to the nest module files and the news services file