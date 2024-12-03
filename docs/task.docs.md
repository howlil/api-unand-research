
# Task API Documentation

This document provides a detailed overview of the Task Management API, which includes endpoints to create, update, delete, and retrieve tasks. Access is restricted to authenticated users who are part of the project (either as owners or collaborators).

## API Endpoints

### 1. Create Task

**URL:** `/api/task`  
**Method:** `POST`  
**Description:** Allows a project owner or collaborator to create a new task.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Body:**
  ```json
  {
      "deskripsi": "Task description with at least 10 characters.",
      "deadline": "2024-12-31",
      "penanggung_jawab": "user-id-123",
      "project_id": "project-id-456"
  }
  ```

#### Response:
- **201 Created:**
  ```json
  {
      "message": "Task created successfully",
      "data": {
          "id": "task-id-789",
          "deskripsi": "Task description with at least 10 characters.",
          "deadline": "2024-12-31",
          "is_finish": false,
          "penanggung_jawab": "user-id-123",
          "project_id": "project-id-456"
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
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. You are not part of this project.",
      "data": null
  }
  ```

---

### 2. Update Task

**URL:** `/api/task/:id`  
**Method:** `PATCH`  
**Description:** Allows a project owner or collaborator to update a task's details or mark it as finished.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Task ID
- **Body:**
  ```json
  {
      "deskripsi": "Updated task description.",
      "deadline": "2024-11-30",
      "is_finish": true,
      "penanggung_jawab": "user-id-124"
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Task updated successfully",
      "data": {
          "id": "task-id-789",
          "deskripsi": "Updated task description.",
          "deadline": "2024-11-30",
          "is_finish": true,
          "penanggung_jawab": "user-id-124",
          "project_id": "project-id-456"
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Task not found",
      "data": null
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. You are not part of this project.",
      "data": null
  }
  ```

---

### 3. Delete Task

**URL:** `/api/task/:id`  
**Method:** `DELETE`  
**Description:** Allows a project owner or collaborator to delete a task.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Task ID

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Task deleted successfully",
      "data": null
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Task not found",
      "data": null
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. You are not part of this project.",
      "data": null
  }
  ```

---

### 4. Get All Tasks

**URL:** `/api/tasks/:project_id`  
**Method:** `GET`  
**Description:** Fetches all tasks for a specific project. Users must be part of the project.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `project_id`: Project ID

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Tasks fetched successfully",
      "data": [
          {
              "id": "task-id-789",
              "deskripsi": "Task description.",
              "deadline": "2024-12-31",
              "is_finish": false,
              "penanggung_jawab": "user-id-123",
              "project_id": "project-id-456"
          }
      ]
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. You are not part of this project.",
      "data": null
  }
  ```

---

### 5. Get Task Details

**URL:** `/api/tasks/:id`  
**Method:** `GET`  
**Description:** Fetches details of a specific task. Users must be part of the project.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Task ID

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Task details fetched successfully",
      "data": {
          "id": "task-id-789",
          "deskripsi": "Task description.",
          "deadline": "2024-12-31",
          "is_finish": false,
          "penanggung_jawab": "user-id-123",
          "project_id": "project-id-456"
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Task not found",
      "data": null
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. You are not part of this project.",
      "data": null
  }
  ```

---

## Notes

1. **Authentication Required:** All endpoints require an `Authorization` header with a Bearer Token.
2. **Access Control:** Users must be part of the project (either as owner or collaborator) to interact with its tasks.
3. **Validation Errors:** Ensure request body adheres to the required schema to avoid validation errors.

---

# [Back to README](../README.md)
