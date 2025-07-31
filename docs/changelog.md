# Changelog

## [Latest] - 2024-12-XX

### Added

- **Codebase Analysis Completed**: Analyzed trigger and function usage across the entire project
  - Found version numbering conflict between manual setting and auto-increment trigger
  - Identified redundant `updated_at` manual setting vs triggers
  - Confirmed essential functions: `handle_new_user()`, `ensure_single_current_version()`
- **New Simplified Migration**: Created `simplified_complete_setup.sql` - conflict-free version
  - ❌ **REMOVED**: `set_version_number()` trigger (conflicts with manual version_number: 1)
  - ✅ **KEPT**: `update_updated_at_column()` triggers (useful for auto-timestamps)
  - ✅ **KEPT**: `ensure_single_current_version()` trigger (maintains data consistency)
  - ✅ **KEPT**: `handle_new_user()` trigger (essential for auth sync)
- **User Sync Trigger Restored:** Added back the `handle_new_user` function and trigger to `simplified_complete_setup.sql`.
  - Automatically syncs new users from `auth.users` to your `users` table on signup.

### Technical Analysis Results

- **Version Numbering**: Code manually sets `version_number: 1` in `generate-ui.ts:239`
- **Timestamp Updates**: Code manually sets `updated_at` in webhooks but triggers can handle it
- **Current Version Control**: Code sets `is_current: true` and trigger ensures only one current version
- **User Creation**: Auth trigger successfully syncs `auth.users` with `users` table

### Recommendations Applied

- Use the simplified migration for new setups to avoid database conflicts
- Consider removing manual `updated_at` setting to let triggers handle it automatically
- Keep manual version numbering as is (works reliably)

- **New Complete Setup Migration**: Created `complete_setup.sql` - single migration file for fresh Supabase projects
  - Includes all tables: users, projects, screens, screen_versions, subscriptions, polar_config
  - Storage bucket creation with 5MB limit and proper MIME types
  - Complete RLS policies for security
  - Performance indexes for optimal queries
  - Utility functions and triggers for automation
  - Auth integration with automatic user creation
  - Polar.sh integration ready

### Technical Details

- Uses proper foreign key constraints with CASCADE deletes
- Row Level Security (RLS) enabled on all tables
- Storage policies restrict access to user's own project files
- Automatic versioning for screen iterations
- Timestamp triggers for audit trails
- Credit system ready for Polar.sh integration

## [Unreleased]

### Added

- **Credits Exhausted Modal**: Improved user experience for new users with zero credits
  - Created elegant modal dialog to replace inline error messages when users have insufficient credits
  - Modal displays current credits remaining and promotional content for premium features
  - Provides clear upgrade paths with direct links to appropriate subscription tiers
  - Includes fallback to pricing page for better conversion flow
  - Enhanced UX for new users who start with 0 credits instead of showing raw error message
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
- Made the Generate New Screen (PromptInputNode) collapsible in ProjectFlow using shadcn/ui Accordion.
- Added detailed console.log statements to every major step and branch in `generateUIComponent` (src/lib/actions/generate-ui.ts) for improved traceability and debugging.
- Added real framer-motion entrance animations to all major sections for smooth, accessible transitions.
- Improved accessibility: added aria-labels, descriptive alt text, keyboard focus states for all interactive elements.
- Optimized all images/SVGs for performance and accessibility.

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

- **Plan Configuration Refactor**: Consolidated inconsistent plan management into unified structure

  - Merged `FREE_PLAN_CONFIG` and `PRODUCT_IDS` objects into single `PLAN_CONFIG` object
  - Added missing credit amounts for Standard (200) and Pro (500) plans
  - Eliminated hardcoded meter ID duplicates (was repeated 3 times)
  - Created centralized plan configuration with consistent structure across all plans
  - Added `CREDIT_METER_ID` constant to prevent further hardcoding
  - Improved maintainability and consistency of subscription management

- **Authentication Flow**: Removed automatic free plan subscription during signup
  - Users are no longer automatically subscribed to the free plan upon registration
  - All users must now explicitly visit the pricing page to choose and subscribe to any plan
  - Simplified auth callback route by removing subscription logic and helper functions
  - Removed `subscribeToFreePlan` and `subscribeUserToFreePlan` functions from polar-subscription.ts
  - Deleted unused `signup-complete` API route that was only used for automatic subscriptions
  - This ensures intentional plan selection and better conversion tracking
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
- Removed secondary buttons from pricing cards on the pricing page for a cleaner UI.
- Removed all email/password signup and signin functionality. Now only Google login is supported via One Tap on the login page.
- **Migration Simplified:** Removed all triggers and utility functions from `simplified_complete_setup.sql`.
  - Now contains only tables, storage bucket, indexes, and RLS policies.
  - No triggers or custom SQL functions are present.
  - Minimal, clean setup for new projects.

### Fixed

- **Navbar**: Fixed component API usage for `NavItems`, `MobileNav`, `MobileNavToggle`, and `MobileNavMenu`
- **Linter Errors**: Resolved TypeScript linter errors related to component props and imports
- **Component Structure**: Improved component organization and removed redundant code
- **Security Issues Resolved**: Fixed mutable search_path warnings in database functions
  - Added `SECURITY DEFINER SET search_path = public` to `update_updated_at_column()` function
  - Added `SECURITY DEFINER SET search_path = public` to `ensure_single_current_version()` function
  - Functions now follow PostgreSQL security best practices
  - Prevents potential search_path hijacking attacks
  - Applied fixes to both `complete_setup.sql` and `simplified_complete_setup.sql`

### Security

- **Debug Information**: Removed debug console.log statements that could potentially expose sensitive information

## [Unreleased] - Landing Page Revamp

- Refactored hero section: added animated subheading, social proof logos, and a UI mockup illustration.
- Made primary CTA more prominent and added demo/pricing CTAs.
- Moved testimonial section below hero for better social proof.
- Enhanced features section with shadcn/ui Cards and icons.
- Added 'Still have questions?' CTA to FAQ.
- Added subtle entrance animations and improved button/link states.
- Improved mobile responsiveness and accessibility.

## Previous Entries

### [1.0.0] - 2024-01-01

- Initial release with core AI screen generation functionality
- Polar.sh integration for subscription management
- Supabase authentication and database integration
