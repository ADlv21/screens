# Polar Integration Test Flow

## Complete Flow Test: Subscription → Credit Granting → Generation → Credit Deduction

### 🚀 Test Scenario 1: New User Subscription Flow

#### Step 1: User without subscription tries to generate
1. Navigate to dashboard while logged in
2. Try to submit a prompt in the PromptInput component
3. **Expected Result**: 
   - Error message: "No active subscription found. Please subscribe to generate screens."
   - "Subscribe Now" button appears
   - Credit count shows as 0 or null

#### Step 2: User subscribes to Standard Plan
1. Click "Subscribe Now" button
2. Redirected to `/api/checkout?product_id=410368fd-96de-4dfb-9640-a9ada2eac149`
3. Complete checkout process in Polar
4. **Expected Result**:
   - Redirected back to dashboard with `checkout_success=true`
   - Webhook receives subscription.created event
   - Customer gets 200 credits automatically via Polar meter benefits

#### Step 3: User generates first screen
1. Submit a prompt: "Create a modern login screen"
2. **Expected Result**:
   - Generation succeeds
   - Credits remaining: 199 (200 - 1)
   - New project appears in dashboard
   - Screen appears in project flow

### 🔄 Test Scenario 2: Credit Depletion & Upgrade Flow

#### Step 1: Simulate low credits
1. Use customer portal to view current subscription
2. Generate screens until credits approach 0
3. **Expected Result**:
   - Dashboard shows accurate credit count
   - Warning appears when credits are low

#### Step 2: User hits credit limit
1. Try to generate when credits = 0
2. **Expected Result**:
   - Error: "Insufficient credits. You have 0 credits remaining."
   - "Upgrade Plan" button appears with Pro Plan checkout URL

#### Step 3: User upgrades to Pro Plan  
1. Click "Upgrade Plan" button
2. Complete upgrade checkout
3. **Expected Result**:
   - Webhook receives subscription.updated event
   - Credits reset to 500 (Pro Plan allocation)
   - User can generate again

### 🛠️ Test Scenario 3: Subscription Management

#### Step 1: Access Customer Portal
1. Click "Manage Subscription" button
2. **Expected Result**:
   - Redirected to Polar customer portal
   - Can view subscription details, invoices, etc.

#### Step 2: Subscription Cancellation
1. Cancel subscription in customer portal
2. **Expected Result**:
   - Webhook receives subscription.canceled event
   - Database subscription status updated to 'canceled'
   - User retains current credits until period end

#### Step 3: Subscription Reactivation
1. Subscribe again through checkout flow
2. **Expected Result**:
   - New subscription created
   - Credits granted based on new plan

## 🧪 Manual Testing Checklist

### Dashboard Integration
- [ ] Subscription status card displays correctly
- [ ] Credit count updates after generation
- [ ] Upgrade buttons appear when appropriate
- [ ] Customer portal link works
- [ ] Error messages show upgrade options

### Generation Flow
- [ ] Credit check before generation
- [ ] Generation succeeds with sufficient credits
- [ ] Generation fails with insufficient credits
- [ ] Upgrade URL provided on failure
- [ ] Credit deduction after successful generation

### API Routes
- [ ] `/api/checkout` creates checkout sessions
- [ ] `/api/customer-portal` redirects to portal
- [ ] `/api/polar/webhooks` processes events correctly
- [ ] Webhook updates database subscription status

### Error Handling
- [ ] Graceful handling of Polar API failures
- [ ] Fallback behavior when customer doesn't exist
- [ ] Clear error messages for users
- [ ] Non-blocking event tracking failures

## 🔍 Debug Information

### Useful Polar Dashboard URLs (Sandbox)
- **Organization**: https://sandbox.polar.sh/dashboard
- **Products**: https://sandbox.polar.sh/dashboard/products
- **Customers**: https://sandbox.polar.sh/dashboard/customers
- **Subscriptions**: https://sandbox.polar.sh/dashboard/subscriptions
- **Webhooks**: https://sandbox.polar.sh/dashboard/webhooks

### Key Product IDs
- **Standard Plan**: `410368fd-96de-4dfb-9640-a9ada2eac149` ($19/month, 200 credits) 
- **Pro Plan**: `3dfaf594-130c-45ac-a39e-0070ebe26124` ($39/month, 500 credits)
- **Free Plan**: `9f296fe6-8435-4fcd-9ec7-2b17b648c23b` (Free, no credits)

### Webhook Events to Monitor
- `subscription.created` - New subscription
- `subscription.updated` - Plan changes
- `subscription.canceled` - Cancellation
- `customer.state_changed` - Credit updates
- `benefit_grant.created` - Credit grants
- `benefit_grant.cycled` - Monthly renewals

## 📊 Success Metrics

A successful test should demonstrate:

1. **Credit System Works**:
   - Credits check before generation ✅
   - Credits deducted after generation ✅
   - Accurate credit balance display ✅

2. **Subscription Flow Works**:
   - Checkout process completes ✅
   - Webhooks update database ✅
   - Customer portal accessible ✅

3. **Upgrade Flow Works**:
   - Insufficient credits blocked ✅
   - Upgrade URLs generated ✅
   - Plan changes update credits ✅

4. **User Experience**:
   - Clear status information ✅
   - Intuitive upgrade process ✅
   - Graceful error handling ✅

## 🚨 Common Issues & Solutions

### "Customer not found" Error
- **Cause**: User hasn't subscribed yet
- **Solution**: Redirect to checkout with clear messaging

### Credits not updating
- **Cause**: Webhook not processing or meter misconfigured  
- **Solution**: Check webhook logs and meter settings in Polar dashboard

### Checkout not redirecting
- **Cause**: Success URL misconfigured
- **Solution**: Verify `NEXT_PUBLIC_SITE_URL` environment variable

### Database sync issues
- **Cause**: Webhook processing errors
- **Solution**: Check webhook handler logs and database constraints 