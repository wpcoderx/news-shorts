
'use client';

import React, {useState, useEffect} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Separator} from '@/components/ui/separator';

export default function Home() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [newsSnippets, setNewsSnippets] = useState<NewsSnippet[]>([]);

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
              <div className="grid gap-4">
                {newsSnippets.map((news, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{news.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{news.snippet}</CardDescription>
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-500 hover:underline"
                      >
                        Read More
                      </a>
                    </CardContent>
                  </Card>
                ))}
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
