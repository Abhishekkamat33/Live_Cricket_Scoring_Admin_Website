import type { NextPage } from 'next';

interface CommentaryItem {
  ball: string;
  text: string;
  runs: number;
  wicket: boolean;
  batsman: string;
  bowler: string;
}

const dummyCommentary: CommentaryItem[] = [
  {
    ball: '1.1',
    text: 'Good length ball on off, defended solidly by the batsman.',
    runs: 0,
    wicket: false,
    batsman: 'Virat Kohli',
    bowler: 'James Anderson',
  },
  {
    ball: '1.2',
    text: 'Short ball, batsman pulls it over square leg for 4 runs!',
    runs: 4,
    wicket: false,
    batsman: 'Virat Kohli',
    bowler: 'James Anderson',
  },
  {
    ball: '1.3',
    text: 'Full toss, batsman drives through covers for 2 runs.',
    runs: 2,
    wicket: false,
    batsman: 'Virat Kohli',
    bowler: 'James Anderson',
  },
  {
    ball: '1.4',
    text: 'Edges to the keeper, but safe. No run.',
    runs: 0,
    wicket: false,
    batsman: 'Virat Kohli',
    bowler: 'James Anderson',
  },
  {
    ball: '1.5',
    text: 'Bowled! Perfect yorker hits the stumps, bowler strikes.',
    runs: 0,
    wicket: true,
    batsman: 'Virat Kohli',
    bowler: 'James Anderson',
  },
];

const Commentary: NextPage = () => {
  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg min-h-screen">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
        Live Commentary
      </h1>

      <ul className="space-y-6">
        {dummyCommentary.map(({ ball, text, runs, wicket, batsman, bowler }, idx) => (
          <li
            key={idx}
            className={`bg-white p-5 rounded-md shadow transition hover:shadow-lg ${
              wicket ? 'border-l-4 border-red-600' : 'border-l-4 border-green-500'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-700">Ball {ball}</span>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${
                  wicket ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                }`}
              >
                {wicket ? 'Wicket' : `${runs} Run${runs !== 1 ? 's' : ''}`}
              </span>
            </div>
            <p className="text-gray-800 mb-3">{text}</p>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>
                <strong>Batsman:</strong> {batsman}
              </span>
              <span>
                <strong>Bowler:</strong> {bowler}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Commentary;
