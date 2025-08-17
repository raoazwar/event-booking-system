# Payment Gateway Setup Guide

This guide explains how to set up payment gateways for the Event Booking System.

## PayPal Setup

### 1. Get PayPal API Credentials

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Navigate to "Apps & Credentials"
4. Create a new app or use an existing one
5. Copy the Client ID and Client Secret

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# PayPal Configuration
PAYPAL_ENABLED=true
PAYPAL_MODE=live  # or 'sandbox' for testing
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_WEBHOOK_ID=your_webhook_id_here
PAYPAL_IPN_URL=http://yourdomain.com/donation-successful/?type=notify&gateway=paypal
```

### 3. Test Credentials

For testing, you can use these sandbox credentials:
- API Username: webinaneff_api1.gmail.com
- API Password: PTRHG9VDPFKFSLBE  
- API Signature: AFcWxV21C7fd0v3bYYYRCpSSRl31AS0h.TMhuVqnBknr2gp9SxwLQjC-

## How It Works

### 1. Payment Flow

1. User selects PayPal as payment method
2. System creates a PayPal order via API
3. User is redirected to PayPal for payment
4. After payment, user is redirected back to success/cancel page
5. System captures the payment and creates booking

### 2. API Endpoints

- `POST /api/payment/paypal/create-order` - Creates PayPal order
- `POST /api/payment/paypal/capture-order` - Captures payment
- `GET /api/payment/gateways` - Lists available payment gateways
- `GET /payment/success` - Payment success page
- `GET /payment/cancel` - Payment cancel page

### 3. Frontend Integration

The frontend automatically:
- Loads available payment gateways from API
- Shows only enabled payment methods
- Handles PayPal redirects
- Displays success/error messages

## Testing

### 1. Sandbox Mode

1. Set `PAYPAL_MODE=sandbox` in `.env`
2. Use sandbox credentials
3. Test with PayPal sandbox accounts

### 2. Live Mode

1. Set `PAYPAL_MODE=live` in `.env`
2. Use live credentials
3. Test with real PayPal accounts

## Error Handling

The system includes comprehensive error handling:
- API authentication failures
- Payment processing errors
- Network timeouts
- Invalid payment data

All errors are logged and user-friendly messages are displayed.

## Security

- API credentials are stored in environment variables
- HTTPS is required for live payments
- Input validation on all payment endpoints
- CSRF protection enabled

## Next Steps

1. Set up Stripe integration
2. Add webhook handling for payment notifications
3. Implement payment retry logic
4. Add payment analytics and reporting
