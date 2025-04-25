'use client';

import React, {useState, useEffect, useRef} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">NewsFlash</h1>
        <div className="flex gap-2">
          <Button variant="outline">Login</Button>
          <Button>Register</Button>
        </div>
      </div>
      <div className="w-full">
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
                style={{ transform: `translateY(-${startIndex * (100 / ITEMS_PER_PAGE)}%)` }}
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
              {startIndex + ITEMS_PER_PAGE >= newsSnippets.length && (
                <div className="p-4 bg-secondary rounded-md text-center">
                  <p>Advertisement</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Select a publisher to view news.</p>
        )}
      </div>
    </div>
  );
}
