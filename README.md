# Finance Flow

A modern personal finance management application to help you track expenses, manage budgets, set savings goals, and split group expenses effortlessly.

## Features

- **Dashboard** - Overview of your financial health with key metrics and charts
- **Transactions** - Track income and expenses with categorization
- **Budgets** - Set monthly limits per category and track spending
- **Goals** - Set and monitor savings goals
- **Analytics** - Visual insights into your spending patterns
- **Reports** - Generate and export PDF reports
- **Recurring** - Manage subscriptions and recurring payments
- **Events** - Group expense splitting with custom settlements
- **Authentication** - JWT-based auth with Google OAuth support

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components with Radix UI primitives
- **Recharts** for data visualization
- **Framer Motion** for animations
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Axios** for API requests

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Auth Library** for OAuth
- **bcryptjs** for password hashing

### Testing
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **React Testing Library** for component testing

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/prajaktaukirde/finance-flow.git

# Navigate to project directory
cd finance-flow

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Setup

Create `.env` files for both frontend and backend:

**Frontend (.env):**
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (backend/.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### Running the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend (from root directory)
npm run dev
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## Project Structure

```
finance-flow/
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   │   └── ui/            # shadcn/ui components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service functions
│   ├── layouts/           # Layout components
│   ├── lib/               # Utility functions
│   └── utils/             # Helper utilities
├── backend/               # Backend API
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── config/            # Configuration files
├── dist/                  # Production build
└── public/                # Static assets
```

## License

MIT License

## Author

**Prajakta Ukirde**
- GitHub: [@prajaktaukirde](https://github.com/prajaktaukirde)
