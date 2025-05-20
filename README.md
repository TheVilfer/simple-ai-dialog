# Simple AI Dialog with Self-written Auth

Simple AI Dialog is a modern, feature-rich chat application built with Next.js. It provides a fully functional custom-built authentication system, real-time chat capabilities, and a sleek, responsive user interface with support for multiple languages and themes.

## Features

### User Authentication
- Complete custom authentication flow with secure login and registration
- Protected routes that redirect unauthenticated users
- Profile management with user information display

### Chat Interface
- Real-time messaging with markdown support
- Code syntax highlighting in chat messages
- Message history with timestamp display
- New chat creation with simple UI

### Internationalization
- Full support for English and Russian languages
- Easy language switching throughout the application
- Language preference persistence using cookies

### Theming
- Light and dark mode support
- System theme detection
- Theme preference persistence using localStorage

## Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: 
  - [Zustand](https://github.com/pmndrs/zustand) for global state
  - [React Query](https://tanstack.com/query) for API calls
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Code Highlighting**: [rehype-highlight](https://github.com/rehypejs/rehype-highlight)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TheVilfer/simple-ai-dialog
   cd simple-ai-dialog
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
simple-ai-dialog/
├── app/                # Next.js app router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── chat/           # Chat application pages
│   ├── profile/        # User profile pages
├── components/         # React components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── profile/        # Profile components
│   ├── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── providers/      # React context providers
├── messages/           # Internationalization messages
│   ├── en.json         # English translations
│   ├── ru.json         # Russian translations
├── public/             # Static files
└── src/                # Source files
    └── i18n/           # i18n configuration
```

## Usage

### Authentication

The application starts with authentication screens. You can:
- Register a new account with email and password
- Login with existing credentials
- Access protected routes like chat and profile after authentication

### Chat

Once authenticated, you can:
- Start new conversations with the "New Chat" button
- Send messages with Markdown support
- View message history with timestamps
- Switch between languages while chatting

### Profile

The profile page displays:
- User information including email
- Registration date
- Subscription information
- Options to switch themes and languages

## Internationalization

The application supports English and Russian languages. You can switch between them using the language switcher in the UI. The language preference is stored in cookies and persists between sessions.

## Theming

The application supports light and dark themes. You can switch between them using the theme toggle in the UI. The theme preference is stored in localStorage and persists between sessions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [next-intl](https://next-intl-docs.vercel.app/) for the internationalization solution
- [Zustand](https://github.com/pmndrs/zustand) for the state management
