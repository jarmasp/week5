import { displayInterface, theGuardianLayout, NYTLayout, NewsApiLayout } from 'src/news/interfaces/news.interface';

const NYTauthors = (author: string): string => {
  const NYTAuthorRegex = /^(By)(?<author>[\w\.\,\- ]+)$/;
  
  const regexExec = NYTAuthorRegex.exec(author);

  if (regexExec && regexExec.groups && regexExec.groups.author) {
    return regexExec.groups.author;
  }
  return null;
}

export const displayNYT = (NYTLayout: NYTLayout): displayInterface => {
  const {
    web_url,
    headline: { main },
    pub_date,
    byline: { original },
  } = NYTLayout;

  return {
    source: 'New York Time',
    title: main,
    author: NYTauthors(original),
    publishedAt: pub_date,
    url: web_url,
  };
}


const theGuardianAuthor = (tags: { webTitle: string }[]): string => {
  const author: string[] = [];

  tags.forEach(tag => author.push(tag.webTitle));

  return author.join(', ');
}

export const displayTheGuardian = (theGuardianLayout: theGuardianLayout): displayInterface => {
  const {
    webTitle,
    webUrl,
    webPublicationDate,
    tags
  } = theGuardianLayout;

  return {
    source: 'The Guardian',
    title: webTitle,
    author: theGuardianAuthor(tags),
    publishedAt: webPublicationDate,
    url: webUrl
    
  };
}

export function displayNewsApi(NewsApiLayout: NewsApiLayout): displayInterface {
  const { source, author, publishedAt, url, title } = NewsApiLayout;

  return {
    source: source.name,
    title: title,
    author: author,
    publishedAt: publishedAt,
    url: url
  };
}