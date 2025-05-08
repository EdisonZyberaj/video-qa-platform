# Q&A Platform

A full-stack web application that enables users to create surveys, ask questions, and receive video or text-based responses. The platform facilitates knowledge sharing between experts (responders) and those seeking information (askers).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributors](#contributors)
- [License](#license)

## Overview

The Q&A Platform is designed to bridge the gap between experts and knowledge seekers through interactive surveys and video responses. Users can create customized surveys with multiple questions, share them with responders, and collect both text and video-based answers.

## Features

### User Authentication
- User registration and login with email/password
- JWT-based authentication
- Role-based access control (Admin, Asker, Responder)
- Profile management (update profile information, change password)

### Survey Management
- Create new surveys with title and description
- Add multiple questions to surveys with categories
- Edit existing surveys and questions
- View all created surveys
- Search surveys by title, description, or author

### Question Management
- Add questions to surveys with different categories
- Categorize questions for better organization
- View questions by survey

### Response System
- Text-based answers to specific questions
- Video responses for entire surveys
- Upload recorded videos directly through the platform
- Video storage using Google Drive integration

### Admin Dashboard
- View platform statistics (users, surveys, questions, answers)
- User management (view all users, delete users)
- Survey management (view all surveys, delete surveys)
- View recent activity (answers, surveys)

### User Experience
- Responsive design for mobile and desktop
- Intuitive navigation
- Real-time feedback with toast notifications
- Search functionality
- User profile with activity tracking

## Technologies

### Frontend
- React.js
- Tailwind CSS
- React Router for navigation
- Axios for API requests
- React Icons and Lucide React for icons
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL database
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Google Drive API for video storage

## Architecture

The application follows a client-server architecture:

1. **Frontend**: React-based single-page application
2. **Backend**: RESTful API built with Express.js
3. **Database**: PostgreSQL with Prisma ORM
4. **File Storage**: Google Drive API for video uploads
5. **Authentication**: JWT-based token system

## Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- Google Cloud Platform account (for Google Drive API)

### Backend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/qa-platform.git
cd qa-platform/backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your configuration
```
DATABASE_URL="postgresql://username:password@localhost:5432/qa_platform"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
PORT=5000
GOOGLE_DRIVE_CLIENT_ID="your-google-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_DRIVE_REDIRECT_URI="https://developers.google.com/oauthplayground"
GOOGLE_DRIVE_REFRESH_TOKEN="your-refresh-token"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the server
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

## Usage

### User Registration
1. Navigate to the registration page
2. Enter your name, email, password, and select a role (Asker or Responder)
3. Submit the form to create your account

### Creating a Survey (Asker)
1. Log in as an Asker
2. Navigate to "Add Survey"
3. Fill in the survey details (title, description)
4. Add questions with categories
5. Save the survey

### Responding to Surveys (Responder)
1. Log in as a Responder
2. Navigate to "Responder Surveys"
3. Browse available surveys
4. Select a survey to view its questions
5. Provide text answers to individual questions
6. Optionally record and upload a video response

### Viewing Responses (Asker)
1. Log in as an Asker
2. Navigate to "My Surveys"
3. Select a survey
4. Click "View Answers"
5. Browse responders and their answers
6. View both text and video responses

### Admin Functions
1. Log in as an Admin
2. Access the admin dashboard
3. View platform statistics
4. Manage users and surveys
5. Delete problematic content if necessary

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update-profile` - Update user profile
- `POST /api/user/change-password` - Change user password
- `POST /api/user/get-by-ids` - Get users by IDs

### Survey Management
- `GET /api/surveys/get-all-surveys` - Get all surveys
- `GET /api/surveys/my-surveys` - Get user's surveys
- `GET /api/surveys/:id` - Get survey by ID
- `GET /api/surveys/:id/questions` - Get survey questions
- `POST /api/surveys/add-survey` - Create a new survey
- `PATCH /api/surveys/:id/update-survey` - Update a survey
- `GET /api/surveys/:id/responders` - Get survey responders
- `GET /api/surveys/:surveyId/responder/:responderId` - Get responder answers

### Question Management
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create a new question
- `PATCH /api/questions/:id` - Update a question
- `DELETE /api/questions/:id` - Delete a question

### Answer Management
- `POST /api/answers/submit` - Submit answers (text and/or video)
- `GET /api/answers/question/:questionId` - Get answers by question
- `GET /api/answers/survey/:surveyId/responder/:responderId` - Get responder answers
- `GET /api/answers/survey/:surveyId/video/:responderId` - Get video answer

### Admin Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/surveys` - Get all surveys
- `DELETE /api/admin/surveys/:id` - Delete a survey

## User Roles

### Asker
- Create and manage surveys
- Add and edit questions
- View responses from responders
- Edit profile information

### Responder
- Browse available surveys
- Answer questions with text responses
- Record and upload video responses
- View own activity

### Admin
- Access the admin dashboard
- View platform statistics
- Manage all users and surveys
- Delete users and content

