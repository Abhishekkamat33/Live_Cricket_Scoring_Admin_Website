import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Target, Heart, Award, Globe } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Cricket",
      description: "Built by cricket lovers who understand the game's nuances and requirements."
    },
    {
      icon: Target,
      title: "Precision & Accuracy",
      description: "Every run, wicket, and statistic matters. We ensure 100% accurate scoring."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Supporting cricket communities worldwide with tools that bring teams together."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "From local club matches to international tournaments, we scale with you."
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Happy Users" },
    { number: "1M+", label: "Matches Scored" },
    { number: "150+", label: "Countries" },
    { number: "4.9★", label: "App Store Rating" }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="animate-slide-up">
            <div className="flex items-center space-x-2 mb-6">
              <Trophy className="w-8 h-8 text-primary" />
              <span className="text-primary font-semibold text-lg">About Cricket Scorer</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Revolutionizing Cricket 
              <span className="text-primary block">Scoring Experience</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Founded by a team of cricket enthusiasts and tech innovators, Cricket Scorer was born 
              from the frustration of using outdated, complex scoring systems. We believed cricket 
              deserved a modern, intuitive platform that could handle everything from backyard 
              matches to professional tournaments.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Today, we are proud to serve cricket communities across the globe, providing tools 
              that make scoring simple, analytics powerful, and the cricket experience more enjoyable for everyone.
            </p>
            
            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button  size="lg">
                <Award className="w-5 h-5" />
                Join Our Mission
              </Button>
              <Button variant="outline" size="lg">
                Read Our Story
              </Button>
            </div>
          </div>
          
          {/* Right Column - Values Cards */}
          <div className="grid gap-6">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="card-gradient border-none shadow-card hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg flex-shrink-0 shadow-cricket">
                      <value.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Meet the Team Behind the Magic
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our diverse team combines deep cricket knowledge with cutting-edge technology 
            to deliver the best possible experience for cricket enthusiasts worldwide.
          </p>
          <Button size="lg">
            <Users className="w-5 h-5" />
            See Our Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;