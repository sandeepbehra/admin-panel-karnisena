import { apiRequest } from "@/services/api";

// ==============================
// EVENTS
// ==============================
const START_DATE = "1788192000000";
export const getEvents = ({
  page = 0,
  limit = 10,
} = {}) => {
  return apiRequest(
    `/admin/events?startDate=${START_DATE}&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const getEventById = (id) => {
  if (!id) {
    throw new Error(
      "Event ID is required."
    );
  }

  return apiRequest(
    `/admin/event/${id}`,
    {
      method: "GET",
    }
  );
};

export const createEvent = (data) => {
  if (!data) {
    throw new Error(
      "Event data is required."
    );
  }

  return apiRequest(
    "/admin/event/create",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const updateEvent = (
  id,
  data
) => {
  if (!id) {
    throw new Error(
      "Event ID is required."
    );
  }

  return apiRequest(
    `/admin/event/update/${id}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};
export const deleteEvent = (id) => {
  if (!id) {
    throw new Error(
      "Event ID is required."
    );
  }

  return apiRequest(
    `/admin/event/delete/${id}`,
    {
      method: "DELETE",
    }
  );
};

// ==============================
// CATEGORIES
// ==============================

export const getCategories = ({
  page = 0,
  limit = 100,
} = {}) => {
  return apiRequest(
    `/admin/categories?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const createCategory = (
  data
) => {
  if (!data) {
    throw new Error(
      "Category data is required."
    );
  }

  return apiRequest(
    "/admin/category",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};