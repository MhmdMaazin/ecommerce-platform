# E-Commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, and Firebase, featuring a responsive design and seamless shopping experience.

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📱 Responsive mobile-first design
- 🔒 Secure payment integration
- 📦 Order tracking

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or later)
- npm (v9 or later)
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MhmdMaazin/ecommerce-platform.git
cd ecommerce-platform
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

To run the seed script and then start the development server:

```bash
npx tsx scripts/seed.ts
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Building for Production

To create a production build:

```bash
npm run build
```

To test the production build locally:

```bash
npm start
```

## Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Configure your environment variables in the Vercel dashboard:
   - Add all Firebase environment variables
   - Add any additional configuration needed
5. Click "Deploy"

### Manual Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

## Project Structure

```
ecommerce-platform/
├── app/                   # Next.js 13+ app directory
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart page
│   ├── explore/          # Product exploration page
│   ├── products/         # Product details pages
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
├── lib/                  # Utility functions and Firebase setup
├── public/              # Static assets
└── types/               # TypeScript type definitions
```
