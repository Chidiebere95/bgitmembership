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
  applyForJob:'/JobsApplication/ApplyForJob'
};

export default apiRoutes;
