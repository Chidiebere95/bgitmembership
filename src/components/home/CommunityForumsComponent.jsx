import React, { useEffect, useState } from 'react';
import Icon from '../Icon';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ForumCardsLoader from '../Atoms/skeleton-loaders/ForumCardsLoader';
import { useDispatch } from 'react-redux';
import {
  resetCanceljoinForumRequest,
  resetJoinForum,
  triggerGetAllForums,
} from '../../Features/forums/forums_slice';
import { ForumCard2 } from '../Molecules/ForumCard';
import { renderToast } from '../Molecules/CustomToastify';

const CommunityForumsComponent = () => {
  const { getAllForums } = useSelector((state) => state.forums);
  const [pageNumber] = useState(1);
  const [pageSize] = useState(10);
  const dispatch = useDispatch();
  useEffect(() => {
    const data = { queryParams: { pageNumber, pageSize } };
    dispatch(triggerGetAllForums(data));
  }, []);
  const [getAllForumsLocal, setGetAllForumsLocal] = useState([]);
  const [activeForums, setActiveForums] = useState([]);
  const [activeForum, setActiveForum] = useState({});

  useEffect(() => {
    if (
      getAllForums.status === 'successful' &&
      Array.isArray(getAllForums.data)
    ) {
      setGetAllForumsLocal(getAllForums.data);
    }
  }, [getAllForums]);
  const { joinForum, cancelJoinForumRequest } = useSelector(
    (state) => state.forums
  );

  useEffect(() => {
    const data = _.cloneDeep(getAllForumsLocal);
    // join forum

    if (joinForum.status === 'loading') {
      data.forEach((item) => {
        if (item.forumId === activeForum.forumId) {
          item.requestStatus = 'loading';
        }
      });
      setGetAllForumsLocal(data);
    } else if (joinForum.status === 'successful') {
      console.log('jooin####################################');
      if (joinForum.data.status === 'error') {
        renderToast({
          status: 'error',
          message: 'You are the admin of the forum.',
        });
      } else if (joinForum.data.status === 'success') {
        renderToast({
          status: 'success',
          message: 'Join request sent successfully',
        });
        data.forEach((item) => {
          if (item.forumId === activeForum.forumId) {
            item.forumMembershipStatus = 'PendingRequest';
            delete item.requestStatus;
          }
        });
        setGetAllForumsLocal(data);
      }
      setActiveForum({});
      dispatch(resetJoinForum());
    } else if (joinForum.status === 'error') {
      renderToast({
        status: 'error',
        message: 'Something went wrong',
      });
      data.forEach((item) => {
        if (item.forumId === joinForum.data.forumId) {
          delete item.requestStatus;
        }
      });
      setGetAllForumsLocal(data);
      setActiveForum({});
      dispatch(resetJoinForum());
    }
    // cancel Join forum request
    if (cancelJoinForumRequest.status === 'loading') {
      data.forEach((item) => {
        if (item.forumId === activeForum.forumId) {
          item.requestStatus = 'loading';
        }
      });
      setGetAllForumsLocal(data);
    } else if (cancelJoinForumRequest.status === 'successful') {
      if (cancelJoinForumRequest.data.status === 'success') {
        renderToast({
          status: 'success',
          message: 'Join request canceled successfully.',
        });
        data.forEach((item) => {
          if (item.forumId === activeForum.forumId) {
            item.forumMembershipStatus = 'NotAMember';
            delete item.requestStatus;
          }
        });
        setGetAllForumsLocal(data);
        setActiveForum({});
        dispatch(resetCanceljoinForumRequest());
      }
    } else if (cancelJoinForumRequest.status === 'error') {
      renderToast({
        status: 'error',
        message: 'Something went wrong',
      });
      data.forEach((item) => {
        if (item.forumId === cancelJoinForumRequest.status.forumId) {
          delete item.requestStatus;
        }
      });
      setGetAllForumsLocal(data);
      setActiveForum({});
      dispatch(resetCanceljoinForumRequest());
    }
  }, [joinForum.status, cancelJoinForumRequest.status]);

  return (
    <div className='community-forum-wrapper'>
      <div className='community-forum-card-wrapper shadow-sm'>
        <h3>Community Forums</h3>
        {getAllForums.status === 'loading' ? (
          <>
            <ForumCardsLoader />
          </>
        ) : getAllForums.status === 'successful' &&
          Array.isArray(getAllForums.data) ? (
          <>
            {getAllForumsLocal.length === 0 ? (
              <div className='empty-state'>
                <p>No forums yet...</p>
              </div>
            ) : (
              <>
                {getAllForumsLocal?.slice(0, 3).map((forum, key) => {
                  return (
                    <ForumCard2
                      key={forum.forumId}
                      forum={forum}
                      getAllForumsLocal={getAllForumsLocal}
                      setGetAllForumsLocal={setGetAllForumsLocal}
                      activeForums={activeForums}
                      setActiveForums={setActiveForums}
                      activeForum={activeForum}
                      setActiveForum={setActiveForum}
                    />
                  );
                })}
              </>
            )}
          </>
        ) : (
          <></>
        )}
        {getAllForums.status === 'successful' &&
          getAllForums?.data?.length > 3 && (
            <div className='text-center my-4'>
              <Link
                to='/forums'
                className='sec-btn mx-auto c-gap-5 smallert-text added-width d-flex align-items-center justify-content-center'
              >
                <span>View all</span> <Icon icon='arrowRight' />
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default CommunityForumsComponent;
