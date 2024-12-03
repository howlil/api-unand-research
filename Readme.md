# API Documentation

This repository contains the backend API for task and project management. Below are the links to the specific module documentation:

- [Task API Documentation](./docs//task.docs.md)
- [Auth API Documentation](./docs/auth.docs.md)
- [Project API Documentation](./docs/project.docs.md)
- [Proposal API Documentation](./docs/proposal.docs.md)

## How to Run

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the `.env` file with the required environment variables:

   - `DATABASE_URL`: URL for the database connection
   - `JWT_SECRET`: Secret key for JWT authentication
   - `EMAIL` and `EMAIL_PASSWORD` (if using email notifications)

4. Run the development server:
   ```bash
   npm run dev
   ```

## Testing APIs

Use a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API endpoints.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes with descriptive messages.
4. Create a pull request for review.

---

For more details, refer to the module-specific documentation linked above.
