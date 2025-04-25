'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';
import {getNewsSnippets, getPublishers, NewsSnippet, Publisher} from '@/services/news-api';
import {Card, CardContent, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import './globals.css';
import Link from 'next/link';
import {ThumbsUp, ThumbsDown, Bookmark, Menu, MessageSquare} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

const ITEMS_PER_PAGE = 1;

// Function to shuffle array elements
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to generate a variety of content types
function generateDynamicContent(index: number): React.ReactNode {
  const contentType = index % 6; // Cycle through 6 types of content
  const baseText = `This is dynamic content ${index + 1}. `;

  switch (contentType) {
    case 0: // Bullet points
      return (
        <ul>
          <li>{baseText} Point 1.</li>
          <li>{baseText} Point 2.</li>
          <li>{baseText} Point 3.</li>
        </ul>
      );
    case 1: // Quote
      return (
        <blockquote>
          "{baseText} A wise saying."
          <cite>- Someone</cite>
        </blockquote>
      );
    case 2: // Radio Poll
      return (
        <div>
          <p>{baseText} Vote now!</p>
          <RadioGroup defaultValue="optionA" className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="optionA" id={`poll-${index}-a`} />
              <label htmlFor={`poll-${index}-a`}>Option A</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="optionB" id={`poll-${index}-b`} />
              <label htmlFor={`poll-${index}-b`}>Option B</label>
            </div>
          </RadioGroup>
        </div>
      );
    case 3: // Paragraph with emphasis
      return (
        <p>
          {baseText} <em>Important information here.</em>
        </p>
      );
    case 4: // Text input
      return (
        <div>
          <p>{baseText} Enter your thoughts:</p>
          <Input type="text" placeholder="Your input here" className="mt-2" />
        </div>
      );
    default: // Regular paragraph
      return <p>{baseText} Just a regular snippet.</p>;
  }
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
        Math.min(startIndex + scrollAmount, Math.max(0, allNewsSnippets.length - ITEMS_PER_PAGE))
      );

      // Animate the scroll
      container.scrollTo({
        top: (newStartIndex * container.offsetHeight),
        behavior: 'smooth',
      });

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
                    <img
                      src={`https://picsum.photos/id/${index + 10}/600/400`} // Responsive image size
                      alt={news.title}
                      className="object-cover w-full h-64" // Adjust height as needed
                    />
                    <CardContent className="p-4">
                      <div className="text-lg font-semibold flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={`https://picsum.photos/id/${index + 20}/50/50`} alt={news.publisher} />
                              <AvatarFallback>{news.publisher.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        {news.publisher}
                      </div>
                      <div className="text-xl font-semibold">{news.title}</div>
                      {/* Use dynamic content here */}
                      <CardDescription className="text-sm">
                        {generateDynamicContent(index)}
                      </CardDescription>
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
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MessageSquare className="h-5 w-5" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-96">
                            <h2 className="text-lg font-semibold mb-4">Comments</h2>
                            <Textarea placeholder="Add your comment here" className="mb-2" />
                            <Button>Post Comment</Button>
                            <Separator className="my-4" />
                            <div>
                              <p>No comments yet.</p>
                            </div>
                          </SheetContent>
                        </Sheet>
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
