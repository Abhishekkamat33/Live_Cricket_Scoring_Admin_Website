import Head from 'next/head';
import Header from '../components/Header';

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: [
      "Score 1 Match at a Time",
      "Basic Match Summary",
      "Limited Player Stats",
    ],
  },
  {
    name: "Club",
    price: "$9.99/mo",
    features: [
      "Score Multiple Matches",
      "Advanced Player Stats",
      "Team Management",
      "Export Match Reports",
    ],
  },
  {
    name: "Pro",
    price: "$29.99/mo",
    features: [
      "Live Match Sharing",
      "Analytics Dashboard",
      "Multi-Device Sync",
      "Priority Support",
    ],
  },
];

export default function Pricing() {
  return (
    <>
    <Header/>
      <Head>
        <title>Pricing - Cricket Scoring App</title>
      </Head>
      <div className="min-h-screen bg-blue-50 text-black py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="mb-12 text-lg">Get the right tools for scoring cricket matches with ease.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-white text-black rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-xl font-bold mb-4">{plan.price}</p>
                <ul className="text-left mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index}>✔️ {feature}</li>
                  ))}
                </ul>
                <button className="w-full bg-lightblue border border-black py-2 rounded hover:bg-blue-200 font-medium">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
