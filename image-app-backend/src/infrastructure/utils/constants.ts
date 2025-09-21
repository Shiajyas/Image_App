export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  USER: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Invalid email or password",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
  },
  IMAGE: {
    UPLOAD_SUCCESS: "Images uploaded successfully",
    REORDER_SUCCESS: "Images reordered successfully",
    FETCH_SUCCESS: "Images fetched successfully",
    UPDATE_SUCCESS: "Image updated successfully",
    DELETE_SUCCESS: "Image deleted successfully",
    DELETE_FAILED: "Failed to delete image",
  },
  ERROR: {
    SERVER: "Something went wrong. Please try again later",
  },
} as const;
