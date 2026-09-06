# JobTrail — Job Application Tracker Frontend

JobTrail is a responsive job application tracking application that helps users manage their job applications from a single dashboard.

This repository contains the React frontend for the JobTrail application.

## Features

* User registration and login
* JWT-based authentication
* Protected routes
* Dashboard with application statistics
* Recent applications
* Application list
* Search
* Status filtering
* Pagination
* Add application
* Edit application
* Delete application
* Custom delete confirmation modal
* Loading states
* Empty states
* Error states with retry
* Responsive mobile UI

## Tech Stack

* React 18
* Vite
* React Router DOM
* Axios
* JavaScript
* CSS

## Project Structure

```text
jobtrail-frontend/
├── src/
│   ├── api/
│   │   ├── applications.js
│   │   ├── auth.js
│   │   └── client.js
│   ├── auth/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── ApplicationCard.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatCard.jsx
│   ├── pages/
│   │   ├── ApplicationForm.jsx
│   │   ├── ApplicationList.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone <FRONTEND_REPOSITORY_URL>
cd jobtrail-frontend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The `.env` file should not be committed to GitHub.

An example environment file is included as:

```text
.env.example
```

## Run the Development Server

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

Make sure the Django backend is running at the same time.

## Available Routes

### Public Routes

```text
/login
/register
```

### Protected Routes

```text
/
/applications
/applications/new
/applications/:id/edit
```

Unauthenticated users are redirected to the login page.

## API Integration

Axios is configured in:

```text
src/api/client.js
```

The API base URL is loaded from:

```text
VITE_API_URL
```

The Axios client automatically attaches the JWT access token to authenticated requests.

## Application Features

### Dashboard

The dashboard displays:

* Total applications
* Applied applications
* Interview applications
* Offers
* Rejected applications
* Five recent applications

### Application List

Users can:

* Search by company or position
* Filter by status
* Navigate through pages
* Edit applications
* Delete applications

### Application Form

Users can create and edit applications with:

* Company
* Position
* Status
* Job type
* Applied date
* Expected salary
* Job link
* Notes

## Responsive Design

The interface is responsive and designed to work on desktop and mobile screen sizes, including a 390px viewport.

The five application statuses are visually distinguished using both color and text.

## Testing

The frontend was tested for:

* Registration
* Login
* Logout
* Protected routes
* Browser refresh authentication persistence
* Dashboard
* Application CRUD
* Search
* Filtering
* Pagination
* Delete confirmation
* Loading state
* Empty state
* Error state
* Retry functionality
* Mobile responsiveness

Production build can be tested with:

```bash
npm run build
```

## Backend Repository

The Django REST API backend is maintained in a separate repository:

```text
<BACKEND_REPOSITORY_URL>
```

## License

This project is developed for educational and assignment purposes.
