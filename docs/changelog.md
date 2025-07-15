# Changelog

## [Unreleased]

### Added
- **Dynamic Pricing Integration**: Real-time pricing plans fetched from Polar.sh
  - Created `getPolarPricingPlans()` server action to fetch live pricing data from Polar API
  - Replaced static hardcoded pricing with dynamic pricing plans and features
  - Added proper pricing plan sorting (Free → Standard → Pro)
  - Enhanced pricing display with actual credits and features from Polar benefits
  - Added fallback static pricing data for API failures
- **Interactive Pricing Cards**: New client-side pricing card component with redirect functionality
  - Created reusable `PricingCard` component with proper styling for each plan type
  - Added loading states and proper error handling for subscription flows
  - Implemented smart redirects: Free plan → login, Paid plans → checkout
  - Added responsive design with "Most Popular" highlighting for Standard plan
  - Integrated proper button handling for subscription and trial flows
- **Simplified Free Plan Subscription**: Streamlined server-side automatic free plan subscription for new users
  - Moved logic from client-side `useEffect` to server-side auth callback
  - Replaced fragile time-based detection (< 5 minutes) with reliable database checks
  - Enhanced error handling that doesn't block authentication flow
  - Added proper logging for subscription success/failure
  - Removed unused parameters and client-side complexity

### Cleanup & Refactoring
- **Code Cleanup**: Comprehensive codebase cleanup and refactoring
  - Removed unused test file `src/components/delete-later-polar-test.tsx` marked for deletion
  - Removed unused CreditStatus component `src/components/credit-status.tsx` (not used anywhere)
  - Cleaned up redundant migration files (`001_storage_bucket_fix.sql`, `001_storage_bucket_simple.sql`)
  - Replaced placeholder content in `feature-grid.tsx` with actual app features
  - Updated landing page with proper branding and feature descriptions
  - Removed debugging console.log statements while preserving legitimate error logging
  - Removed unused imports: `Box`, `Lock`, `Search`, `Settings` from `feature-grid.tsx`
  - Improved code organization and removed unused imports
  - Updated migration documentation to reflect current state

### Changed
- **Pricing Page**: Fixed dynamic pricing data parsing and display issues
  - Corrected API data parsing to show actual prices ($0, $29, $39) instead of all $0
  - Fixed credit allocation logic for Free plan (10 credits) vs paid plans (200/500)
  - Improved button styling for "Most Popular" pricing card with better contrast
  - Enhanced data validation and fallback handling for API responses
  - Changed plan sorting from name-based to price-based (lowest to highest)
- **Landing Page**: Complete redesign with proper branding, hero section, and feature showcase
- **Feature Grid**: Updated with actual app features (Mobile-First Design, AI-Powered Generation, Complete HTML & CSS, Lightning Fast, Project Management)
- **Navigation**: Fixed navbar component API usage and improved mobile menu functionality
- **Imports**: Cleaned up unused imports throughout the codebase for better maintainability

### Fixed
- **Navbar**: Fixed component API usage for `NavItems`, `MobileNav`, `MobileNavToggle`, and `MobileNavMenu`
- **Linter Errors**: Resolved TypeScript linter errors related to component props and imports
- **Component Structure**: Improved component organization and removed redundant code

### Security
- **Debug Information**: Removed debug console.log statements that could potentially expose sensitive information

## Previous Entries

### [1.0.0] - 2024-01-01
- Initial release with core AI screen generation functionality
- Polar.sh integration for subscription management
- Supabase authentication and database integration
