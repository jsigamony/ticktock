# TickTock - Timesheet Management App

A modern, SaaS-style **Timesheet Management Application** built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. It features secure authentication, employee timesheet tracking, and full CRUD functionality for managing weekly timesheet entries via modals and a dashboard interface.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### Authentication

- Clean login screen with email and password
- Dummy authentication using **NextAuth.js** (Credentials provider)
- Secure session management with JWT
- Protected routes with automatic redirects
- User roles: admin and employee (defined but not enforced)

### Dashboard

- Responsive table displaying user's timesheet entries
- Columns: **Week #**, **Date Range**, **Status**, **Actions**
- Pagination (5/10/25 rows per page)
- Filtering by date range and status
- Status badges with color coding (completed: green, incomplete: yellow, missing: red)
- Loading states and error handling
- Mobile-friendly responsive design

### Timesheet Management

- **View Details**: Click on a timesheet to see entries grouped by date
- **Add Entries**: Modal form to add new time entries with project, task, hours, and description
- **Edit Entries**: Inline editing of existing entries
- **Delete Entries**: Remove entries with confirmation
- **Track Hours**: Displays logged hours vs. 40-hour weekly target
- Form validation with error messages

### Technical Highlights

- All client-side API calls go through internal Next.js API routes (`/api/*`)
- Mock data served through dedicated API endpoints (in-memory, no database)
- Reusable, modular, and clean component structure
- Fully type-safe with TypeScript (strict mode enabled)
- Mix of server and client components for optimal performance
- Custom hooks for data fetching and state management

## 🛠 Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + PostCSS
- **Authentication**: NextAuth.js v5 (Credentials provider, JWT)
- **UI Components**: Custom Tailwind components (no external UI library)
- **State Management**: React hooks + server components
- **HTTP Client**: Browser Fetch API
- **Package Manager**: npm / yarn / pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jsigamony/ticktock.git
   cd ticktock
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to `/login`. Use one of the test accounts below.

### Test Accounts

All test accounts use the password: `password123`

- **Alice Johnson** (admin) — alice@ticktock.dev
- **Bob Smith** (employee) — bob@ticktock.dev
- **Carol White** (employee) — carol@ticktock.dev

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 📡 API Documentation

The application uses Next.js API routes for all data operations. All endpoints return JSON.

### Authentication Endpoints

- `POST /api/auth/signin` — Sign in with credentials
- `POST /api/auth/signout` — Sign out
- `GET /api/auth/session` — Get current session

### Timesheets Endpoints

| Endpoint               | Method | Description                     | Query Params                                               |
| ---------------------- | ------ | ------------------------------- | ---------------------------------------------------------- |
| `/api/timesheets`      | GET    | Fetch timesheets                | `userId` (optional), `timesheetId` (optional for entries)  |
| `/api/timesheets`      | POST   | Create new timesheet            | Body: `{ userId, weekStart, weekEnd, totalHours, status }` |
| `/api/timesheets/[id]` | GET    | Get timesheet details + entries |                                                            |
| `/api/timesheets/[id]` | POST   | Add entry to timesheet          | Body: `{ date, project, task, hours, description }`        |
| `/api/timesheets/[id]` | PATCH  | Update existing entry           | Body: `{ entryId, ...fields }`                             |
| `/api/timesheets/[id]` | DELETE | Delete entry                    | Body: `{ entryId }`                                        |

### Users Endpoints

| Endpoint     | Method | Description                         |
| ------------ | ------ | ----------------------------------- |
| `/api/users` | GET    | List all users (passwords excluded) |
| `/api/users` | POST   | Authenticate user (internal use)    |

**Example API Call:**

```javascript
// Fetch user's timesheets
fetch("/api/timesheets?userId=user-1")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 🧩 Component Usage

### Custom Hooks

- `useTimesheets({ userId })` — Fetches user's timesheets with loading/error states
- `useTimesheetEntries(timesheetId)` — Fetches entries for a specific timesheet

### Key Components

- `TimesheetTable` — Displays paginated timesheet list
- `TimesheetDetails` — Shows entries grouped by date
- `TimesheetModal` — Read-only timesheet view modal
- `AddTimeModal` — Add/edit entry modal
- `LoginForm` — Authentication form
- `Navbar` — Navigation with user info and logout

## 🗄️ Database

Currently uses **in-memory mock data** (no persistent database). Data is stored in `src/lib/mockData.ts` and resets on server restart.

**Mock Data Includes:**

- 3 test users with roles
- 6 weeks of timesheet data (2025-04-28 to 2025-05-11)
- Sample projects: Alpha, Beta, Gamma, Delta
- Task types: Frontend development, Bug fixes, Testing, Code review, etc.

To add a real database, replace mock data with a database adapter (e.g., Prisma + PostgreSQL).

## 🧪 Testing

Basic testing setup is configured but no tests are implemented yet.

```bash
# Run tests (when implemented)
npm run test
```

Future: Jest + React Testing Library for unit and component tests.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables: None required (mock data)

### Other Platforms

- Build with `npm run build`
- Serve with `npm run start`
- Ensure Node.js 20+ runtime

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

**Code Style:**

- TypeScript strict mode
- ESLint configuration
- Tailwind CSS for styling
- Component-based architecture

## 📄 License

This project is private and not licensed for public use.

---

Built with ❤️ using Next.js and TypeScript.
