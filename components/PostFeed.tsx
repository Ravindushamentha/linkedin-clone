import React from 'react';
import Post from './Post';
import { IPostDocument } from '@/Mongodb/models/Post';

interface PostFeedProps {
  posts: IPostDocument[] | null | undefined;
}

function PostFeed({ posts }: PostFeedProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-4">No posts available.</div>;
  }

  return (
    <div className='space-y-2 pb-20'>
      {posts.map((post) => (
        <Post 
          key={post._id ? post._id.toString() : post.id?.toString() || `post-${Math.random()}`} 
          post={post} 
        />
      ))}
    </div>
  );
}

export default PostFeed;