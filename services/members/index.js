// import { apiRequest } from "../api";

// const START_DATE =
//   "1788192000000";

// export const getActiveMembers = ({
//   page = 0,
//   limit = 10,
// } = {}) => {
//   return apiRequest(
//     `/admin/members?startDate=${START_DATE}&currentStatus=ACTIVE&page=${page}&limit=${limit}`,
//     {
//       method: "GET",
//     }
//   );
// };

// export const getMembershipRequests = ({
//   page = 0,
//   limit = 10,
// } = {}) => {
//   return apiRequest(
//     `/admin/members?startDate=${START_DATE}&userApplicationStatus=PENDING_APPROVAL&page=${page}&limit=${limit}`,
//     {
//       method: "GET",
//     }
//   );
// };

// export const getPendingPaymentMembers = ({
//   page = 0,
//   limit = 10,
// } = {}) => {
//   return apiRequest(
//     `/admin/members?startDate=${START_DATE}&userApplicationStatus=PENDING_PAYMENT&page=${page}&limit=${limit}`,
//     {
//       method: "GET",
//     }
//   );
// };

// export const getRevokedMembers = ({
//   page = 0,
//   limit = 10,
// } = {}) => {
//   return apiRequest(
//     `/admin/members?startDate=${START_DATE}&currentStatus=REVOKED&page=${page}&limit=${limit}`,
//     {
//       method: "GET",
//     }
//   );
// };



// export const getMemberById = (memberId) => {
//   if (!memberId) {
//     throw new Error("Member ID is required.");
//   }

//   return apiRequest(
//     `/admin/members/${memberId}`,
//     {
//       method: "GET",
//     }
//   );
// };



// export const approveMemberApplication = (
//   userId
// ) => {
//   if (!userId) {
//     throw new Error("User ID is required.");
//   }

//   return apiRequest(
//     `/admin/members/application/approve/${userId}`,
//     {
//       method: "GET",
//     }
//   );
// };



// export const rejectMemberApplication = (
//   userId
// ) => {
//   if (!userId) {
//     throw new Error("User ID is required.");
//   }

//   return apiRequest(
//     `/admin/members/application/reject/${userId}`,
//     {
//       method: "GET",
//     }
//   );
// };


// export const revokeMembership = (
//   memberId
// ) => {
//   if (!memberId) {
//     throw new Error("Member ID is required.");
//   }

//   return apiRequest(
//     `/admin/membership/update/${memberId}/REVOKED`,
//     {
//       method: "GET",
//     }
//   );
// };



// export const restoreMembership = (
//   memberId
// ) => {
//   if (!memberId) {
//     throw new Error("Member ID is required.");
//   }

//   return apiRequest(
//     `/admin/membership/update/${memberId}/ACTIVE`,
//     {
//       method: "GET",
//     }
//   );
// };

import { apiRequest } from "../api";

// 1 Sep 2026
const START_DATE = "1788192000000";

/* =========================================
   LIST APIs
========================================= */

export const getActiveMembers = ({
  page = 0,
  limit = 10,
} = {}) => {
  return apiRequest(
    `/admin/members?startDate=${START_DATE}&currentStatus=ACTIVE&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const getMembershipRequests = ({
  page = 0,
  limit = 10,
} = {}) => {
  return apiRequest(
    `/admin/members?startDate=${START_DATE}&userApplicationStatus=PENDING_APPROVAL&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const getPendingPaymentMembers = ({
  page = 0,
  limit = 10,
} = {}) => {
  return apiRequest(
    `/admin/members?startDate=${START_DATE}&userApplicationStatus=PENDING_PAYMENT&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const getRevokedMembers = ({
  page = 0,
  limit = 10,
} = {}) => {
  return apiRequest(
    `/admin/members?startDate=${START_DATE}&currentStatus=REVOKED&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

/* =========================================
   MEMBER PREVIEW
========================================= */

export const getMemberById = (
  memberId
) => {
  if (!memberId) {
    throw new Error(
      "Member ID is required."
    );
  }

  return apiRequest(
    `/admin/members/${memberId}`,
    {
      method: "GET",
    }
  );
};

/* =========================================
   APPROVE
   IMPORTANT: USER ID
========================================= */

export const approveMemberApplication = (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return apiRequest(
    `/admin/members/application/approve/${userId}`,
    {
      method: "GET",
    }
  );
};

/* =========================================
   REJECT
   IMPORTANT: USER ID
========================================= */

export const rejectMemberApplication = (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return apiRequest(
    `/admin/members/application/reject/${userId}`,
    {
      method: "GET",
    }
  );
};

/* =========================================
   REVOKE
   IMPORTANT: MEMBER ID
========================================= */

export const revokeMembership = (
  memberId
) => {
  if (!memberId) {
    throw new Error(
      "Member ID is required."
    );
  }

  return apiRequest(
    `/admin/membership/update/${memberId}/REVOKED`,
    {
      method: "GET",
    }
  );
};

/* =========================================
   RESTORE
   IMPORTANT: MEMBER ID
========================================= */

export const restoreMembership = (
  memberId
) => {
  if (!memberId) {
    throw new Error(
      "Member ID is required."
    );
  }

  return apiRequest(
    `/admin/membership/update/${memberId}/ACTIVE`,
    {
      method: "GET",
    }
  );
};