'use client';

import React, { useState, useEffect } from 'react';
import { useScoring } from '../ScoringContext';

interface CommentaryItem {
  balls: number;
  byes: number;
  currentBowler: string;
  fielder: string;
  legByes: number;
  noBalls: number;
  runs: number;
  strikerName: string;
  text: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  wicketType: string;
  wickets: number;
  wides: number;
}

export default function CommentaryPage() {
  const { inningData } = useScoring();
  const [commentaryData, setCommentaryData] = useState<CommentaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (inningData.length > 0 && inningData[inningData.length - 1]?.commentary) {
        setCommentaryData(inningData[inningData.length - 1].commentary);
      } else {
        setCommentaryData([]);
      }
      setLoading(false);
    }, 1000);
  }, [inningData]);

  const formatTimestamp = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getRunsColor = (runs: number, wickets: number) => {
    if (wickets > 0) return 'text-red-700';
    if (runs >= 6) return 'text-green-700 font-semibold';
    if (runs >= 4) return 'text-green-600';
    if (runs > 0) return 'text-indigo-700';
    return 'text-gray-600';
  };

  const getRunsDisplay = (item: CommentaryItem) => {
    if (item.wickets > 0) return 'W';
    if (item.runs >= 6) return '6';
    if (item.runs >= 4) return '4';
    if (item.wides > 0) return `${item.runs}wd`;
    if (item.noBalls > 0) return `${item.runs}nb`;
    if (item.byes > 0) return `${item.runs}b`;
    if (item.legByes > 0) return `${item.runs}lb`;
    return item.runs.toString();
  };

  const getBackgroundClass = (item: CommentaryItem) => {
    if (item.wickets > 0) return 'bg-red-50 border-l-4 border-red-400';
    if (item.runs >= 6) return 'bg-green-50 border-l-4 border-green-400';
    if (item.runs >= 4) return 'bg-green-50 border-l-4 border-green-300';
    return 'bg-white hover:bg-gray-50 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium">Loading commentary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto bg-white rounded-md shadow-sm overflow-hidden">
        {/* Header */}
        <header className="bg-indigo-50 border-b border-indigo-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-indigo-900">Ball by Ball Commentary</h2>
        </header>

        {/* Commentary Items */}
        <section className="divide-y divide-gray-200">
          {commentaryData.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-5xl mb-4 select-none">🏏</div>
              <h3 className="text-lg font-semibold mb-1">No Commentary Available</h3>
              <p className="text-sm">Commentary will appear here as the match progresses.</p>
            </div>
          ) : (
            [...commentaryData].reverse().map((item, idx) => (
              <article
                key={idx}
                className={`${getBackgroundClass(item)} px-6 py-5 transition-colors duration-150`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                  {/* Ball & Runs */}
                  <div className="flex items-center sm:flex-col sm:items-center sm:w-24 flex-shrink-0 space-x-4 sm:space-x-0 sm:space-y-1">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      Ball {item.balls}
                    </span>
                    <span className={`text-2xl sm:text-3xl font-semibold select-none ${getRunsColor(item.runs, item.wickets)}`}>
                      {getRunsDisplay(item)}
                    </span>
                  </div>

                  {/* Commentary Content */}
                  <div className="flex-1 min-w-0 mt-3 sm:mt-0">
                    {/* Players & Timestamp */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-1 sm:space-y-0">
                      <div className="flex space-x-3 text-sm font-medium text-gray-700">
                        <span className="capitalize text-indigo-800">{item.strikerName}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="capitalize text-orange-700">{item.currentBowler}</span>
                      </div>
                      <time className="text-xs text-gray-500 tabular-nums">{formatTimestamp(item.timestamp)}</time>
                    </div>

                    {/* Commentary Text */}
                    <p className="text-gray-900 text-sm leading-relaxed">{item.text}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap mt-3 gap-2 text-xs font-semibold">
                      {item.wickets > 0 && (
                        <span className="inline-flex items-center bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                          Wicket: {item.wicketType}
                        </span>
                      )}
                      {item.fielder && (
                        <span className="inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-1"></span>
                          Fielder: {item.fielder}
                        </span>
                      )}
                      {item.wides > 0 && (
                        <span className="inline-flex items-center bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-orange-600 rounded-full mr-1"></span>
                          Wide Ball
                        </span>
                      )}
                      {item.noBalls > 0 && (
                        <span className="inline-flex items-center bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>
                          No Ball
                        </span>
                      )}
                      {item.byes > 0 && (
                        <span className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-gray-600 rounded-full mr-1"></span>
                          Byes
                        </span>
                      )}
                      {item.legByes > 0 && (
                        <span className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-gray-600 rounded-full mr-1"></span>
                          Leg Byes
                        </span>
                      )}
                      {item.runs >= 6 && (
                        <span className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                          Maximum!
                        </span>
                      )}
                      {item.runs === 4 && (
                        <span className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                          Boundary
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Load More */}
        {commentaryData.length > 0 && (
          <div className="text-center mt-6 pb-8">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md shadow-md font-semibold transition-colors"
              type="button"
              // If you want, you can add load more functionality here
            >
              Load More Commentary
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm select-none">
          Live commentary updates automatically
        </footer>
      </main>
    </div>
  );
}
