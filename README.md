# Clinikk TV Backend

## Description

Clinikk TV Backend is a Node.js and Express application that provides APIs for uploading, fetching, and deleting videos and audios. It uses MongoDB for data storage.

## Running the Backend Service

### Prerequisites

- Node.js
- MongoDB

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/qAditya/clinikk-tv-backend.git
   cd clinikk-tv-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `clinikk-tv-backend` directory with the following content:

   ```env
   MONGO_URI=your-mongodb-uri
   SECRET_KEY=your-secret-key
   ```

4. Start the backend service:

   ```bash
   npm start
   ```

## Dependencies

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- JSON Web Token (JWT)

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `PUT /api/auth/profile`: Update user profile

### Videos

- `POST /api/videos/upload`: Upload a new video (Admin only)
- `GET /api/videos`: Fetch videos based on user health data
- `DELETE /api/videos/:id`: Delete a video (Admin only)

### Audios

- `POST /api/audios/upload`: Upload a new audio (Admin only)
- `GET /api/audios`: Fetch audios based on user health data
- `DELETE /api/audios/:id`: Delete an audio (Admin only)

## Design Approach

The application is designed using a client-server architecture. The backend is built with Node.js and Express, and it uses MongoDB for data storage. We also give tags to media content, and according to which the respective content can be served to people.
