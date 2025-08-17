import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AnimatedContainer } from '../components/ui/animated-container';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Easy Event Management",
      description: "Create and manage events with our intuitive dashboard",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Location Services",
      description: "Integrated maps and location-based features",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Guest Management",
      description: "Track RSVPs and manage attendee lists",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Premium Experience",
      description: "Professional-grade event management tools",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const stats = [
    { label: "Events Created", value: "500+", icon: <Calendar className="h-5 w-5" /> },
    { label: "Happy Users", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Countries", value: "25+", icon: <Globe className="h-5 w-5" /> },
    { label: "Success Rate", value: "99%", icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <AnimatedContainer animation="fadeIn" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedContainer animation="slideDown" delay={200}>
              <Badge variant="glass" className="mb-6 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Professional Event Management Platform
              </Badge>
            </AnimatedContainer>
            
            <AnimatedContainer animation="slideUp" delay={400}>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Create Unforgettable
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
            </AnimatedContainer>
            
            <AnimatedContainer animation="slideUp" delay={600}>
              <p className="max-w-3xl mx-auto mt-6 text-lg text-muted-foreground sm:text-xl">
                Streamline your event planning process with our comprehensive platform. 
                From creation to execution, we've got you covered.
              </p>
            </AnimatedContainer>
            
            <AnimatedContainer animation="slideUp" delay={800} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button size="xl" variant="gradient" className="group">
                <span className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button size="xl" variant="outline" className="group">
                <span className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Learn More
                </span>
              </Button>
            </AnimatedContainer>
          </div>
        </div>
      </AnimatedContainer>

      {/* Stats Section */}
      <AnimatedContainer animation="slideUp" delay={1000} className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${1200 + index * 100}ms` }}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                <div className="text-primary group-hover:text-secondary transition-colors duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </AnimatedContainer>

      {/* Features Section */}
      <AnimatedContainer animation="slideUp" delay={1400} className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to make event management effortless
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="elevated"
              hover
              className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${1600 + index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedContainer>

      {/* CTA Section */}
      <AnimatedContainer animation="fadeIn" delay={2000} className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card variant="glass" className="text-center border-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">
              Ready to get started?
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Join thousands of event organizers who trust our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient" className="group">
              <Link to="/events" className="flex items-center">
                <span className="flex items-center">
                  Browse Events
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group">
              <Link to="/register" className="flex items-center">
                <span className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
};

export default Home;
