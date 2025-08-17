# Stripe Checkout Integration Setup

This guide will help you set up Stripe Checkout for your Event Booking System.

## 🚀 **What is Stripe Checkout?**

Stripe Checkout is a pre-built, hosted payment page that provides:
- **Security**: PCI DSS Level 1 certified
- **Simplicity**: No need to handle card details directly
- **Compliance**: Built-in fraud protection and compliance
- **Mobile Optimization**: Responsive design for all devices
- **Multiple Payment Methods**: Cards, digital wallets, and more

## 📋 **Prerequisites**

1. **Stripe Account**: Create an account at [stripe.com](https://stripe.com)
2. **Business Verification**: Complete Stripe's business verification process
3. **Bank Account**: Add a bank account for receiving payments

## 🔑 **Getting Your API Keys**

### **Test Mode (Development)**
1. Log into your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### **Live Mode (Production)**
1. Switch to **Live mode** in your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Copy your **Secret key** (starts with `sk_live_`)

## ⚙️ **Configuration**

### **Option 1: Database Configuration (Recommended)**

1. Go to your admin dashboard
2. Navigate to **Website Settings** → **Payment Gateways**
3. Enable Stripe
4. Enter your API keys:
   - **Publishable Key**: `pk_test_...` or `pk_live_...`
   - **Secret Key**: `sk_test_...` or `sk_live_...`
   - **Webhook Secret**: (We'll set this up next)

### **Option 2: Environment Variables**

Add these to your `.env` file:

```env
STRIPE_ENABLED=true
STRIPE_MODE=test
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔗 **Webhook Setup**

Webhooks notify your system about payment events. Here's how to set them up:

### **1. Create Webhook Endpoint**

In your Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set **Endpoint URL** to: `https://yourdomain.com/api/payment/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### **2. Get Webhook Secret**

1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add this to your configuration

### **3. Test Webhook**

1. In the webhook details, click **Send test webhook**
2. Select `checkout.session.completed`
3. Click **Send test webhook**
4. Check your logs for successful webhook delivery

## 🧪 **Testing**

### **Test Cards**

Use these test card numbers:

| Card Type | Number | Expiry | CVC |
|-----------|--------|---------|-----|
| Visa | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| American Express | 3782 822463 10005 | Any future date | Any 4 digits |

### **Test Scenarios**

1. **Successful Payment**: Use any test card with valid details
2. **Declined Payment**: Use `4000 0000 0000 0002`
3. **Insufficient Funds**: Use `4000 0000 0000 9995`
4. **Expired Card**: Use `4000 0000 0000 0069`

## 💳 **Payment Flow**

Here's how the Stripe Checkout flow works:

```
1. User selects Stripe payment method
2. Frontend calls /api/payment/stripe/create-checkout
3. Backend creates Stripe Checkout Session
4. User is redirected to Stripe Checkout page
5. User enters payment details and completes payment
6. Stripe redirects to success/cancel URL
7. Webhook notifies backend about payment status
8. Backend creates booking and sends confirmation emails
```

## 📧 **Email Notifications**

The system automatically sends emails for:

- **Payment Success**: Confirmation with booking details
- **Payment Failure**: Error details and retry instructions
- **Booking Confirmation**: Ticket and event information
- **Admin Notification**: New booking alert

## 🔒 **Security Features**

- **PCI Compliance**: Stripe handles all card data
- **Fraud Protection**: Built-in Stripe Radar protection
- **Encryption**: All data is encrypted in transit
- **Webhook Verification**: Ensures webhook authenticity

## 🚨 **Common Issues & Solutions**

### **Issue: "Stripe is not configured"**
**Solution**: Check your API keys in the database or environment variables

### **Issue: "Invalid API key"**
**Solution**: Ensure you're using the correct test/live keys

### **Issue: Webhook not receiving events**
**Solution**: 
1. Check webhook endpoint URL
2. Verify webhook secret
3. Check server logs for errors

### **Issue: Payment succeeds but booking not created**
**Solution**: 
1. Check webhook configuration
2. Verify webhook endpoint is accessible
3. Check database connection

## 📱 **Mobile Optimization**

Stripe Checkout is automatically optimized for:
- **iOS Safari**: Apple Pay integration
- **Android Chrome**: Google Pay integration
- **Responsive Design**: Works on all screen sizes

## 💰 **Fees & Pricing**

- **Stripe Fee**: 2.9% + 30¢ per successful transaction
- **No Monthly Fees**: Pay only for successful transactions
- **International Cards**: Additional 1% for international cards
- **Currency Conversion**: 1% for currency conversion

## 🚀 **Going Live**

When ready for production:

1. **Switch to Live Mode**: In Stripe Dashboard
2. **Update API Keys**: Use live publishable and secret keys
3. **Update Webhook URL**: Point to production domain
4. **Test Live Payments**: Use real cards with small amounts
5. **Monitor Transactions**: Use Stripe Dashboard for insights

## 📞 **Support**

- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Community**: [stripe.com/community](https://stripe.com/community)

## 🔄 **Updates & Maintenance**

- **Stripe Updates**: Automatic and backward-compatible
- **Security Patches**: Applied automatically
- **New Features**: Available through API updates
- **Monitoring**: Use Stripe Dashboard for real-time monitoring

---

**Note**: Always test thoroughly in test mode before going live. Stripe provides excellent test tools to simulate various payment scenarios.
