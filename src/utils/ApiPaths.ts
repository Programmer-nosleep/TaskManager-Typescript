export const BASE_URL = "http://localhost:8080";

// utils/ApiPaths.ts
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile"
  },

  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId: any) => `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER: (userID: any) => `/api/users/${userID}`,
    DELETE_USER: (userID: any) => `/api/users/${userID}`
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DAHSBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: (taskID: any) => `/api/tasks/${taskID}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (taskID: any) => `/api/tasks/${taskID}`,
    DELETE_TASK: (taskID: any) => `/api/tasks/${taskID}`,

    UPDATE_TASK_STATUS: (taskID: any) => `/api/tasks/${taskID}/status`,
    UPDATE_TODO_CHECKLIST: (taskID: any) => `/api/tasks/${taskID}/todo`
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users"
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image"
  }
}