import React, { useEffect, useState } from 'react';
import { deletePost, getPosts } from '../api/post';
import { useSearch } from '../Context/SearchProvider';
import PostCard from './PostCard';
import { useNotification } from '../Context/NotificationProvider';

let pageNo = 0;
const POST_LIMIT = 9;
const getPaginationCount = length => {
    const division = length / POST_LIMIT;
    if (division % 1 !== 0) {
        return Math.floor(division) + 1;
    }
    return division;
};

export default function Home() {
    const { searchResult } = useSearch();
    const [posts, setPosts] = useState([]);
    const [totalPostCount, setTotalPostCount] = useState([]);
    const { updateNotification } = useNotification();

    const paginationCount = getPaginationCount(totalPostCount);
    const paginationArray = new Array(paginationCount).fill(' ');
    const fetchPosts = async () => {
        const { error, posts, postCount } = await getPosts(pageNo, POST_LIMIT);

        if (error) return updateNotification('error', error);
        setPosts(posts);
        setTotalPostCount(postCount);
    };
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMorePosts = index => {
        pageNo = index;
        fetchPosts();
    };
    const handleDelete = async ({ id }) => {
        const confirmed = window.confirm('Etes vous sûr ?');
        if (!confirmed) return;
        const { error, message } = await deletePost(id);

        if (error) {
            return updateNotification('error', error);
        }
        updateNotification('success', message);

        const newPosts = posts.filter(posts => posts.id !== id);
        setPosts(newPosts);
        setTotalPostCount(totalPostCount - 1);
    };
    return (
        <div className="">
            <div className="grid grid-cols-3 gap-3 pb-5">
                {searchResult.length
                    ? searchResult.map(post => {
                          return (
                              <PostCard
                                  post={post}
                                  key={post.id}
                                  onDeleteClicked={() => handleDelete(post)}
                              />
                          );
                      })
                    : posts.map(post => {
                          return (
                              <PostCard
                                  post={post}
                                  key={post.id}
                                  onDeleteClicked={() => handleDelete(post)}
                              />
                          );
                      })}
            </div>
            {paginationArray.length > 1 && !searchResult.length ? (
                <div className="py-5 flex justify-center items-center space-x-3">
                    {paginationArray.map((_, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => fetchMorePosts(index)}
                                className={
                                    index === pageNo
                                        ? 'text-blue-500 border-b-2 border-b-blue-500'
                                        : 'text-gray-500'
                                }
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
