'use client';

import React, {useState, useEffect, useRef} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Separator} from '@/components/ui/separator';
import './globals.css';

const ITEMS_PER_PAGE = 2;

export default function Home() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [newsSnippets, setNewsSnippets] = useState<NewsSnippet[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPublishers = async () => {
      const publisherList = await getPublishers();
      setPublishers(publisherList);
      if (publisherList.length > 0) {
        setSelectedPublisher(publisherList[0]);
      }
    };

    fetchPublishers();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      if (selectedPublisher) {
        const snippets = await getNewsSnippets(selectedPublisher.name);
        setNewsSnippets(snippets);
      }
    };

    fetchNews();
  }, [selectedPublisher]);

  const visibleNews = newsSnippets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = event.deltaY > 0 ? 1 : -1;
    const newStartIndex = Math.max(
      0,
      Math.min(startIndex + scrollAmount, newsSnippets.length - ITEMS_PER_PAGE)
    );
    setStartIndex(newStartIndex);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NewsFlash</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <h2 className="text-lg font-semibold mb-2">Publishers</h2>
          <div className="flex flex-row md:flex-col gap-2">
            {publishers.map((publisher) => (
              <button
                key={publisher.name}
                className={`flex items-center justify-start w-full p-2 rounded-md shadow-sm text-sm hover:bg-accent hover:text-accent-foreground ${
                  selectedPublisher?.name === publisher.name ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                }`}
                onClick={() => setSelectedPublisher(publisher)}
              >
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={publisher.logoUrl} alt={publisher.name} />
                  <AvatarFallback>{publisher.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {publisher.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-3/4">
          {selectedPublisher ? (
            <>
              <h2 className="text-lg font-semibold mb-2">
                News from {selectedPublisher.name}
              </h2>
              <Separator className="mb-4" />
              <div
                ref={containerRef}
                className="flex flex-col gap-4 overflow-y-hidden h-[calc(100vh - 200px)]"
                onWheel={handleScroll}
              >
                <div
                  className="transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateY(-${startIndex * 100}%)` }}
                >
                  {newsSnippets.map((news, index) => (
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
                {/* Mock Ad Component */}
                {startIndex + ITEMS_PER_PAGE >= newsSnippets.length && (
                  <div className="p-4 bg-secondary rounded-md text-center">
                    <p>Advertisement</p>
                    {/* Replace with actual ad content */}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Select a publisher to view news.</p>
          )}
        </div>
      </div>
    </div>
  );
}

