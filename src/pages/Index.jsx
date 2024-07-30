import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ThumbsUp } from 'lucide-react';

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
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  if (error) return <div className="text-center text-red-500">Error fetching stories</div>;

  return (
    <div className="container mx-auto p-4 bg-orange-50">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Top 100 Hacker News Stories</h1>
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
          <Card key={story.objectID} className="mb-4 border-orange-200 hover:border-orange-300 transition-colors">
            <CardHeader className="bg-orange-100">
              <CardTitle className="text-orange-800">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-orange-600 flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" /> {story.points}
                </p>
                <p className="text-sm text-orange-600 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" /> {story.num_comments}
                </p>
              </div>
              <Button
                variant="outline"
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-100"
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
