const apiRoutes = {
  // auth
  signup: '/Auth/SignUp',
  signin: '/Auth/Login',

  // connections
  getAcceptedConnections: '/Connections/GetAcceptedConnections',
  getSentRejectedRequests: '/Connections/GetSentRejectedRequests',
  getPotentialConnections: '/Connections/GetPotentialConnections',
  sendConnectionRequest: '/Connections/SendConnectionRequest',
  getPendingRequestConnections: '/Connections/GetPendingRequestConnections',
  acceptConnectionRequest: '/Connections/AcceptConnectionRequest',
  rejectConnectionRequest: '/Connections/RejectConnectionRequest',
  getBlockedUsers: '/Connections/GetBlockedUsers',
  blockUser: '/Connections/BlockUser',
  unblockUser: '/Connections/UnblockUser',
  muteUser: '/Connections/MuteUser',
  unmuteUser: '/Connections/UnmuteUser',

  // jobs
  addJob: '/Jobs/AddJob',
  editJob: '/Jobs/EditJob',
  getAllJobs: '/Jobs/GetAllJobs',
  getAllInactiveJobs: '/Jobs/GetAllInactiveJobs',
  getAllClosedJobs: '/Jobs/GetAllClosedJobs',
  deleteJob: '/Jobs/DeleteJob',

  // jobs application
  applyForJob: '/JobsApplication/ApplyForJob',

  // posts
  createPost: '/Posts/CreatePost',
  toggleLikePost: '/Posts/ToggleLikeUnlikePost',
  getPostLikedUsers: '/Posts/GetPostLikedUsers',
  // getAllPosts: '/Posts/GetAllPosts?pageNumber=1&PageSize=10',
  getAllPosts: '/Posts/GetAllPosts',
  getAllPostsByUserId: '/Posts/GetAllPostsByUserId',
  getMyPosts: '/Posts/GetMyPosts',
  createComment: '/Posts/CreateComment',

  // reports
  reportUser: '/Reports/ReportUser',
  getAllReports: '/Reports/GetAllReports',

  // social links
  addSocialLinks: '/SocialLinks/AddSocialLinks',
  getSocialLinks: '/SocialLinks/GetSocialLinks',
  updateSocialLinks: '/SocialLinks/UpdateSocialLinks',
  deleteSocialLink: 'SocialLinks/DeleteSocialLink',

  // users
  getUserProfileById: '/Users/GetUserProfileById',
  getMyProfile: '/Users/GetMyProfile',
  changePassword: '/Users/ChangePassword',
  updateMyProfile: '/Users/UpdateMyProfile',
  getFeedPreference: '/Users/GetFeedPreference',
  updateFeedPreference: '/Users/UpdateFeedPreference',
  getPrivacySettings: '/Users/GetPrivacySettings',
  updatePrivacySettings: '/Users/UpdatePrivacySettings',
  closeAccount: '/Users/CloseAccount',
};

export default apiRoutes;
