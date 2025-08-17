# Admin Dashboard - Event Management System

## 🎯 Overview

The EventHub Admin Dashboard is a comprehensive management interface built with React, TypeScript, and shadcn/ui components. It provides administrators with complete control over events, users, bookings, and system analytics.

## ✨ Features

### 🏠 Dashboard Overview
- **Real-time Statistics**: Total events, users, bookings, and revenue
- **Performance Metrics**: Monthly revenue trends and top-performing events
- **Recent Activity**: Latest bookings and system updates
- **Quick Actions**: Fast access to common administrative tasks

### 📅 Event Management
- **Create Events**: Full event creation form with validation
- **Edit Events**: Modify existing event details
- **Event Status**: Draft, published, and cancelled states
- **Search & Filter**: Find events by title, description, or venue
- **Bulk Operations**: Manage multiple events efficiently

### 👥 User Management
- **User Overview**: View all registered users
- **Role Management**: Admin and user role assignments
- **User Analytics**: Booking history and activity metrics
- **Search & Filter**: Find users by name or email

### 🎫 Booking Management
- **Booking Overview**: Monitor all event bookings
- **Status Tracking**: Pending, confirmed, and cancelled bookings
- **Payment Status**: Track payment completion
- **Customer Details**: View booking customer information

### 📊 Analytics & Reporting
- **Revenue Analytics**: Monthly and yearly revenue trends
- **Event Performance**: Top-performing events by bookings and revenue
- **User Engagement**: User activity and booking patterns
- **System Metrics**: Overall platform performance indicators

## 🎨 Design System

### Dark Mode Support
- **Automatic Detection**: Respects system preference
- **Manual Toggle**: Theme toggle button in navigation
- **Persistent Storage**: Remembers user preference
- **Smooth Transitions**: Elegant theme switching

### shadcn/ui Components
- **Modern UI**: Clean, accessible component library
- **Consistent Design**: Unified visual language
- **Responsive Layout**: Works on all device sizes
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- React 18+
- TypeScript 4.9+

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Required Dependencies
```json
{
  "@radix-ui/react-slot": "^1.0.0",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^1.0.0",
  "@radix-ui/react-select": "^1.0.0",
  "@radix-ui/react-tabs": "^1.0.0",
  "@radix-ui/react-toast": "^1.0.0",
  "@radix-ui/react-tooltip": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "tailwind-merge": "^2.0.0",
  "clsx": "^2.0.0"
}
```

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── badge.tsx
│   ├── EventForm.tsx         # Event creation/editing
│   ├── EventManagement.tsx   # Event listing and management
│   ├── UserManagement.tsx    # User management interface
│   ├── BookingManagement.tsx # Booking management interface
│   └── ThemeToggle.tsx       # Dark mode toggle
├── contexts/
│   └── ThemeContext.tsx      # Theme state management
├── pages/
│   └── Dashboard.tsx         # Main dashboard with tabs
└── lib/
    └── utils.ts              # Utility functions
```

### State Management
- **React Context**: Theme and authentication state
- **Local State**: Component-specific state management
- **API Integration**: RESTful API calls for data operations

## 🎯 Usage Guide

### Accessing the Dashboard
1. Login with admin credentials
2. Navigate to `/dashboard` route
3. Use the tab navigation to switch between sections

### Creating Events
1. Go to Events tab
2. Click "Create Event" button
3. Fill in event details
4. Set status (draft/published)
5. Save event

### Managing Users
1. Go to Users tab
2. View user list with search/filter
3. Click on user for detailed view
4. Monitor user activity and bookings

### Monitoring Bookings
1. Go to Bookings tab
2. View all bookings with status filters
3. Click on booking for detailed information
4. Track payment and confirmation status

## 🔧 Configuration

### Theme Configuration
```typescript
// src/contexts/ThemeContext.tsx
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  // Theme switching logic
};
```

### API Configuration
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8000/api';
// API endpoints for dashboard operations
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system color variables
      }
    }
  }
}
```

## 🎨 Customization

### Color Scheme
- Modify CSS variables in `src/index.css`
- Update Tailwind config for custom colors
- Maintain contrast ratios for accessibility

### Component Styling
- Override shadcn/ui component styles
- Use Tailwind utility classes
- Maintain design system consistency

### Layout Modifications
- Adjust grid layouts in dashboard sections
- Modify card layouts and spacing
- Customize responsive breakpoints

## 📱 Responsive Design

### Mobile Optimization
- Touch-friendly interface elements
- Responsive grid layouts
- Mobile-first navigation design

### Tablet Support
- Optimized layouts for medium screens
- Touch and mouse interaction support
- Adaptive component sizing

### Desktop Experience
- Full-featured interface
- Keyboard shortcuts support
- Multi-column layouts

## 🔒 Security Features

### Authentication
- Protected admin routes
- Role-based access control
- Secure API communication

### Data Validation
- Form input validation
- API response validation
- Error handling and user feedback

## 🧪 Testing

### Component Testing
```bash
# Run component tests
npm test

# Run with coverage
npm test -- --coverage
```

### Integration Testing
- API integration testing
- User flow testing
- Cross-browser compatibility

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Environment configuration
REACT_APP_API_URL=https://api.eventhub.com
```

### Performance Optimization
- Code splitting and lazy loading
- Optimized bundle size
- CDN integration for assets

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Performance monitoring

### Technical Improvements
- [ ] React Query integration
- [ ] WebSocket support
- [ ] Progressive Web App
- [ ] Offline support
- [ ] Advanced caching

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use shadcn/ui component patterns
3. Maintain accessibility standards
4. Write comprehensive tests
5. Document new features

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component prop interfaces

## 📚 Resources

### Documentation
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

### Design System
- [Material Design](https://material.io/design)
- [Ant Design](https://ant.design/)
- [Chakra UI](https://chakra-ui.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation
- Review existing issues
- Create detailed bug reports
- Provide reproduction steps

### Community
- Join our Discord server
- Follow development updates
- Contribute to the project
- Share feedback and suggestions

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
