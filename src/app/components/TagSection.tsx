import React from "react";

export const TagSection = () => {
  // Inline SVG icons matching your lucide-react icons roughly
  const icons = {
    Zap: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    Shield: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        />
      </svg>
    ),
    Globe: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx={12} cy={12} r={10} strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
    Smartphone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <rect x={7} y={3} width={10} height={18} rx={2} ry={2} />
        <line x1={12} y1={17} x2={12} y2={17} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Trophy: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9v6m-4-6v6m1-6h2a2 2 0 002-2v-3H9v3a2 2 0 002 2zM18 5h-3a2 2 0 00-2 2v3h7v-3a2 2 0 00-2-2zM6 5H3a2 2 0 00-2 2v3h7V7a2 2 0 00-2-2z" />
      </svg>
    ),
    Users: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87M9 10a4 4 0 10-8 0 4 4 0 008 0zm8 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  const features = [
    { icon: icons.Zap, text: "Lightning Fast", color: "bg-accent" },
    { icon: icons.Shield, text: "Secure & Reliable", color: "bg-primary" },
    { icon: icons.Globe, text: "Works Offline", color: "bg-accent" },
    { icon: icons.Smartphone, text: "Mobile Optimized", color: "bg-primary" },
    { icon: icons.Trophy, text: "Tournament Ready", color: "bg-accent" },
    { icon: icons.Users, text: "Team Collaboration", color: "bg-primary" },
  ];

  const tagList = [
    "#CricketScoring",
    "#LiveStats",
    "#MatchAnalytics",
    "#TeamManagement",
    "#TournamentReady",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose Cricket Scorer?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by cricket enthusiasts for cricket enthusiasts. Experience the difference with our feature-rich platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`${feature.color} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-cricket`}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm text-foreground">{feature.text}</h3>
            </div>
          ))}
        </div>

        {/* Tag badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {tagList.map((tag, index) => (
            <span
              key={index}
              className="bg-accent/30 text-accent-foreground rounded-full px-4 py-2 text-sm font-medium shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
