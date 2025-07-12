# Mobile App UI/UX Design Generator - Todo List

## 🚀 Core Features Implementation

### 1. User Interface & Experience
- [x] **Prompt Input Component** ✅ **COMPLETED**
  - [x] Create a beautiful, responsive prompt input form
  - [x] Add character limit and validation
  - [x] Include example prompts for guidance
  - [x] Add loading states during generation
  - [x] Implement auto-save draft functionality

- [ ] **Generated UI Display** ✅ **React Flow + iframe already implemented**
  - [x] Create a responsive grid layout for multiple screens (React Flow)
  - [x] Add preview/thumbnail view for each generated screen (iframe in nodes)
  - [ ] Implement full-screen preview modal
  - [ ] Add download functionality (PNG, SVG, HTML)
  - [ ] Include copy-to-clipboard for HTML code

### 1.1 **React Flow Implementation - Current Status**
- [x] **Custom Mobile UI Node**: iframe rendering with device frame
- [x] **Node Positioning**: Automatic layout with proper spacing
- [x] **Edge Connections**: Smooth animated connections between screens
- [x] **Responsive Design**: 414px × 896px iPhone dimensions
- [x] **Sandbox Security**: iframe with proper sandbox attributes
- [ ] **Dynamic Data Loading**: Connect to Supabase instead of static JSON
- [ ] **Node Interactions**: Click to open full-screen modal
- [ ] **Node Customization**: Different device frames (iPhone, Android, etc.)
- [ ] **Zoom and Pan**: Enhanced navigation controls

### 2. AI Integration
- [ ] **Vercel AI SDK Setup**
  - [ ] Configure OpenAI/Claude API integration
  - [ ] Create AI route handler for prompt processing
  - [ ] Implement streaming responses for better UX
  - [ ] Add error handling and retry mechanisms
  - [ ] Set up rate limiting and usage tracking

- [ ] **Prompt Engineering**
  - [ ] Design effective prompts for mobile UI generation
  - [ ] Include mobile-specific design guidelines
  - [ ] Add support for different mobile platforms (iOS/Android)
  - [ ] Implement prompt templates for common app types

### 3. Database & Storage
- [ ] **Supabase Setup**
  - [ ] Set up Supabase project and configure environment
  - [ ] Design database schema for users, projects, and screens
  - [ ] Create tables: users, projects, screens, metadata
  - [ ] Set up Row Level Security (RLS) policies
  - [ ] Configure storage buckets for HTML files

- [ ] **Data Models with Simple Versioning**
  ```sql
  -- Users table
  users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    name text,
    created_at timestamp with time zone default now(),
    subscription_plan text default 'free', -- 'free', 'standard', 'pro'
    subscription_status text default 'active', -- 'active', 'cancelled', 'past_due'
    subscription_end_date timestamp with time zone,
    updated_at timestamp with time zone default now()
  );

  -- Projects table
  projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    name text not null,
    description text,
    prompt text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    is_archived boolean default false
  );

  -- Screens table
  screens (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete cascade,
    name text not null,
    order_index integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    is_active boolean default true
  );

  -- Screen Versions table (parent-child versioning)
  screen_versions (
    id uuid primary key default gen_random_uuid(),
    screen_id uuid references screens(id) on delete cascade,
    version_number integer not null,
    user_prompt text, -- what the user asked for
    ai_prompt text, -- what was sent to AI
    html_file_path text not null, -- path in Supabase Storage (includes inline Tailwind)
    created_at timestamp with time zone default now(),
    created_by uuid references users(id),
    parent_version_id uuid references screen_versions(id), -- for version tree
    is_current boolean default false, -- latest version
    generation_time_ms integer -- how long AI took to generate
  );

  -- Subscriptions table (for payment tracking)
  subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    plan_type text not null, -- 'standard', 'pro'
    billing_cycle text not null, -- 'monthly', 'yearly'
    amount_paid decimal(10,2) not null,
    status text not null, -- 'active', 'cancelled', 'past_due'
    start_date timestamp with time zone default now(),
    end_date timestamp with time zone,
    dodo_payment_id text, -- reference to Dodo Payments
    created_at timestamp with time zone default now()
  );

  -- Credit usage tracking table
  credit_usage (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    usage_month text not null, -- 'YYYY-MM' format for easy querying
    monthly_creations_used integer default 0,
    monthly_edits_used integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, usage_month)
  );

  ```

  **Indexes for Performance:**
  ```sql
  -- Performance indexes
  CREATE INDEX idx_screens_project_id ON screens(project_id);
  CREATE INDEX idx_screen_versions_screen_id ON screen_versions(screen_id);
  CREATE INDEX idx_screen_versions_is_current ON screen_versions(is_current);
  CREATE INDEX idx_screen_versions_parent_id ON screen_versions(parent_version_id);
  CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
  CREATE INDEX idx_subscriptions_status ON subscriptions(status);
  CREATE INDEX idx_credit_usage_user_month ON credit_usage(user_id, usage_month);
  ```

### 3.1 **Simple Version Control Features**

**Core Concepts:**
- **Projects** = Collections of screens
- **Screens** = Individual UI screens (home page, login, etc.)
- **Screen Versions** = Each AI generation creates a new version
- **Parent-Child Relationship** = Each version can have a parent version

**Version Control Workflow:**
1. **Initial Generation**: User creates first version of a screen
2. **AI Edit Request**: User asks AI to modify the screen
3. **New Version Creation**: AI generates new HTML, stored as child version
4. **Version Tree**: Each screen maintains a tree of versions

**Key Features:**
- **Version Tree**: Parent-child relationships between versions
- **Prompt History**: Track what user asked for each version
- **AI Prompt Tracking**: Store what was sent to AI for debugging
- **File Storage**: HTML files with inline Tailwind CSS in Supabase Storage
- **Generation Metrics**: Track AI generation time
- **Current Version**: Always know which version is active

### 4. User Management
- [ ] **Supabase Auth Setup**
  - [ ] Install and configure @supabase/supabase-js
  - [ ] Set up Supabase client configuration
  - [ ] Create auth context provider for React
  - [ ] Implement email/password authentication
  - [ ] Add social login providers (Google, GitHub)
  - [ ] Set up email verification and password reset
  - [ ] Create protected route middleware
  - [ ] Add session management and persistence

- [ ] **User Dashboard**
  - [ ] Create project management interface
  - [ ] Add project history and search
  - [ ] Implement project sharing functionality
  - [ ] Add user preferences and settings

### 5. Payment Integration
- [ ] **Dodo Payments Setup**
  - [ ] Research Dodo Payments API documentation
  - [ ] Set up merchant account and API keys
  - [ ] Create payment plans and pricing tiers
  - [ ] Implement webhook handling for payment events

- [ ] **Subscription Management**
  - [ ] Implement Free/Standard/Pro plan limits (1 credit for Free, 200 credits for Standard, 500 credits for Pro)
  - [ ] Track monthly credit usage and reset counters
  - [ ] Handle yearly billing with $5 discount
  - [ ] Add usage tracking and limits enforcement (credit-based)
  - [ ] Create upgrade/downgrade flow
  - [ ] Handle subscription cancellations and renewals

## 🔧 Technical Implementation

### 6. Backend & API
- [ ] **API Routes**
  - [ ] `/api/generate` - AI generation endpoint
  - [ ] `/api/projects` - CRUD for projects
  - [ ] `/api/screens` - CRUD for screens
  - [ ] `/api/payments` - Payment processing
  - [ ] `/api/webhooks` - Payment webhooks

- [ ] **Middleware & Security**
  - [ ] Implement authentication middleware
  - [ ] Add rate limiting
  - [ ] Set up CORS configuration
  - [ ] Add input validation with Zod

### 7. Frontend Components
- [ ] **UI Components**
  - [ ] PromptInput component with validation
  - [ ] ScreenGrid component for displaying results
  - [ ] ScreenPreview modal component
  - [ ] ProjectCard component
  - [ ] PaymentForm component
  - [ ] UserProfile component

- [ ] **State Management**
  - [ ] Set up React Context for global state
  - [ ] Implement optimistic updates
  - [ ] Add error boundaries
  - [ ] Create loading states and skeletons

### 8. File Management
- [ ] **HTML Storage with Inline Tailwind**
  - [ ] Store generated HTML files in Supabase Storage
  - [ ] Ensure AI generates complete HTML with inline Tailwind CSS
  - [ ] Implement file versioning with proper naming
  - [ ] Add file compression and optimization
  - [ ] Create backup and recovery system

### 📁 **File Storage Structure:**
```
supabase-storage/
├── projects/
│   └── {project_id}/
│       └── screens/
│           └── {screen_id}/
│               ├── v1/
│               │   └── index.html (with inline Tailwind CSS)
│               ├── v2/
│               │   └── index.html (with inline Tailwind CSS)
│               └── v3/
│                   └── index.html (with inline Tailwind CSS)
```

### 8.1 **Simple Version Control Implementation**
- [ ] **Database Setup**
  - [ ] Create simplified version control tables in Supabase
  - [ ] Set up Row Level Security (RLS) policies
  - [ ] Create database triggers for automatic version numbering
  - [ ] Set up Supabase Storage buckets for HTML files (with inline Tailwind)

- [ ] **Version Control API**
  - [ ] `/api/screens/[id]/versions` - Get version tree for a screen
  - [ ] `/api/screens/[id]/versions/[version]` - Get specific version
  - [ ] `/api/screens/[id]/generate` - Create new version from AI
  - [ ] `/api/screens/[id]/current` - Get current active version

- [ ] **Version Control UI Components**
  - [ ] VersionTree component - Show version hierarchy
  - [ ] VersionHistory component - Show version timeline
  - [ ] PromptHistory component - Show what user asked for each version
  - [ ] VersionComparison component - Compare two versions side-by-side



## 📋 Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Dodo Payments
DODO_MERCHANT_ID=
DODO_API_KEY=
DODO_WEBHOOK_SECRET=
```

## ✅ **Confirmed Requirements**

### 🤖 **AI Model Configuration**
- **Primary Model**: OpenAI GPT-4o-mini (configurable for easy model switching)
- **Architecture**: Modular AI provider system to support multiple models
- **Fallback**: Ability to switch models without code changes

### 💰 **Pricing Model - Monthly Subscription**

**Free Plan:**
- 1 credit per month
- Basic features only

**Standard Plan: $29/month**
- 200 credits per month
- All features included

**Pro Plan: $39/month**
- 500 credits per month
- All features included
- Priority support

**Yearly Discount:**
- $5 off all plans when billed annually
- Free: $0/year
- Standard: $288/year (instead of $348)
- Pro: $408/year (instead of $468)


### 🎯 **Design Focus**
- **Platform**: Platform-agnostic mobile designs
- **HTML Output**: Complete HTML with inline Tailwind CSS
- **User Base**: Individual users (no team collaboration needed)
- **Export**: HTML format only (other formats in optional todos)