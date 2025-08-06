import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Star, Users, BarChart3 } from 'lucide-react';

// Replace with any dummy cricket image URL
const dummyCricketImage =
  'https://images.unsplash.com/photo-1508610048659-7d0d9f4d014b?auto=format&fit=crop&w=1470&q=80';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cricket-green-light bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dummyCricketImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-white animate-slide-up text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 mb-4 justify-center lg:justify-start">
              <Star className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold text-sm sm:text-base">
                #1 Cricket Scoring App
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-cricket-brown to-accent bg-clip-text text-transparent">
              Score Cricket Like a
              <span className="text-accent block">Professional</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              The most intuitive and comprehensive cricket scoring application.
              Track every ball, analyze performance, and elevate your cricket experience.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-8 text-center sm:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">50K+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">1M+</div>
                <div className="text-sm text-white/80">Matches Scored</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">4.9★</div>
                <div className="text-sm text-white/80">App Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
              <Button
                size="lg"
                className="text-lg flex justify-center items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary flex justify-center items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-float max-w-md mx-auto lg:mx-0">
            {[
              {
                iconBg: 'bg-primary text-primary-foreground',
                title: 'Team Management',
                description: 'Manage players, teams, and tournaments effortlessly',
                icon: <Users className="w-6 h-6" />,
              },
              {
                iconBg: 'bg-accent text-accent-foreground',
                title: 'Live Analytics',
                description: 'Real-time statistics and performance insights',
                icon: <BarChart3 className="w-6 h-6" />,
              },
              {
                iconBg: 'bg-primary text-primary-foreground',
                title: 'Professional Reports',
                description: 'Generate detailed match reports and scorecards',
                icon: <Star className="w-6 h-6" />,
              },
            ].map(({ iconBg, title, description, icon }) => (
              <div
                key={title}
                className="bg-card/80 backdrop-blur-lg p-6 rounded-xl shadow-[0_10px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-shadow duration-300 cursor-default"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${iconBg} p-3 rounded-lg flex items-center justify-center`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
