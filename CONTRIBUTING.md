# Contributing to Event Booking System

Thank you for your interest in contributing to the Event Booking System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **💡 Feature Requests**: Suggest new features or improvements
- **📝 Documentation**: Improve our documentation and guides
- **🔧 Code Contributions**: Submit pull requests with code changes
- **🧪 Testing**: Help test new features and report issues
- **💬 Discussions**: Participate in community discussions

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Git** installed and configured
- **PHP 8.3+** with required extensions
- **Composer** for PHP dependencies
- **Node.js 18+** and npm
- **MySQL 8.0+** or MariaDB 10.5+
- **Basic knowledge** of Laravel and React

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/event-booking-system.git
   cd event-booking-system
   ```

3. **Set up the backend**:
   ```bash
   cd event-booking
   composer install
   cp .env.example .env
   # Configure your .env file
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

4. **Set up the frontend**:
   ```bash
   cd event-booking-frontend
   npm install
   npm start
   ```

5. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalusername/event-booking-system.git
   ```

## 📋 Contribution Guidelines

### Code Style

#### PHP (Laravel)
- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards
- Use meaningful variable and function names
- Add proper PHPDoc comments for classes and methods
- Keep functions small and focused
- Use Laravel conventions and best practices

#### TypeScript/React
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for type safety
- Use functional components with hooks
- Keep components small and reusable
- Use proper TypeScript interfaces and types

#### General
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation when needed
- Follow the existing code structure

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(payment): add PayPal integration
fix(webhook): resolve Stripe webhook processing issue
docs(readme): update installation instructions
style(frontend): improve button component styling
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write your code following the style guidelines
- Add tests for new functionality
- Update documentation if needed
- Test your changes locally

### 3. Test Your Changes

#### Backend Testing
```bash
cd event-booking
php artisan test
```

#### Frontend Testing
```bash
cd event-booking-frontend
npm test
```

#### Manual Testing
- Test the feature manually
- Ensure it works with different browsers
- Test on mobile devices
- Verify payment flows work correctly

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat(payment): add new payment gateway integration"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Test results
- Any breaking changes

## 🧪 Testing Guidelines

### Backend Testing

- Write unit tests for new services and models
- Write feature tests for API endpoints
- Test payment gateway integrations
- Verify webhook handling works correctly

### Frontend Testing

- Test components in isolation
- Test user interactions and flows
- Verify responsive design works
- Test payment flows end-to-end

### Payment Testing

- Use test credentials for payment gateways
- Test both success and failure scenarios
- Verify webhook processing works
- Test email notifications

## 📝 Documentation

### What to Document

- New features and their usage
- API endpoints and parameters
- Configuration options
- Troubleshooting guides
- Migration instructions

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up-to-date

## 🐛 Reporting Bugs

### Bug Report Template

When reporting bugs, please include:

1. **Summary**: Brief description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, PHP version, etc.
6. **Screenshots**: If applicable
7. **Additional Context**: Any other relevant information

### Example Bug Report

```
## Bug Report

**Summary**: Payment success page shows "Processing..." indefinitely

**Steps to Reproduce**:
1. Go to event page
2. Select tickets and proceed to payment
3. Complete Stripe payment
4. Redirect to success page

**Expected Behavior**: Should show booking confirmation with real booking ID

**Actual Behavior**: Shows "Processing..." message indefinitely

**Environment**: 
- OS: Windows 10
- Browser: Chrome 120
- PHP: 8.3.13
- Laravel: 12.23.0

**Additional Context**: This happens only with Stripe payments, PayPal works fine.
```

## 💡 Suggesting Features

### Feature Request Template

1. **Summary**: Brief description of the feature
2. **Problem**: What problem does this solve?
3. **Solution**: How should it work?
4. **Alternatives**: Any alternative solutions?
5. **Additional Context**: Screenshots, mockups, etc.

## 🔒 Security

### Security Guidelines

- Never commit sensitive information (API keys, passwords)
- Report security vulnerabilities privately
- Follow secure coding practices
- Validate all user inputs
- Use prepared statements for database queries

### Reporting Security Issues

If you find a security vulnerability, please:
1. **DO NOT** create a public issue
2. **Email** the security team privately
3. **Wait** for acknowledgment before disclosing publicly

## 📞 Getting Help

### Where to Get Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community help
- **Documentation**: Check README.md and inline code comments
- **Code Review**: Ask questions in pull request comments

### Community Guidelines

- Be respectful and helpful
- Use clear, constructive language
- Help others when you can
- Follow the project's code of conduct

## 🎯 Areas for Contribution

### High Priority
- **Payment Gateway Integrations**: Add more payment methods
- **Testing**: Improve test coverage
- **Documentation**: Enhance guides and examples
- **Performance**: Optimize database queries and frontend

### Medium Priority
- **UI/UX Improvements**: Better user experience
- **Mobile App**: React Native version
- **Analytics**: Enhanced reporting features
- **Internationalization**: Multi-language support

### Low Priority
- **Code Refactoring**: Improve code structure
- **Style Improvements**: Better visual design
- **Accessibility**: Improve accessibility features

## 🏆 Recognition

### Contributors

All contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame
- GitHub contributors page

### Types of Recognition

- **Code Contributors**: Direct code contributions
- **Documentation**: Documentation improvements
- **Testing**: Bug reports and testing
- **Community**: Helping other contributors

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Thank You

Thank you for contributing to the Event Booking System! Your contributions help make this project better for everyone.

---

**Happy Coding! 🚀**
