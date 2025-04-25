/**
 * Represents a news article snippet.
 */
export interface NewsSnippet {
  /**
   * The title of the news article.
   */
  title: string;
  /**
   * A short snippet of the news article content, limited to 200 characters.
   */
  snippet: string;
  /**
   * The URL of the full news article.
   */
  url: string;
  /**
   * The date the news was published.
   */
  date: string;
    /**
   * The name of the publisher.
   */
  publisher: string;
    /**
   * The category of the news.
   */
  category: string;
  /**
   * Number of readers
   */
  readers: number;
}

/**
 * Represents a news publisher.
 */
export interface Publisher {
  /**
   * The name of the publisher.
   */
  name: string;
  /**
   * The URL of the publisher's logo.
   */
  logoUrl: string;
}

/**
 * Asynchronously retrieves news snippets for a given publisher.
 *
 * @param publisherName The name of the news publisher.
 * @returns A promise that resolves to an array of NewsSnippet objects.
 */
export async function getNewsSnippets(publisherName: string): Promise<NewsSnippet[]> {
  const snippets: NewsSnippet[] = [];
  const categories = ['Politics', 'Technology', 'Business', 'Sports', 'Entertainment'];

  for (let i = 1; i <= 5; i++) {
    snippets.push({
      title: `News Title ${i} from ${publisherName}`,
      snippet: `This is news snippet ${i} from ${publisherName}. It is limited to 200 characters. `.repeat(2).substring(0, 200),
      url: `https://example.com/news${i}`,
      date: `2024-01-${20 + i}`,
      publisher: publisherName,
      category: categories[i % categories.length],
      readers: Math.floor(Math.random() * 1000)
    });
  }
  return snippets;
}

/**
 * Asynchronously retrieves a list of supported news publishers.
 *
 * @returns A promise that resolves to an array of Publisher objects.
 */
export async function getPublishers(): Promise<Publisher[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Publisher A',
      logoUrl: 'https://picsum.photos/id/237/200/300'
    },
    {
      name: 'Publisher B',
      logoUrl: 'https://picsum.photos/id/238/200/300'
    },
    {
      name: 'Publisher C',
      logoUrl: 'https://picsum.photos/id/239/200/300'
    },
        {
      name: 'Publisher D',
      logoUrl: 'https://picsum.photos/id/240/200/300'
    },
    {
      name: 'Publisher E',
      logoUrl: 'https://picsum.photos/id/241/200/300'
    },
    {
      name: 'Publisher F',
      logoUrl: 'https://picsum.photos/id/242/200/300'
    },
        {
      name: 'Publisher G',
      logoUrl: 'https://picsum.photos/id/243/200/300'
    },
    {
      name: 'Publisher H',
      logoUrl: 'https://picsum.photos/id/244/200/300'
    },
    {
      name: 'Publisher I',
      logoUrl: 'https://picsum.photos/id/245/200/300'
    },
        {
      name: 'Publisher J',
      logoUrl: 'https://picsum.photos/id/246/200/300'
    },
  ];
}
