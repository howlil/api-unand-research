
# Authentication API Documentation

This document provides a detailed overview of the Authentication API, which includes endpoints to register, log in, and manage user information. These endpoints ensure secure access and manipulation of user data.

## API Endpoints

### 1. Register User

**URL:** `/api/register`  
**Method:** `POST`  
**Description:** Registers a new user by providing their email, name, and password.

#### Request:
- **Body:**
  ```json
  {
      "email": "user@example.com",
      "nama": "User Name",
      "password": "securepassword"
  }
  ```

#### Response:
- **201 Created:**
  ```json
  {
      "message": "User registered successfully",
      "data": {
          "id": "user-id-123",
          "email": "user@example.com",
          "nama": "User Name"
      }
  }
  ```
- **400 Bad Request:**
  ```json
  {
      "message": "Validation error details here",
      "data": null
  }
  ```
- **400 Email Exists:**
  ```json
  {
      "message": "Email already exists",
      "data": null
  }
  ```

---

### 2. Login User

**URL:** `/api/login`  
**Method:** `POST`  
**Description:** Logs in an existing user by validating their email and password.

#### Request:
- **Body:**
  ```json
  {
      "email": "user@example.com",
      "password": "securepassword"
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "User logged in successfully",
      "data": {
          "token": "jwt-token-here",
          "user": {
              "id": "user-id-123",
              "email": "user@example.com",
              "nama": "User Name"
          }
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Invalid email or password",
      "data": null
  }
  ```

---

### 3. Get Current User

**URL:** `/api/me`  
**Method:** `GET`  
**Description:** Fetches the details of the currently authenticated user.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Users fetched successfully",
      "data": {
          "id": "user-id-123",
          "email": "user@example.com",
          "nama": "User Name",
          "photo_url": "https://example.com/images/user.jpg",
          "created_at": "2024-01-01T00:00:00.000Z"
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "No users found",
      "data": null
  }
  ```

---

### 4. Edit User

**URL:** `/api/me`  
**Method:** `PATCH`  
**Description:** Updates the details of the currently authenticated user. Users can update their email, name, password, or profile picture.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Body:**
  ```json
  {
      "email": "updateduser@example.com",
      "nama": "Updated Name",
      "password": "newsecurepassword",
      "photo_url": "https://example.com/images/newphoto.jpg"
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "User updated successfully",
      "data": {
          "id": "user-id-123",
          "email": "updateduser@example.com",
          "nama": "Updated Name",
          "photo_url": "https://example.com/images/newphoto.jpg"
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "User not found",
      "data": null
  }
  ```
- **400 Bad Request:**
  ```json
  {
      "message": "Validation error details here",
      "data": null
  }
  ```

---

## Notes

1. **Authentication Required:** The `/api/me` and `/api/me (PATCH)` endpoints require an `Authorization` header with a Bearer Token.
2. **Validation Errors:** Ensure request body adheres to the required schema to avoid validation errors.
3. **Password Handling:** Passwords are securely hashed using bcrypt before being stored in the database.

---

# [Back to README](../README.md)
