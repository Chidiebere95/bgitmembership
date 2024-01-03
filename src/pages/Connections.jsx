import React, { useEffect, useState } from 'react';
import '../assets/scss/connections.scss';
import ConnectionCard from '../components/connection/ConnectionCard';
import SearchBox from '../components/Molecules/SearchBox';
import { HiArrowLeft } from 'react-icons/hi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  triggerGetAcceptedConnections,
  triggerGetConnectionsByUserId,
} from '../Features/connections/connections_slice';
import OutsideClickHandler from 'react-outside-click-handler';
import { triggerGetForumMembersByForumId } from '../Features/forums-membership/forums_membership_slice';
import BlockedUsersLoader from '../components/Atoms/skeleton-loaders/settings-page/BlockedUsersLoader';
import SearchResult from '../components/Molecules/SearchResult';
import ConnectionsLoader from '../components/Atoms/skeleton-loaders/connections-page/ConnectionsLoader';

const Connections = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getConnectionsByUserId } = useSelector((state) => state.connections);
  const { getForumMembersByForumId } = useSelector(
    (state) => state.forumsMembership
  );
  const { getUserByProfileId } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedForumMembers, setSearchedForumMembers] = useState([]);

  useEffect(() => {
    if (location.pathname.includes('connections')) {
      const data = { queryParams: { userId: params.id } };
      dispatch(triggerGetConnectionsByUserId(data));
    } else if (location.pathname.includes('forums')) {
      const data = { queryParams: { forumId: params.id } };
      dispatch(triggerGetForumMembersByForumId(data));
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('connections')) {
      if (searchTerm) {
        setShowSearchModal(true);
        const users = [...getConnectionsByUserId.data?.connections];
        const searchedUsers = users
          ?.filter(
            (user) =>
              user.receiverFirstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.receiverSecondName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.receiverCity
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.receiverProfession
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .slice(0, 3);
        setSearchedUsers(searchedUsers);
      } else {
        setShowSearchModal(false);
        setSearchedUsers([]);
      }
    } else if (location.pathname.includes('forums')) {
      if (searchTerm) {
        setShowSearchModal(true);
        const members = [...getForumMembersByForumId.data[0]?.usersInForum];
        const searchedMembers = members
          ?.filter(
            (member) =>
              member.user.firstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              member.user.secondName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              member.user.city
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              member.user.profession
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .slice(0, 3);
        setSearchedForumMembers(searchedMembers);
      } else {
        setShowSearchModal(false);
        setSearchedUsers([]);
      }
    }
  }, [searchTerm]);

  // console.log('searchusers', searchedUsers);
  // console.log('params', params);
  // console.log('members', getForumMembersByForumId);

  // console.log('getConnectionsByUserId', getConnectionsByUserId);
  console.log('searchTerm', searchTerm);
  console.log('searchedforummembers', searchedForumMembers);

  return (
    <section className='connection-page'>
      <div className='container'>
        <div className='top-page'>
          <button className='back' onClick={() => navigate(-1)}>
            <HiArrowLeft className='text-color22' />
          </button>
          {location.pathname.includes('connection') && (
            <h2>
              {getConnectionsByUserId.data?.connectionCount}{' '}
              {`Connection${
                getConnectionsByUserId.data?.connectionCount > 1 ? 's' : ''
              }`}
            </h2>
          )}
          {location.pathname.includes('forums') && (
            <h2>
              {getForumMembersByForumId.data?.connectionCount}{' '}
              {`Forum Member${
                getForumMembersByForumId.data?.connections?.length > 1
                  ? 's'
                  : ''
              }`}
            </h2>
          )}
        </div>
        {location.pathname.includes('connection') && (
          <div className='connections-wrapper'>
            <div className='connection-head'>
              <div className='search-box-wrapper'>
                {getConnectionsByUserId.status === 'base' ||
                getConnectionsByUserId.status === 'loading' ? (
                  <></>
                ) : getConnectionsByUserId.status === 'successful' ? (
                  <SearchBox
                    placeholder='Search connections'
                    name={'search-term'}
                    value={searchTerm}
                    setValue={setSearchTerm}
                  />
                ) : (
                  <></>
                )}
                {showSearchModal && (
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setShowSearchModal(false);
                    }}
                  >
                    <div className='search-modal-con shadow-sm'>
                      {searchedUsers.length > 0 && (
                        <div className='people'>
                          <div className='users'>
                            {searchedUsers.map((user, index) => (
                              <SearchResult
                                key={index}
                                to={`/users/${user.receiverUserId}`}
                                imageUrl={user.receiverImageUrl}
                                name={`${user.receiverFirstName} ${user.receiverSecondName}`}
                                profession={user.receiverProfession}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {searchedUsers.length === 0 && <p>No results found...</p>}
                    </div>
                  </OutsideClickHandler>
                )}
              </div>
            </div>
            <div className='connections-body'>
              {getConnectionsByUserId.status === 'base' ||
              getConnectionsByUserId.status === 'loading' ? (
                <ConnectionsLoader />
              ) : getConnectionsByUserId.status === 'successful' ? (
                <>
                  {getConnectionsByUserId.data?.connections?.length === 0 ? (
                    <>No connections</>
                  ) : (
                    <>
                      {getConnectionsByUserId.data?.connections?.map(
                        (item, index) => (
                          <ConnectionCard key={index} user={item} />
                        )
                      )}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        {location.pathname.includes('forums') && (
          <div className='connections-wrapper'>
            <div className='connection-head'>
              <div className='search-box-wrapper'>
                {getForumMembersByForumId.status === 'base' ||
                getForumMembersByForumId.status === 'loading' ? (
                  <></>
                ) : getForumMembersByForumId.status === 'successful' ? (
                  <SearchBox
                    placeholder='Search members'
                    name={'search-term'}
                    value={searchTerm}
                    setValue={setSearchTerm}
                  />
                ) : (
                  <></>
                )}
                {showSearchModal && (
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setShowSearchModal(false);
                    }}
                  >
                    <div className='search-modal-con shadow-sm'>
                      {searchedForumMembers.length > 0 && (
                        <div className='people'>
                          <div className='users'>
                            {searchedForumMembers.map((user, index) => (
                              <SearchResult
                                key={index}
                                to={`/users/${user.userId}`}
                                imageUrl={user.user.imageUrl}
                                name={`${user.user.firstName} ${user.user.secondName}`}
                                profession={user.user.profession}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {searchedForumMembers.length === 0 && (
                        <p>No results found...</p>
                      )}
                    </div>
                  </OutsideClickHandler>
                )}
              </div>
            </div>
            <div className='connections-body'>
              {getForumMembersByForumId.status === 'base' ||
              getForumMembersByForumId.status === 'loading'  ? (
                <ConnectionsLoader />
              ) : getForumMembersByForumId.status === 'successful' ? (
                <>
                  {getForumMembersByForumId.data?.connections?.length === 0 ? (
                    <>No user found..</>
                  ) : (
                    <>
                      {getForumMembersByForumId.data[0]?.usersInForum?.map(
                        (item, index) => (
                          <ConnectionCard
                            withoutAction
                            key={index}
                            user={item}
                          />
                        )
                      )}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Connections;
