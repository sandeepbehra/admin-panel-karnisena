import { apiRequest } from "../api";

const START_DATE =
  "1788192000000";

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