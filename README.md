# Cyberpunk To-Do List

A themed task management application with gamification features, powered by Next.js and Firebase.

## Features

- **Cyberpunk Theme**: Immersive UI with cyberpunk aesthetics
- **User Authentication**: Secure login and registration via Firebase
- **Task Management**: Create, edit, complete, and delete tasks
- **Gamification**: Gain XP and level up by completing tasks
- **Real-time Updates**: Changes sync instantly across devices
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/crach-ad/crachToDo.git
   cd crachToDo
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Create a `.env.local` file based on `.env.template`
   - Fill in your Firebase configuration

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firestore security rules

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
