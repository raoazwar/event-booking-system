# 🎫 Event Booking System

A modern, full-stack event booking platform built with Laravel (Backend) and React (Frontend) featuring Stripe and PayPal payment integrations.

## ✨ Features

### 🎯 Core Functionality
- **Event Management**: Create, edit, and manage events with detailed information
- **Ticket Booking**: Secure ticket purchasing with multiple payment gateways
- **User Authentication**: Secure login/registration system with role-based access
- **Admin Dashboard**: Comprehensive analytics and booking management
- **Responsive Design**: Mobile-first design that works on all devices

### 💳 Payment Integration
- **Stripe Checkout**: Modern, secure payment processing
- **PayPal Integration**: Alternative payment method
- **Webhook Handling**: Automated booking confirmation and email notifications
- **Payment Security**: PCI-compliant payment processing

### 📧 Communication
- **Email Notifications**: Automated booking confirmations and updates
- **Admin Alerts**: Real-time notifications for new bookings
- **Customer Support**: Integrated communication system

### 📊 Analytics & Reporting
- **Event Performance**: Track event popularity and revenue
- **User Analytics**: Monitor user engagement and behavior
- **Real-time Stats**: Live dashboard updates
- **Revenue Tracking**: Comprehensive financial reporting

## 🚀 Tech Stack

### Backend
- **Laravel 12** - Modern PHP framework
- **MySQL** - Reliable database system
- **Laravel Sanctum** - API authentication
- **Stripe API** - Payment processing
- **PayPal API** - Alternative payments

### Frontend
- **React 18** - Modern JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **PHP 8.3+** with required extensions
- **Composer** for PHP dependencies
- **Node.js 18+** and npm
- **MySQL 8.0+** or MariaDB 10.5+
- **Git** for version control

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/event-booking-system.git
cd event-booking-system
```

### 2. Backend Setup (Laravel)

```bash
cd event-booking
composer install
cp .env.example .env
```

**Configure your `.env` file:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_booking
DB_USERNAME=your_username
DB_PASSWORD=your_password

STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

**Run migrations and seeders:**
```bash
php artisan migrate
php artisan db:seed
php artisan key:generate
php artisan storage:link
```

**Start the Laravel server:**
```bash
php artisan serve
```

### 3. Frontend Setup (React)

```bash
cd event-booking-frontend
npm install
```

**Start the development server:**
```bash
npm start
```

## 🔑 Payment Gateway Setup

### Stripe Configuration

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the Stripe Dashboard
3. **Configure webhooks** for `checkout.session.completed` events
4. **Add webhook endpoint**: `https://yourdomain.com/api/payment/stripe/webhook`

### PayPal Configuration

1. **Create a PayPal Developer account** at [developer.paypal.com](https://developer.paypal.com)
2. **Get your Client ID and Secret** from the PayPal Dashboard
3. **Configure return URLs** for payment success/failure

## 📁 Project Structure

```
event-booking-system/
├── event-booking/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/     # API Controllers
│   │   ├── Models/               # Eloquent Models
│   │   ├── Services/             # Business Logic Services
│   │   └── Mail/                 # Email Templates
│   ├── database/
│   │   ├── migrations/           # Database Schema
│   │   └── seeders/              # Sample Data
│   ├── routes/
│   │   └── api.php               # API Routes
│   └── resources/views/          # Blade Templates
├── event-booking-frontend/        # React Frontend
│   ├── src/
│   │   ├── components/           # React Components
│   │   ├── pages/                # Page Components
│   │   ├── contexts/             # React Contexts
│   │   ├── services/             # API Services
│   │   └── types/                # TypeScript Types
│   └── public/                   # Static Assets
└── README.md                     # This File
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
- Database configuration
- Payment gateway credentials
- Mail server settings
- Application keys

**Frontend:**
- API endpoint URLs
- Feature flags
- Environment-specific settings

### Database Configuration

The system uses MySQL with the following main tables:
- `users` - User accounts and authentication
- `events` - Event information and details
- `bookings` - Ticket bookings and payments
- `website_settings` - System configuration
- `ticket_types` - Different ticket categories

## 🚀 Deployment

### Production Requirements

- **HTTPS enabled** (required for Stripe webhooks)
- **Public domain** accessible from the internet
- **Database optimization** for production load
- **Environment variables** properly configured
- **Webhook endpoints** updated for production URLs

### Deployment Steps

1. **Set up production server** with required software
2. **Configure environment variables** for production
3. **Update webhook URLs** in payment gateway dashboards
4. **Run database migrations** on production
5. **Build and deploy** frontend assets
6. **Test payment flows** in production environment

## 🧪 Testing

### Backend Testing

```bash
cd event-booking
php artisan test
```

### Frontend Testing

```bash
cd event-booking-frontend
npm test
```

### Payment Testing

- **Stripe**: Use test cards from [Stripe Testing](https://stripe.com/docs/testing)
- **PayPal**: Use sandbox accounts for testing
- **Webhooks**: Test with Stripe CLI or ngrok for local development

## 📚 API Documentation

### Authentication

All protected endpoints require a Bearer token:
```bash
Authorization: Bearer {your_token}
```

### Key Endpoints

- `POST /api/login` - User authentication
- `GET /api/events` - List all events
- `POST /api/bookings` - Create new booking
- `POST /api/payment/stripe/create-checkout` - Stripe payment
- `POST /api/payment/paypal/create-order` - PayPal payment

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🙏 Acknowledgments

- **Laravel Team** for the amazing PHP framework
- **React Team** for the powerful frontend library
- **Stripe** for secure payment processing
- **PayPal** for alternative payment options
- **Tailwind CSS** for the utility-first CSS framework

## 📈 Roadmap

### Upcoming Features
- [ ] **Multi-language support**
- [ ] **Advanced analytics dashboard**
- [ ] **Mobile app development**
- [ ] **Social media integration**
- [ ] **Advanced reporting tools**
- [ ] **API rate limiting**
- [ ] **Caching optimization**

### Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Payment gateway integrations
- **v1.2.0** - Admin dashboard and analytics
- **v1.3.0** - Email notifications and webhooks

---

**Built with ❤️ by the Event Booking System Team**

*For questions and support, please open an issue on GitHub.*
