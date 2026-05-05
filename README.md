# Timesheet Management App

A modern, SaaS-style **Timesheet Management Application** built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. It features secure authentication, a clean dashboard, and full CRUD functionality for managing weekly timesheet entries.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### Authentication

- Clean login screen with email and password
- Dummy authentication using **NextAuth.js** (Credentials provider)
- Secure session management with JWT
- Protected routes

### Dashboard

- Responsive table displaying timesheet entries
- Columns: **Week #**, **Date**, **Status**, **Actions**
- View, Add, and Edit timesheet entries via modals
- Form validation using React Hook Form + Zod (or native validation)
- Loading states and error handling
- Responsive design (mobile-friendly)

### Technical Highlights

- All client-side API calls go through internal Next.js API routes (`/api/*`)
- Mock data served through dedicated API endpoints
- Reusable, modular, and clean component structure
- Type-safe throughout with TypeScript
- Basic unit and component tests

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (v5)
- **Forms & Validation**: React Hook Form + Zod (recommended)
- **UI Components**: Headless UI / custom Tailwind components
- **State Management**: React hooks + server components where possible
- **Testing**: Jest + React Testing Library (basic setup)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd timesheet-management-app
   ```
