'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import './globals.css';

const ITEMS_PER_PAGE = 2;

// Function to shuffle array elements
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [allNewsSnippets, setAllNewsSnippets] = useState<NewsSnippet[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPublishersAndNews = async () => {
      const publisherList = await getPublishers();
      setPublishers(publisherList);

      // Fetch news from all publishers and combine
      let allNews: NewsSnippet[] = [];
      for (const publisher of publisherList) {
        const snippets = await getNewsSnippets(publisher.name);
        allNews = allNews.concat(snippets);
      }

      // Sort all news by date and then shuffle for randomness
      const sortedNews = allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const shuffledNews = shuffleArray(sortedNews);
      setAllNewsSnippets(shuffledNews);
    };

    fetchPublishersAndNews();
  }, []);

  // Recalculate visible news when startIndex or allNewsSnippets changes
  const visibleNews = React.useMemo(() => {
    return allNewsSnippets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [startIndex, allNewsSnippets]);

  const handleScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = event.deltaY > 0 ? 1 : -1;
    const newStartIndex = Math.max(
      0,
      Math.min(startIndex + scrollAmount, Math.max(0, allNewsSnippets.length - ITEMS_PER_PAGE))
    );
    setStartIndex(newStartIndex);
  }, [startIndex, allNewsSnippets.length]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">NewsFlash</h1>
        <div className="flex gap-2">
          <Button variant="outline">Login</Button>
          <Button>Register</Button>
        </div>
      </div>
      <div className="w-full">
        {allNewsSnippets.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold mb-2">
              News
            </h2>
            <Separator className="mb-4" />
            <div
              ref={containerRef}
              className="flex flex-col gap-4 overflow-y-hidden h-[calc(100vh - 200px)]"
              onWheel={handleScroll}
            >
              <div
                className="transition-transform duration-300 ease-in-out"
                style={{ transform: `translateY(-${startIndex * (100 / ITEMS_PER_PAGE)}%)` }}
              >
                {visibleNews.map((news, index) => (
                  <Card key={index} className="flex flex-col md:flex-row h-[calc(100vh - 250px)]">
                    <div className="md:w-2/3 p-4">
                      <CardHeader>
                        <CardTitle>{news.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{news.snippet}</CardDescription>
                      </CardContent>
                    </div>
                    <div className="md:w-1/3">
                      <img
                        src={`https://picsum.photos/id/${index + 10}/400/300`} // Different image for each news
                        alt={news.title}
                        className="object-cover h-full w-full rounded-r-md"
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {startIndex + ITEMS_PER_PAGE >= allNewsSnippets.length && (
                <div className="p-4 bg-secondary rounded-md text-center">
                  <p>Advertisement</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Loading news...</p>
        )}
      </div>
    </div>
  );
}
