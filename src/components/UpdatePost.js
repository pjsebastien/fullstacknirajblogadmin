import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../api/post';
import { useNotification } from '../Context/NotificationProvider';
import PostForm from './PostForm';
import NotFound from './NotFound';

export default function Updatepost() {
    const { slug } = useParams();
    const { updateNotification } = useNotification();
    const [postInfo, setPostInfo] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const fetchPost = async () => {
        const { error, post } = await getPost(slug);
        if (error) {
            setNotFound(true);
            return updateNotification('error', error);
        }

        console.log(post);

        setPostInfo({ ...post, tags: post.tags?.join(', ') });
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (notFound) return <NotFound />;

    return <PostForm initialPost={postInfo} postButtonTitle={'Modifier'} />;
}
