
# Proposal API Documentation

This document provides a detailed overview of the Proposal Management API, which includes endpoints to create, approve, and retrieve proposals. These endpoints are restricted to authenticated users and administrators.

## API Endpoints

### 1. Create Proposal

**URL:** `/api/:project_id/proposal`  
**Method:** `POST`  
**Description:** Allows a project collaborator to create a proposal for a specific project.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `project_id`: ID of the project
- **Body:**
  ```json
  {
      "judul": "Proposal Title",
      "deskripsi": "Detailed proposal description."
  }
  ```
- **File Upload:**
  - `file_url`: PDF file of the proposal

#### Response:
- **201 Created:**
  ```json
  {
      "message": "Proposal created successfully",
      "data": {
          "id": "proposal-id-123",
          "judul": "Proposal Title",
          "deskripsi": "Detailed proposal description.",
          "file_url": "https://example.com/files/proposal.pdf",
          "status": "PENDING",
          "project_id": "project-id-456"
      }
  }
  ```
- **400 Bad Request:**
  ```json
  {
      "message": "Proposal file is required.",
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

### 2. Approve Proposal

**URL:** `/api/:project_id/proposal/approve`  
**Method:** `PATCH`  
**Description:** Allows an administrator to approve or reject a proposal.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Params:**
  - `project_id`: ID of the project
- **Body:**
  ```json
  {
      "status": "SELESAI" // Or "DITOLAK"
  }
  ```

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Proposal status updated to SELESAI",
      "data": {
          "id": "proposal-id-123",
          "judul": "Proposal Title",
          "deskripsi": "Detailed proposal description.",
          "file_url": "https://example.com/files/proposal.pdf",
          "status": "SELESAI",
          "project_id": "project-id-456"
      }
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. Only admins can approve proposals.",
      "data": null
  }
  ```

---

### 3. Get Proposals by User

**URL:** `/api/:project_id/proposal`  
**Method:** `GET`  
**Description:** Fetches proposals for projects that the authenticated user is part of.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Proposals fetched successfully",
      "data": [
          {
              "id": "proposal-id-123",
              "judul": "Proposal Title",
              "deskripsi": "Detailed proposal description.",
              "file_url": "https://example.com/files/proposal.pdf",
              "status": "PENDING",
              "project_id": "project-id-456"
          }
      ]
  }
  ```
- **404 Not Found:**
  ```json
  {
      "message": "No proposals found for the user.",
      "data": null
  }
  ```

---

### 4. Get Proposal Counts

**URL:** `/api/v1/proposals`  
**Method:** `GET`  
**Description:** Fetches the count of proposals, optionally filtering by status. Only accessible by administrators.

#### Request:
- **Headers:**
  - `Authorization`: Bearer Token
- **Query Parameters:**
  - `status`: (Optional) Filter by status (`PENDING`, `SELESAI`, `DITOLAK`)

#### Response:
- **200 OK:**
  ```json
  {
      "message": "Proposal count fetched successfully",
      "data": {
          "count": 5,
          "status": "PENDING"
      }
  }
  ```
- **403 Forbidden:**
  ```json
  {
      "message": "Access denied. Only admins can view proposals.",
      "data": null
  }
  ```

---

## Notes

1. **Authentication Required:** All endpoints require an `Authorization` header with a Bearer Token.
2. **Access Control:** Only administrators can approve or count proposals.
3. **Validation Errors:** Ensure request body adheres to the required schema to avoid validation errors.
4. **File Uploads:** The `createProposal` endpoint requires a PDF file for the proposal.

---

# [Back to README](./README.md)
