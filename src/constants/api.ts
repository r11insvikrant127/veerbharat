// src/constants/api.ts

export const API_MESSAGES = {
  SUCCESS: "Success",

  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",

  FETCHED: "Resource fetched successfully.",
  FETCHED_ALL: "Resources fetched successfully.",

  NOT_FOUND: "Resource not found.",
  ALREADY_EXISTS: "Resource already exists.",

  INVALID_REQUEST: "Invalid request.",
  VALIDATION_FAILED: "Validation failed.",

  INTERNAL_SERVER_ERROR: "Internal server error.",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  INTERNAL_SERVER_ERROR: 500,
} as const;