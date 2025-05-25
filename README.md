# Simple AI Dialog with Self-written Auth

Simple AI Dialog is a modern, feature-rich chat application built with Next.js 15 and React 19. It provides a fully functional custom-built authentication system, real-time chat capabilities with markdown support, an image exploration gallery powered by Unsplash API, and a sleek, responsive user interface with comprehensive internationalization and theming support.

## ✨ Features

### 🔐 User Authentication
- **Custom Authentication System**: Complete custom-built authentication flow with secure login and registration
- **Protected Routes**: Automatic redirection for unauthenticated users with middleware protection
- **Profile Management**: User information display with registration date and subscription status
- **Session Persistence**: Secure session management with cookie-based authentication

### 💬 Chat Interface
- **Real-time Messaging**: Interactive chat interface with markdown support
- **Code Syntax Highlighting**: Beautiful code blocks with syntax highlighting using rehype-highlight
- **Message History**: Persistent message history with timestamp display
- **Markdown Support**: Full markdown rendering with GitHub Flavored Markdown (GFM)
- **Copy Functionality**: Easy message copying with toast notifications
- **Responsive Design**: Optimized for both desktop and mobile devices

### 🖼️ Image Exploration (Midjourney-style)
- **Masonry Grid Layout**: Pinterest-style responsive grid with different sized image cards
- **Unsplash API Integration**: High-quality images from professional photographers
- **Full-screen Modal**: Immersive image preview with detailed information overlay
- **Image Metadata**: Photographer details, likes count, tags, dimensions, and creation date
- **Direct Download**: One-click image download functionality
- **Skeleton Loading**: Beautiful loading states while fetching API data
- **Mobile Responsive**: Optimized 2-column layout for mobile devices
- **Error Handling**: Comprehensive error handling for API failures and rate limits

### 🌍 Internationalization
- **Multi-language Support**: Complete support for English and Russian languages
- **Dynamic Language Switching**: Real-time language switching throughout the application
- **Persistent Preferences**: Language preference stored in cookies
- **Localized Content**: All UI elements, error messages, and content fully translated
- **Date Localization**: Locale-aware date formatting

### 🎨 Theming System
- **Light/Dark Mode**: Beautiful light and dark theme variants
- **System Theme Detection**: Automatic theme detection based on user's system preferences
- **Theme Persistence**: Theme preference stored in localStorage
- **Smooth Transitions**: Animated theme transitions using next-themes

### 🚀 Performance & UX
- **Server-Side Rendering**: Next.js 15 with App Router for optimal performance
- **React Query Integration**: Efficient data fetching and caching with TanStack Query
- **State Management**: Global state management with Zustand
- **Toast Notifications**: User feedback with Sonner toast notifications
- **Loading States**: Comprehensive loading states and skeleton loaders

## 🛠️ Technologies Used

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality UI components built on Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library

### State Management & Data Fetching
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization for React
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Internationalization & Content
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization for Next.js
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[rehype-highlight](https://github.com/rehypejs/rehype-highlight)** - Syntax highlighting
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** - GitHub Flavored Markdown

### External APIs & Services
- **[Unsplash API](https://unsplash.com/developers)** - High-quality photography API
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting with Next.js configuration
- **[PostCSS](https://postcss.org/)** - CSS processing

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **pnpm** 8.x or later (recommended) or npm/yarn
- **Unsplash API key** (for explore page functionality)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TheVilfer/simple-ai-dialog
   cd simple-ai-dialog
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Unsplash API key:
   ```env
   # Unsplash API Configuration
   # Get your API key from: https://unsplash.com/developers
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```text
simple-ai-dialog/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages (login, register)
│   ├── chat/              # Chat application pages
│   ├── explore/           # Image exploration page
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── explore/           # Image gallery components
│   │   ├── image-grid.tsx        # Masonry grid layout
│   │   ├── image-modal.tsx       # Full-screen image modal
│   │   └── image-grid-skeleton.tsx # Loading skeleton
│   ├── profile/           # Profile components
│   └── ui/                # Reusable UI components (shadcn/ui)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
│   ├── providers/         # React context providers
│   │   ├── auth-provider.tsx     # Authentication context
│   │   ├── theme-provider.tsx    # Theme management
│   │   └── query-provider.tsx    # TanStack Query setup
│   ├── types/             # TypeScript type definitions
│   │   └── unsplash.ts           # Unsplash API types
│   └── utils.ts           # Utility functions
├── messages/              # Internationalization
│   ├── en.json            # English translations
│   └── ru.json            # Russian translations
├── src/i18n/              # i18n configuration
├── public/                # Static assets
├── middleware.ts          # Next.js middleware for auth & i18n
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 📖 Usage Guide

### Authentication Flow
The application starts with authentication screens:
- **Register**: Create a new account with email and password validation
- **Login**: Access existing account with secure authentication
- **Protected Routes**: Automatic redirection to auth pages for unauthenticated users
- **Profile**: View user information and manage account settings

### Chat Experience
Once authenticated, enjoy a rich chat experience:
- **Start Conversations**: Use the "New Chat" button to begin
- **Markdown Support**: Write formatted messages with full markdown support
- **Code Highlighting**: Share code snippets with syntax highlighting
- **Message History**: View conversation history with timestamps
- **Copy Messages**: Easy copying of messages to clipboard
- **Responsive Design**: Seamless experience across all devices

### Image Exploration
Discover beautiful photography:
- **Masonry Gallery**: Browse images in a Pinterest-style layout
- **Image Details**: Click any image for full-screen view with metadata
- **Photographer Info**: View photographer profiles and social links
- **Download Images**: Download high-quality images directly
- **Responsive Grid**: Optimized viewing on mobile (2 columns) and desktop
- **Refresh Content**: Get new random images with the refresh button
- **Error Handling**: Graceful handling of API errors and rate limits

### Customization
Personalize your experience:
- **Language**: Switch between English and Russian
- **Theme**: Choose light, dark, or system theme
- **Persistent Settings**: All preferences saved automatically

## 🔧 API Configuration

### Unsplash API Setup
The explore page uses the Unsplash API for high-quality images:

1. **Create Account**: Visit [Unsplash Developers](https://unsplash.com/developers)
2. **Create Application**: Register a new application
3. **Get Access Key**: Copy your Access Key (not Secret Key)
4. **Configure Environment**: Add to `.env.local`:
   ```env
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

**Important Notes:**
- Use the **Access Key**, not the Secret Key for client-side usage
- Free tier: 50 requests per hour (sufficient for development)
- Demo mode: 50 requests per hour for production apps
- For higher limits, apply for production access

### API Error Handling
The application handles various API scenarios:
- **Missing API Key**: Clear error message with setup instructions
- **Rate Limit Exceeded**: User-friendly message with retry suggestion
- **Network Errors**: Graceful fallback with retry options
- **Invalid Responses**: Proper error boundaries and fallbacks

## 🌐 Internationalization

### Supported Languages
- **English (en)**: Default language
- **Russian (ru)**: Complete translation coverage

### Adding New Languages
1. Create new message file: `messages/[locale].json`
2. Copy structure from `messages/en.json`
3. Translate all keys
4. Update middleware configuration if needed

### Translation Coverage
- All UI elements and navigation
- Error messages and notifications
- Image metadata and descriptions
- Date and time formatting
- Form validation messages

## 🎨 Theme System

### Available Themes
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for low-light usage
- **System**: Automatically matches user's OS preference

### Theme Features
- Smooth transitions between themes
- Persistent theme selection
- System preference detection
- Consistent color scheme across all components

## 🚀 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **[Next.js Team](https://nextjs.org/)** - For the incredible React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[shadcn](https://ui.shadcn.com/)** - For the beautiful, accessible UI components
- **[Unsplash](https://unsplash.com/)** - For providing stunning photography and API
- **[Radix UI](https://www.radix-ui.com/)** - For accessible, unstyled UI primitives
- **[next-intl](https://next-intl-docs.vercel.app/)** - For comprehensive i18n solution
- **[Zustand](https://github.com/pmndrs/zustand)** - For simple, scalable state management
- **[TanStack Query](https://tanstack.com/query)** - For powerful data synchronization

---

**Built with ❤️ using modern web technologies**
