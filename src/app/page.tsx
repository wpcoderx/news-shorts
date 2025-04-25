'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import './globals.css';
import Link from 'next/link';
import {ThumbsUp, ThumbsDown, Bookmark, Menu} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';

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

  const handleScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const scrollAmount = event.deltaY > 0 ? 1 : -1;
      const newStartIndex = Math.max(
        0,
        Math.min(startIndex + scrollAmount * 2, Math.max(0, allNewsSnippets.length - ITEMS_PER_PAGE))
      );
      setStartIndex(newStartIndex);
    },
    [startIndex, allNewsSnippets.length]
  );

  return (
    <div className="container mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4">
        <span className="text-xl font-bold">NewsFlash</span>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <Link href="/login">
                <Button className="w-full mb-2">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">Register</Button>
              </Link>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Login/Register Buttons */}
        <div className="hidden md:flex space-x-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </div>

      {/* News Section */}
      <div className="flex flex-col h-screen">
        {/* Scrollable News Feed */}
        <div
          ref={containerRef}
          className="flex-grow overflow-y-scroll snap-mandatory snap-y"
          onWheel={handleScroll}
        >
          {allNewsSnippets.map((news, index) => {
            // Determine if it's time for an ad
            const showAd = index > 0 && index % 5 === 0;

            return (
              <React.Fragment key={index}>
                {/* Conditionally render an ad */}
                {showAd && (
                  <div className="snap-start h-screen flex items-center justify-center p-4">
                    <div className="p-4 bg-secondary rounded-md text-center">
                      <p>Advertisement</p>
                    </div>
                  </div>
                )}

                {/* News Card */}
                <div className="snap-start h-screen flex items-center justify-center p-4">
                  <Card className="w-full max-w-md bg-card text-card-foreground shadow-md rounded-lg overflow-hidden">
                    <CardHeader className="flex items-center space-x-4 p-4">
                      <img
                        src={publishers.find(p => p.name === news.publisher)?.logoUrl || "https://via.placeholder.com/40"}
                        alt={news.publisher}
                        className="rounded-full w-10 h-10"
                      />
                      <CardTitle className="text-lg font-semibold">{news.publisher}</CardTitle>
                    </CardHeader>
                    <img
                      src={`https://picsum.photos/id/${index + 10}/600/400`} // Responsive image size
                      alt={news.title}
                      className="object-cover w-full h-64" // Adjust height as needed
                    />
                    <CardContent className="p-4">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg font-semibold">{news.title}</CardTitle>
                      </CardHeader>
                      <CardDescription className="text-sm">{news.snippet}</CardDescription>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Category: {news.category} | Date: {news.date} | Readers: {news.readers}
                      </div>
                      <div className="flex mt-4 justify-around">
                        <Button variant="ghost" size="icon">
                          <ThumbsUp className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ThumbsDown className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="h-5 w-5" />
                        </Button>
                      </div>
                      {/* Ad space inside each card */}
                      <div className="mt-4 p-2 bg-muted rounded-md text-center text-xs">
                        Ad Space
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </React.Fragment>
            );
          })}
          {startIndex + ITEMS_PER_PAGE >= allNewsSnippets.length && (
            <div className="snap-start h-screen flex items-center justify-center p-4">
              <div className="p-4 bg-secondary rounded-md text-center">
                <p>Advertisement</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

