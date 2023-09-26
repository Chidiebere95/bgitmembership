import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import Icon from '../Icon';
import PostImage from '../../assets/images/post-image.png';
import AuthorImg1 from '../../assets/images/author1.png';
import AuthorImg2 from '../../assets/images/author2.png';
import PostCard from '../Molecules/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { triggerGetAllPosts } from '../../Features/posts/posts_slice';

import ReactTimeAgo from 'react-time-ago';
import PostsLoader from '../Atoms/skeleton-loaders/home-page/PostsLoader';
const postList = [
  {
    author: 'Karen Emelu',
    authorImage: AuthorImg1,
    role: 'CEO',
    time: '2h',
    content:
      'Hey lovely ladies, it’s half way through the year!  Come unwind and party with us this Saturday, July 8th at our Summer Mixer. Hit the RSVP button to reserve your spot. You don’t want to miss this 💃🏾🍹🎉',
    image: PostImage,
    event: true,
    following: true,
  },

  {
    author: 'Jenny Smith',
    authorImage: AuthorImg2,
    role: 'UX Design Enthusiast',
    time: '2h',
    content:
      'Hey, does anyone fancy going to a brunch?? Lol in the mood for some food and music. Drop me a message if you’re down x',
    image: null,
    event: false,
    following: false,
  },
];

const Post = () => {
  const dispatch = useDispatch();
  const { getAllPosts, createPost, getAllPostsRender } = useSelector(
    (state) => state.posts
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [firstDispatch, setFirstDispatch] = useState(false);
  const [idsOfUsersWhoHaveLikedThePost, setIdsOfUsersWhoHaveLikedThePost] =
    useState([]);

  useEffect(() => {
    if (createPost.status === 'successful') {
      const data = { queryParams: { pageNumber, pageSize } };
      dispatch(triggerGetAllPosts(data));
    }
  }, [createPost.status]);

  useEffect(() => {
    const data = { queryParams: { pageNumber, pageSize } };
    dispatch(triggerGetAllPosts(data));
  }, []);

  useEffect(() => {
    if (getAllPosts?.status === 'successful') {
      const idsOfUsersWhoHaveLikedThePostTemp =
        getAllPosts?.data?.posts?.likedUsers?.map((item) => item.userId);
      console.log(idsOfUsersWhoHaveLikedThePostTemp);
      // console.log('useeffect2');
    }
  }, [getAllPosts?.status]);

  // console.log('getall posts render', getAllPosts.data.posts);
  // console.log('getall posts render2', getAllPostsRender);

  return (
    <div className='post-wrapper'>
      <div className='d-lg-block d-none'>
        <CreatePost />
      </div>
      <div className='post-card-wrapper'>
        {getAllPosts.status === 'base' || getAllPosts.status === 'loading' ? (
          <>
            <PostsLoader />
          </>
        ) : getAllPosts.status === 'successful' ? (
          <>
            {getAllPostsRender.data ? (
              <>
                {getAllPostsRender.data?.length === 0 ? (
                  <>
                    <div className='no-data'>No posts to show</div>
                  </>
                ) : (
                  <>
                    {getAllPostsRender.data?.posts?.map((post, key) => {
                      return (
                        <PostCard
                          key={key}
                          post={post}
                          pageNumber={pageNumber}
                          pageSize={pageSize}
                        />
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <>
                <div className='internet-error-state'>
                  Check your internet and try again...
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className='server-error-state'>Something went wrong</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
