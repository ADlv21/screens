# Changelog

## [Unreleased]

### Added
- **NEW**: Authenticated Navbar Component
  - Clean, responsive navbar for authenticated users
  - Left side: App Icon, Projects, Usage, Settings navigation items
  - Right side: User avatar and sign out button
  - Mobile-responsive with hamburger menu
  - Uses existing resizable navbar components for consistency
  - Follows shadcn/ui design patterns and theme
- **NEW**: Comprehensive Prompt Input Component with full feature set
  - Beautiful, responsive prompt input form with character limit (500 chars)
  - Real-time validation with visual feedback
  - 6 example prompts for user guidance (clickable badges)
  - Loading states during generation with spinner animation
  - Auto-save draft functionality with 2-second debouncing
  - Keyboard shortcuts (⌘+Enter to generate)
  - Draft management (save/clear indicators)
- Supabase Auth integration with login/signup pages
- AuthProvider component for global authentication state management
- Authentication callback and error handling pages
- Resend confirmation email functionality
- Enhanced error handling for expired OTP links

### Changed
- **BREAKING**: Integrated dashboard functionality directly into home page
- Removed separate `/dashboard` route
- Home page now shows different content based on authentication status:
  - Landing page for non-authenticated users
  - Dashboard for authenticated users
- Added loading state while checking authentication
- **IMPROVED**: Redesigned dashboard with professional SaaS-like interface
  - Replaced basic account info display with modern stats cards
  - Added project overview with recent activity feed
  - Implemented proper design system using globals.css theme
  - Used shadcn/ui components for consistent styling
  - Added quick action cards for better user experience

### Technical
- **NEW**: Added essential UI components following shadcn/ui patterns
  - Textarea component with variants and proper styling
  - Card component with header, content, and footer sections
  - Badge component for interactive elements
- Created Supabase client configuration for both server and client
- Implemented middleware for authentication protection
- Added comprehensive error handling for auth flows
- Used shadcn/ui components for consistent UI
- Maintained server-side rendering where possible
- Fixed Next.js 15 build error by wrapping useSearchParams in Suspense boundary

## [Previous Versions]
- Initial project setup with Next.js 14
- Basic UI components and theme configuration
- Project structure and routing setup
