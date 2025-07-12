# Changelog

## [Unreleased]

### Added
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
