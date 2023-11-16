import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import Icon from '../Icon';
import '../../assets/scss/molecules.scss';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { UserProfilePhotoLoader2 } from '../Atoms/skeleton-loaders/dashboard-page/UserProfilePhotoLoader';
import MediaLoader from '../Atoms/skeleton-loaders/home-page/MediaLoader';
import {
  resetActivePostIdForOngoingRequest,
  resetSaveCurrentPost,
  resetToggleLikePost,
  setActivePostIdForOngoingRequest,
  setSaveCurrentPost,
  triggerToggleLikePost,
  triggerToggleSaveUnsavePost,
} from '../../Features/posts/posts_slice';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegBookmark, FaBookmark, FaRegSmile } from 'react-icons/fa';
import { TbPhoto } from 'react-icons/tb';

import OutsideClickHandler from 'react-outside-click-handler';
import ShareModal from '../Modals/ShareModal';
import user from '../../assets/images/author1.png';
import SingleComment from './SingleComment';
import CommentInput from './CommentInput';
const PostCard = ({ post, getAllPostsLocal, setGetAllPostsLocal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    toggleLikePost,
    toggleSaveUnsavePost,
    activePostIdForOngoingRequest,
  } = useSelector((state) => state.posts);
  const { getMyProfile } = useSelector((state) => state.users);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [replyComment, setReplyComment] = useState(false);

  const [actionAcctModal, setActionAcctModal] = useState(false);
  const [profileImgOnLoadStatus, setProfileImgOnLoadStatus] = useState('base');
  const [postImgOnLoadStatus, setPostImgOnLoadStatus] = useState('base');
  const [postVideoOnLoadStatus, setPostVideoOnLoadStatus] = useState('base');
  const [idsOfUsersWhoHaveLikedThePost, setIdsOfUsersWhoHaveLikedThePost] =
    useState([]);

  const handleLike = () => {
    setLiked(!liked);
    const data = { queryParams: { postId: post.postId } };
    dispatch(triggerToggleLikePost(data));
  };
  const [saveCurrentPost, setSaveCurrentPost] = useState(
    post.isSavedByCurrentUser
  );

  const timeoutIdRef = useRef(null);
  const handleSaveUnsavePost = () => {
    const startTimeout = () => {
      timeoutIdRef.current = setTimeout(() => {
        const data = { queryParams: { postId: post.postId } };
        dispatch(triggerToggleSaveUnsavePost(data));
      }, 5000);
    };
    const clearTimeoutIfNeeded = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
    clearTimeoutIfNeeded();
    startTimeout();
    setSaveCurrentPost(!saveCurrentPost);
    dispatch(setActivePostIdForOngoingRequest(post.postId));
  };
  useEffect(() => {
    // const data = [...getAllPostsLocal];
    const data = _.cloneDeep(getAllPostsLocal);
    if (saveCurrentPost) {
      data.forEach((item) => {
        if (item.postId === post.postId) {
          item.isSavedByCurrentUser = true;
        }
      });
    } else {
      data.forEach((item) => {
        if (item.postId === post.postId) {
          item.isSavedByCurrentUser = false;
        }
      });
    }
    setGetAllPostsLocal(data);
  }, [saveCurrentPost]);

  console.log('saveCurrentPost', saveCurrentPost);
  useEffect(() => {
    if (
      toggleSaveUnsavePost.status === 'successful' &&
      activePostIdForOngoingRequest === post.postId
    ) {
      const data = _.cloneDeep(getAllPostsLocal);
      if (toggleSaveUnsavePost.data.postSaved) {
        data.forEach((item) => {
          if (item.postId === toggleSaveUnsavePost.data.postId) {
            item.isSavedByCurrentUser = true;
          }
        });
      } else {
        data.forEach((item) => {
          if (item.postId === toggleSaveUnsavePost.data.postId) {
            item.isSavedByCurrentUser = false;
          }
        });
      }
      setGetAllPostsLocal(data);
    }
  }, [toggleSaveUnsavePost]);

  const handleChange = (e) => {
    if (e.target.name === 'comment') {
      setComment(e.target.value);
    } else if (e.target.name === 'reply') {
      setReply(e.target.value);
    }
  };
  const handleSubmit = (name) => {
    if (name === 'comment') {
      setComment('');
    } else if (name === 'reply') {
      setReply('');
    }
  };

  // like post
  useEffect(() => {
    if (toggleLikePost.status === 'successful') {
      if (
        toggleLikePost.data.postLiked === true &&
        toggleLikePost.data.postId === post.postId &&
        Array.isArray(idsOfUsersWhoHaveLikedThePost)
      ) {
        let idsOfUsersWhoHaveLikedThePostTemp = [
          ...idsOfUsersWhoHaveLikedThePost,
        ];
        const filter = idsOfUsersWhoHaveLikedThePostTemp.filter(
          (item) => item.postId !== getMyProfile.data.userId
        );
        let idsOfUsersWhoHaveLikedThePostTemp2 = [
          ...filter,
          getMyProfile.data.userId,
        ];
        setIdsOfUsersWhoHaveLikedThePost(idsOfUsersWhoHaveLikedThePostTemp2);
        dispatch(resetToggleLikePost());
      } else if (
        toggleLikePost.data.postLiked === false &&
        toggleLikePost.data.postId === post.postId &&
        Array.isArray(idsOfUsersWhoHaveLikedThePost)
      ) {
        let idsOfUsersWhoHaveLikedThePostTemp = [
          ...idsOfUsersWhoHaveLikedThePost,
        ];

        const idsOfUsersWhoHaveLikedThePostTemp2 =
          idsOfUsersWhoHaveLikedThePostTemp.filter(
            (item) => item !== getMyProfile.data.userId
          );
        setIdsOfUsersWhoHaveLikedThePost(idsOfUsersWhoHaveLikedThePostTemp2);
        dispatch(resetToggleLikePost());
      }
    }
  }, [
    getMyProfile.data?.userId,
    post?.postId,
    toggleLikePost.data.postId,
    toggleLikePost.data.postLiked,
    toggleLikePost.status,
  ]);

  useEffect(() => {
    if (
      Array.isArray(idsOfUsersWhoHaveLikedThePost) &&
      idsOfUsersWhoHaveLikedThePost?.includes(getMyProfile?.data?.userId)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [getMyProfile.data?.userId, idsOfUsersWhoHaveLikedThePost]);
  useEffect(() => {
    const idsOfUsersWhoHaveLikedThePostTemp = post?.likedUsers.map(
      (item) => item.userId
    );
    setIdsOfUsersWhoHaveLikedThePost(idsOfUsersWhoHaveLikedThePostTemp);
  }, [post?.likedUsers]);
  // console.log('saved', saved);
  return (
    <div className='post-card shadow-sm mx-auto'>
      <div className='post-card-header'>
        <div className='post-owner-details'>
          <div
            className='img-circle'
            onClick={() => navigate(`user/${post?.userId}`)}
          >
            <img
              src={post?.userProfilePicture}
              alt='post-img'
              className={`${
                profileImgOnLoadStatus === 'success' ? 'd-block' : 'd-none'
              }`}
              onLoad={() => setProfileImgOnLoadStatus('success')}
              onError={() => setProfileImgOnLoadStatus('error')}
            />
            {profileImgOnLoadStatus === 'base' && <UserProfilePhotoLoader2 />}
            {profileImgOnLoadStatus === 'error' && (
              <div className='error-img'>couldn't load img</div>
            )}
          </div>
          <div>
            <div className='d-flex align-items-center'>
              <span
                className='name'
                onClick={() => navigate(`user/${post?.userId}`)}
              >
                {post?.firstName} {post?.secondName}
              </span>
              <span className='small-circle'></span>
              <span className='follow-btn'>
                {post?.following ? 'following' : 'follow'}
              </span>
            </div>
            <div className='job-role'>{post?.userProfession}</div>
            <div className='post-time'>
              {moment(new Date(post.createdDate).getTime() + 3600000).fromNow()}
            </div>
          </div>
        </div>
        <div>{post?.event && <div className='rsvp-btn'>RSVP</div>}</div>
      </div>
      <div className='post-content-wrapper'>
        <div className='post-content'>{post?.content}</div>
        {(post?.postImageUrl || post?.postVideoUrl) && (
          <>
            {post.postImageUrl ? (
              <div className='post-image'>
                <img
                  src={post?.postImageUrl}
                  alt='post-img'
                  className={`${
                    postImgOnLoadStatus === 'success' ? 'd-block' : 'd-none'
                  }`}
                  onLoad={() => setPostImgOnLoadStatus('success')}
                  onError={() => setPostImgOnLoadStatus('error')}
                />
                {postImgOnLoadStatus === 'base' && <MediaLoader />}
                {postImgOnLoadStatus === 'error' && (
                  <div className='error-img'>couldn't load img</div>
                )}
              </div>
            ) : (
              <div className='post-video'>
                <video
                  controls
                  className={`${
                    postVideoOnLoadStatus === 'success' ? 'd-block' : 'd-none'
                  }`}
                  onLoadedMetadata={() => setPostVideoOnLoadStatus('success')}
                  onError={() => setPostVideoOnLoadStatus('error')}
                >
                  <source src={post?.postVideoUrl} type='video/mp4' />
                </video>
                {postVideoOnLoadStatus === 'base' && <MediaLoader />}
                {postVideoOnLoadStatus === 'error' && (
                  <div className='error-img'>couldn't load img</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className='post-card-footer'>
        <div className='post-card-footer-content'>
          <div className='d-flex align-items-center c-gap-10'>
            <button
              onClick={handleLike}
              className={`heart-icon ${liked && 'active'}`}
            >
              <Icon icon='heart' />
            </button>
            <span>
              {Array.isArray(idsOfUsersWhoHaveLikedThePost) &&
                idsOfUsersWhoHaveLikedThePost?.length}
            </span>
          </div>

          <div className='d-flex align-items-center c-gap-10'>
            <button>
              <Icon icon='comment' />
            </button>
            <span>5</span>
          </div>

          <div className='d-flex align-items-center c-gap-10'>
            <button className='bookmark ' onClick={handleSaveUnsavePost}>
              {post.isSavedByCurrentUser ? (
                <FaBookmark className='active' />
              ) : (
                <FaRegBookmark />
              )}
            </button>
            <span>5</span>
          </div>

          <div className='d-flex align-items-center c-gap-10 share-wrapper'>
            <button onClick={() => setActionAcctModal(true)}>
              <Icon icon='share' />
            </button>
            <OutsideClickHandler
              onOutsideClick={() => {
                setActionAcctModal(false);
              }}
            >
              <ShareModal show={actionAcctModal} />
            </OutsideClickHandler>
          </div>
        </div>
        {/* <div className='comments-sec'>
          <CommentInput
            name={'comment'}
            onChange={handleChange}
            onSubmit={handleSubmit}
            value={comment}
          />
          <div className='comments-box'>
            <SingleComment
              img={user}
              name={'Chidiebere Ezeokwelume'}
              role={'UX Design Enthusiast'}
              comment={'So excited, can’t wait!'}
              setReplyComment={setReplyComment}
            />
            <div className='child-comments-wrapper'>
              <div className='hidden'></div>
              <div className='con'>
                <SingleComment
                  img={user}
                  name={'Chidiebere Ezeokwelume'}
                  role={'UX Design Enthusiast'}
                  comment={'So excited, can’t wait!'}
                  childComment
                  setReplyComment={setReplyComment}
                />
                <SingleComment
                  img={user}
                  name={'Chidiebere Ezeokwelume'}
                  role={'UX Design Enthusiast'}
                  comment={'So excited, can’t wait!'}
                  childComment
                  setReplyComment={setReplyComment}
                />
                <SingleComment
                  img={user}
                  name={'Chidiebere Ezeokwelume'}
                  role={'UX Design Enthusiast'}
                  comment={'So excited, can’t wait!'}
                  childComment
                  setReplyComment={setReplyComment}
                />
                {replyComment && (
                  <CommentInput
                    name={'reply'}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    value={reply}
                    focus={replyComment}
                  />
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PostCard;
