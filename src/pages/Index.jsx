import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await axios.get('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  return response.data.hits;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonStory = () => (
    <Card className="mb-4">
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  if (error) return <div className="text-center text-red-500">Error fetching stories</div>;

  return (
    <div className="container mx-auto p-4 bg-secondary">
      <h1 className="text-3xl font-bold mb-6 text-primary">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 bg-white"
      />
      {isLoading ? (
        Array(10).fill().map((_, index) => <SkeletonStory key={index} />)
      ) : (
        filteredStories?.map(story => (
          <Card key={story.objectID} className="mb-4 border-primary border-2">
            <CardHeader className="bg-accent">
              <CardTitle className="text-primary">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Upvotes: {story.points}</p>
              <Button
                variant="outline"
                className="text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.open(story.url, '_blank')}
              >
                Read more
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Index;
