# Polar.sh Integration Guide

## Overview

This guide explains how to integrate Polar.sh as our **primary credit system**, replacing database credit tracking. This is a **simplified approach**:

- **Polar Credits**: Native credit system handling billing, granting, and deduction
- **Database**: Only stores user/project data, no credit tracking
- **Single Source of Truth**: All credits managed by Polar

## Benefits of Pure Polar Credits

### ✅ Advantages
- **Single source of truth** - No sync issues between database and Polar
- **Automatic credit granting** - Credits added when subscriptions renew
- **Built-in billing logic** - Overage charges, proration handled automatically
- **Comprehensive analytics** - Usage insights built-in
- **Simplified database** - Remove `credit_usage` table and functions
- **Global tax compliance** - Polar handles taxes as Merchant of Record

### ⚠️ Trade-offs
- **API dependency** - Credit checks require Polar API call (~100-200ms)
- **External dependency** - Reliant on Polar's uptime
- **Less real-time** - Slight latency vs database lookups

## Polar Product Configuration

### Standard Plan ($29/month)
```yaml
Product Name: Standard Plan
Type: Subscription
Interval: Monthly
Price: $29 USD
Benefits:
  - Credits Benefit: 200 credits per month
```

### Pro Plan ($39/month)  
```yaml
Product Name: Pro Plan
Type: Subscription
Interval: Monthly
Price: $39 USD
Benefits:
  - Credits Benefit: 500 credits per month
```

## Polar Credit Meter Setup

### Screen Generation Meter
```yaml
Name: screen_generation_meter
Description: Track screen generations for credit deduction
Filter:
  - name equals "screen_generation"
Aggregation: Count
```

**This meter automatically:**
- Deducts credits when events are sent
- Tracks usage over time
- Provides balance via Customer State API

## Database Changes

### Run Migration 004
```sql
-- Removes credit_usage table and functions
-- Adds polar_config table for settings
-- Cleans up policies and triggers
```

### Simplified Schema
```sql
-- REMOVED (Polar handles these):
❌ credit_usage table
❌ get_user_current_credits() function  
❌ can_user_use_credits() function
❌ increment_user_credits_used() function

-- KEPT (Still needed):
✅ users table (basic info + subscription_plan)
✅ subscriptions table (with polar_subscription_id)
✅ projects, screens, screen_versions tables
✅ polar_config table (settings)
```

## Implementation Flow

### 1. Credit Check (Before Generation)
```typescript
// Check credit balance via Polar API
const customerState = await polar.customers.getState({
    external_id: userId
});

const creditMeter = customerState.meters?.find(
    meter => meter.name === 'screen_generation_meter'
);

const creditsLeft = creditMeter?.balance || 0;

if (creditsLeft <= 0) {
    // Generate checkout URL for upgrade
    const checkout = await polar.checkout.create({
        product_id: 'standard_product_id',
        customer_email: user.email,
        external_customer_id: userId
    });
    
    return {
        error: "Insufficient credits",
        upgradeUrl: checkout.url
    };
}
```

### 2. Usage Tracking (After Generation)
```typescript
// Send usage event (auto-deducts credits)
await polar.events.create({
    name: 'screen_generation',
    external_customer_id: userId,
    metadata: {
        project_id: finalProjectId,
        screen_id: screenId,
        credits_used: 1,
        component_name: llmResult.component.name
    }
});
```

### 3. Updated Balance (For UI)
```typescript
// Get updated balance for user display
const updatedState = await polar.customers.getState({
    external_id: userId
});
const creditsRemaining = updatedState.meters
    ?.find(m => m.name === 'screen_generation_meter')?.balance || 0;
```

## Setup Steps

### 1. Polar Dashboard Setup
1. Create Polar account and organization
2. Create Standard and Pro products with credit benefits
3. Set up screen_generation_meter
4. Get API tokens and webhook secrets

### 2. Environment Variables
```env
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=https://yourdomain.com
```

### 3. Install SDK
```bash
pnpm install @polar-sh/nextjs zod
```

### 4. Run Database Migration
```bash
# Apply migration 004 to simplify schema
psql -f docs/migrations/004_simplify_with_polar_credits.sql
```

### 5. Update Code
- Replace `src/lib/actions/generate-ui.ts` with polar version
- Update components to handle `upgradeUrl` in responses
- Remove database credit checking code

## Error Handling

### API Failures
```typescript
try {
    const customerState = await polar.customers.getState({
        external_id: userId
    });
    // ... credit check logic
} catch (polarError) {
    console.error('Polar API failed:', polarError);
    
    // Options:
    // 1. Fail gracefully: allow generation, log error
    // 2. Fallback: use cached credit balance
    // 3. Block usage: return error to user
}
```

### Best Practices
- **Cache credit balances** for 1-2 minutes to reduce API calls
- **Graceful degradation** if Polar API is down
- **Monitor API latency** and set reasonable timeouts
- **Log all failures** for debugging

## Migration from Current System

### Before Migration
1. **Export current credit data** for reference
2. **Ensure Polar products match** your current pricing
3. **Test Polar integration** in sandbox environment
4. **Set up monitoring** for API calls and errors

### During Migration
1. **Run migration 004** to clean up database
2. **Update application code** to use Polar APIs
3. **Migrate existing subscribers** to Polar products
4. **Grant appropriate credits** to existing users

### After Migration
1. **Monitor credit balances** match expectations
2. **Verify billing cycles** work correctly
3. **Check analytics** and usage tracking
4. **Remove old database functions** completely

This approach **eliminates complexity** while leveraging Polar's robust billing infrastructure! 🚀 