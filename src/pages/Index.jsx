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
    <Card className="mb-4 border-orange-200">
      <CardHeader>
        <Skeleton className="h-4 w-3/4 bg-orange-100" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/4 mb-2 bg-orange-100" />
        <Skeleton className="h-4 w-1/2 bg-orange-100" />
      </CardContent>
    </Card>
  );

  if (error) return <div className="text-center text-red-500">Error fetching stories</div>;

  return (
    <div className="container mx-auto p-4 bg-orange-50">
      <h1 className="text-3xl font-bold mb-6 text-orange-800">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 border-orange-300 focus:border-orange-500"
      />
      {isLoading ? (
        Array(10).fill().map((_, index) => <SkeletonStory key={index} />)
      ) : (
        filteredStories?.map(story => (
          <Card key={story.objectID} className="mb-4 border-orange-200 hover:border-orange-400 transition-colors">
            <CardHeader>
              <CardTitle className="text-orange-800">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-600 mb-2">Upvotes: {story.points}</p>
              <Button
                variant="link"
                className="p-0 text-orange-500 hover:text-orange-700"
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
