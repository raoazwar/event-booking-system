import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Calendar, Home, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AnimatedContainer } from './ui/animated-container';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    ...(user?.role === 'admin' ? [
      { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
      { path: '/users', label: 'Users', icon: <Users className="h-4 w-4" /> }
    ] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <AnimatedContainer animation="slideRight" className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:block">EventHub</span>
            </Link>
          </AnimatedContainer>

          {/* Desktop Navigation */}
          <AnimatedContainer animation="slideDown" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </AnimatedContainer>

          {/* Right Side */}
          <AnimatedContainer animation="slideLeft" className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 hover:bg-muted/50 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              ) : (
                <div className="w-4 h-4 bg-slate-800 rounded-full animate-pulse" />
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{user.name}</span>
                </Badge>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-9 h-9 p-0"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
                    ) : (
                      <Menu className="h-5 w-5 transition-transform duration-200" />
                    )}
                  </Button>

                  {/* Desktop User Dropdown */}
                  <div className="hidden md:block relative group">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors duration-200"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          My Bookings
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:block">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </AnimatedContainer>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatedContainer
        animation={isMobileMenuOpen ? 'slideDown' : 'slideUp'}
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-96 opacity-100 visible'
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                isActiveRoute(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          {user && (
            <>
              <div className="border-t border-border/50 my-2" />
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <Calendar className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-3 px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </AnimatedContainer>
    </nav>
  );
};

export default Navbar;
