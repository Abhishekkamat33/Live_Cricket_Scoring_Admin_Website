import React from "react";

type ButtonVariant = "default" | "cricket";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  buttonText: string;
  buttonVariant: ButtonVariant;
  showButton: boolean;
}

export const InstructionSection: React.FC = () => {
  const steps: Step[] = [
    {
      icon: (
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
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 2v8"
          />
        </svg>
      ),
      title: "Download & Install",
      description:
        "Get the app from your preferred store or use our web version instantly",
      details: [
        "Available on all platforms",
        "Quick 2-minute setup",
        "No technical knowledge required",
      ],
      buttonText: "Download Now",
      buttonVariant: "default",
      showButton: true,
    },
    {
      icon: (
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
            d="M14.752 11.168l-6.518 3.752A1 1 0 017 13.993V8.007a1 1 0 011.234-.97l6.518 3.752a1 1 0 010 1.661z"
          />
        </svg>
      ),
      title: "Start Your First Match",
      description:
        "Create teams, add players, and begin scoring with our intuitive interface",
      details: [
        "Drag & drop team setup",
        "Player statistics tracking",
        "Real-time score updates",
      ],
      buttonText: "Try Demo",
      buttonVariant: "cricket",
      showButton: true,
    },
    {
      icon: (
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
            d="M11 3h2a1 1 0 011 1v5h-4V4a1 1 0 011-1zM12 12a4 4 0 100 8 4 4 0 000-8zm-4 4h8"
          />
        </svg>
      ),
      title: "Analyze Performance",
      description:
        "View comprehensive statistics, charts, and insights after the match",
      details: [
        "Detailed analytics dashboard",
        "Performance comparisons",
        "Export reports",
      ],
      buttonText: "View Analytics",
      buttonVariant: "default",
      showButton: true,
    },
  ];

  const buttonClasses: Record<ButtonVariant, string> = {
    default:
      "bg-primary text-white rounded-xl py-3 w-full font-semibold text-lg shadow-lg hover:brightness-110 transition",
    cricket:
      "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl py-3 w-full font-semibold text-lg shadow-lg hover:brightness-110 transition",
  };

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Get Started in{" "}
            <span className="text bg-gradient-to-r from-primary via-cricket-brown to-accent bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mx-auto max-w-xl">
            From download to your first professional scorecard in minutes. Our
            streamlined process makes cricket scoring accessible to everyone.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="flex justify-between items-center gap-2 flex-wrap">
          {steps.map(
            (
              {
                icon,
                title,
                description,
                details,
                buttonText,
                buttonVariant,
                showButton,
              },
              i
            ) => (
              <article
                key={i}
                className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {/* Icon with number badge */}
                <div className="relative mb-6">
                  <div className="bg-primary text-primary-foreground p-5 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-cricket">
                    {icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-glow">
                    {i + 1}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 max-w-xs">{description}</p>

                {/* Details list */}
                <ul className="mb-6 space-y-2 text-muted-foreground text-sm w-full max-w-xs">
                  {details.map((detail, idx) => (
                    <li key={idx} className="flex items-center ">
                      {/* CheckCircle icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-primary flex-shrink-0 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m0 0a9 9 0 11-8.996 9 9 9 0 018.996-9z"
                        />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                {showButton && (
                  <button
                    type="button"
                    className={`${buttonClasses[buttonVariant]} max-w-xs`}
                  >
                    {/* Icon inside button */}
                    {buttonVariant === "default" && (
                      <svg
                        className="inline w-5 h-5 mr-2 stroke-current"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 2v8"
                        ></path>
                      </svg>
                    )}
                    {buttonVariant === "cricket" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline w-5 h-5 mr-2 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.752 11.168l-6.518 3.752A1 1 0 017 13.993V8.007a1 1 0 011.234-.97l6.518 3.752a1 1 0 010 1.661z"
                        />
                      </svg>
                    )}
                    {buttonText}
                  </button>
                )}
              </article>
            )
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button
            type="button"
            className="inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-10 py-4 font-bold text-lg shadow-lg hover:brightness-110 transition"
          >
            Start Your Cricket Journey
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of cricket enthusiasts already using Cricket Scorer
          </p>
        </div>
      </div>
    </section>
  );
};
