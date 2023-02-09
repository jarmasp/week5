export interface NYTLayout {
  web_url: string;
  headline: {
    main: string;
  };
  byline: {
    original: string;
  };
  pub_date: Date;
}

export interface theGuardianLayout {
  webPublicationDate: Date;
  webTitle: string;
  webUrl: string;
  tags: { webTitle: string }[];
}

export interface NewsApiLayout {
  source: { id: string; name: string };
  author: string;
  title: string;
  url: string;
  publishedAt: Date;
}

export interface displayInterface {
  source: string;
  title: string;
  author: string;
  publishedAt: Date;
  url: string;
}
