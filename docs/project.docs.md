
# Project API Documentation

This document provides a detailed overview of the Project Management API, which includes endpoints to create, join, update, delete, and manage projects and collaborators. These endpoints are restricted to authenticated users.

## API Endpoints

### 1. Create Project

**URL:** `/api/projects`  
**Method:** `POST`  
**Description:** Allows a user to create a new project and optionally add collaborators.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Body:**
  ```json
  {
      "nama_project": "New Project",
      "deskripsi": "Detailed description of the project.",
      "object": "Research",
      "collaborators": ["collaborator1@example.com", "collaborator2@example.com"]
  }
  ```

#### Response:
- **201 Created:**
  ```json
  {
      "message": "Project created successfully",
      "data": {
          "project": {
              "id": "project-id-123",
              "nama_project": "New Project",
              "deskripsi": "Detailed description of the project.",
              "object": "Research",
              "invite_code": "unique-invite-code",
              "is_finish": false
          }
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

---

### 2. Join Project

**URL:** `/api/project/join`  
**Method:** `POST`  
**Description:** Allows a user to join a project using an invite code.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Body:**
  ```json
  {
      "invite_code": "unique-invite-code"
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Successfully joined the project",
      "data": {
          "project": {
              "id": "project-id-123",
              "nama_project": "Existing Project",
              "deskripsi": "Detailed description of the project.",
              "object": "Research"
          }
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Invalid invite code",
      "data": null
  }
  ```

---

### 3. Get All Projects

**URL:** `/api/projects`  
**Method:** `GET`  
**Description:** Fetches all projects associated with the authenticated user.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Projects fetched successfully",
      "data": [
          {
              "id": "project-id-123",
              "nama_project": "Existing Project",
              "deskripsi": "Detailed description of the project.",
              "object": "Research",
              "created_at": "2024-01-01T00:00:00.000Z"
          }
      ]
  }
  ```

---

### 4. Get Project Details

**URL:** `/api/projects/:id`  
**Method:** `GET`  
**Description:** Fetches detailed information about a specific project.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Project ID

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Project details fetched successfully",
      "data": {
          "id": "project-id-123",
          "nama_project": "Existing Project",
          "deskripsi": "Detailed description of the project.",
          "object": "Research",
          "is_finish": false,
          "collaborators": [
              {
                  "id": "user-id-123",
                  "email": "owner@example.com",
                  "nama": "Owner Name",
                  "is_owner": true
              },
              {
                  "id": "user-id-456",
                  "email": "collaborator@example.com",
                  "nama": "Collaborator Name",
                  "is_owner": false
              }
          ],
          "tasks": [],
          "proposals": null
      }
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "Project not found",
      "data": null
  }
  ```

---

### 5. Update Project

**URL:** `/api/project/:id`  
**Method:** `PATCH`  
**Description:** Updates a project's details. Only the project owner can update it.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Project ID
- **Body:**
  ```json
  {
      "nama_project": "Updated Project",
      "deskripsi": "Updated description",
      "object": "Updated object",
      "is_finish": true
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Project updated successfully",
      "data": {
          "id": "project-id-123",
          "nama_project": "Updated Project",
          "deskripsi": "Updated description",
          "object": "Updated object",
          "is_finish": true
      }
  }
  ```

---

### 6. Delete Project

**URL:** `/api/project/:id`  
**Method:** `DELETE`  
**Description:** Deletes a project. Only the project owner can delete it.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `id`: Project ID

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Project deleted successfully",
      "data": null
  }
  ```

---

### 7. Add Collaborators

**URL:** `/api/project/collaborators`  
**Method:** `POST`  
**Description:** Allows the project owner to add collaborators to the project.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Body:**
  ```json
  {
      "project_id": "project-id-123",
      "collaborators": ["collaborator1@example.com", "collaborator2@example.com"]
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Collaborators added successfully.",
      "data": null
  }
  ```

---

## Notes

1. **Authentication Required:** All endpoints require an `Authorization` header with a Bearer Token.
2. **Access Control:** Only project owners can update, delete, or add collaborators to projects.
3. **Validation Errors:** Ensure request body adheres to the required schema to avoid validation errors.

---

# [Back to README](../README.md)
