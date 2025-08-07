import { useRouter } from "next/navigation";
import React from "react";

export const SaleSection = () => {
  const router = useRouter();
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for casual players and small teams",
      features: [
        "Up to 5 matches per month",
        "Basic scoring features",
        "Simple statistics",
        "PDF scorecard export",
        "Community support",
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Pro",
      price: "9.99",
      description: "Ideal for serious teams and regular tournaments",
      features: [
        "Unlimited matches",
        "Advanced analytics",
        "Team management tools",
        "Live match streaming",
        "Priority support",
        "Custom branding",
        "API access",
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "hero",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For leagues, academies, and professional organizations",
      features: [
        "Everything in Pro",
        "Multi-tournament management",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "Training & onboarding",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "default",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center bg-accent text-accent-foreground rounded-full px-5 py-2 mb-4 shadow-md shadow-accent/40 mx-auto max-w-max">
            {/* Star icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base">
              Special Launch Offer - 50% Off First Year
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Choose Your{" "}
            <span className="text bg-gradient-to-r from-primary via-cricket-brown to-accent bg-clip-text text-transparent">
              Cricket Journey
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mx-auto max-w-xl leading-relaxed">
            Whether you&apos;re a weekend warrior or running a professional league, we
            have the perfect plan to elevate your cricket experience.
          </p>
        </div>

        <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 bg-card/80 backdrop-blur-lg border border-white/20 shadow-md 
              flex flex-col transition transform ${
                plan.popular
                  ? "ring-2 ring-primary shadow-cricket scale-105"
                  : "hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg text-white font-semibold text-sm shadow-primary/60">
                    {/* Crown SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mr-2"
                      aria-hidden="true"
                    >
                      <path d="M5 16l-2-6 5 5 5-5-2 6h-6zM16 6h2l1-3H5l1 3h2a4 4 0 008 0z" />
                    </svg>
                    Most Popular
                  </div>
                </div>
              )}

              <header className="mb-8 text-center pt-6">
                <h3 className="text-2xl font-extrabold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex justify-center items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary">
                    {plan.price === "Custom" ? "" : "$"}
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground text-lg">/month</span>
                  )}
                </div>
                <p className="mt-3 text-muted-foreground">{plan.description}</p>
              </header>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-foreground">
                    {/* Check icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 flex-shrink-0 text-primary mr-3 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => { router.push('/login') }}
                type="button"
                className="btn h-12 w-full border border-primary rounded-md text-primary hover:bg-primary hover:text-card hover:shadow-lg hover:-translate-y-1"
              >
                {plan.popular && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline w-5 h-5 mr-2 stroke-current"
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
                )}
                {plan.buttonText}
              </button>

              {plan.popular && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  14-day free trial • No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-lg text-muted-foreground mb-6 font-semibold">
            Trusted by cricket teams and organizations worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60 text-primary font-bold text-2xl">
            <span>🏏 CricketBoard</span>
            <span>🏆 LeagueMax</span>
            <span>⭐ ProCricket</span>
          </div>
        </div>
      </div>
    </section>
  );
};