import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchComments = async (storyId) => {
  const response = await axios.get(`https://hn.algolia.com/api/v1/items/${storyId}`);
  return response.data.children;
};

const Comments = ({ storyId }) => {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: () => fetchComments(storyId),
  });

  if (isLoading) return <Skeleton className="h-20 w-full" />;
  if (error) return <div className="text-red-500">Error loading comments</div>;

  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <p className="text-sm text-orange-700" dangerouslySetInnerHTML={{ __html: comment.text }} />
            <p className="text-xs text-orange-500 mt-2">By: {comment.author}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Comments;
