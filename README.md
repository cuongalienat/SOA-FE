# SOA-FE (Service-Oriented Architecture - Frontend)

A React-based food ordering application built with Vite, React Router, and modern web technologies.

## Features

- 🏠 Home page with food listings
- 🛒 Shopping cart functionality
- 📱 Responsive design with mobile support
- 🔐 User authentication (Sign In, Sign Up, Password Reset)
- 📍 Location selector
- 🍔 Food categories and details
- 📝 Order management
- 💬 Contact page

## Tech Stack

- **React 19.1.1** - UI framework
- **Vite** - Build tool and dev server (using Rolldown)
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **React Redux** - State management
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cuongalienat/SOA-FE.git
   cd SOA-FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── common/    # Common UI components
│   └── layout/    # Layout components (Navbar, Footer, etc.)
├── pages/         # Page components
├── services/      # API services
├── config/        # Configuration files
├── hooks/         # Custom React hooks
└── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
