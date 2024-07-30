import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronRight } from 'lucide-react';

const fetchComments = async (storyId) => {
  const response = await axios.get(`https://hn.algolia.com/api/v1/items/${storyId}`);
  return response.data.children;
};

const Comment = ({ comment, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Card className={`bg-orange-50 border-orange-200 mb-2 ml-${depth * 4}`}>
      <CardContent className="pt-4">
        <div className="flex items-start">
          {comment.children.length > 0 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 mt-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <div>
            <p className="text-sm text-orange-700" dangerouslySetInnerHTML={{ __html: comment.text }} />
            <p className="text-xs text-orange-500 mt-2">By: {comment.author}</p>
          </div>
        </div>
        {isExpanded && comment.children.length > 0 && (
          <div className="mt-2">
            {comment.children.map((childComment) => (
              <Comment key={childComment.id} comment={childComment} depth={depth + 1} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Comments = ({ storyId }) => {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: () => fetchComments(storyId),
  });

  if (isLoading) return <Skeleton className="h-20 w-full" />;
  if (error) return <div className="text-red-500">Error loading comments</div>;

  return (
    <div className="mt-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
