'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";


const Index = () => {
  const router = useRouter();

const logout = async () => {


  await fetch('/api/logout', {
    method: 'POST',
  });

  router.push('/login');
};
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light">
      {/* Cricket field pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--cricket-green))_2px,_transparent_2px)] bg-[length:60px_60px]"></div>
      </div>

      {/* Navbar */}
      <header className="relative z-10 bg-card/80 backdrop-blur-lg border-b border-white/20 shadow-[0_4px_20px_-4px_hsl(var(--cricket-green)/0.3)]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
         
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cricket Scorer</h1>
          </div>
         <div className="flex items-center gap-3">
           <Link href="/yourmatches" className="px-4 py-2 rounded-lg bg-background/50 border border-gray-500">
            Matches
          </Link>
         <button 
         onClick={logout}
         className="px-4 py-2 rounded-lg bg-background/50 border border-gray-500">
         LogOut
         </button>
         </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mb-8 shadow-[0_0_40px_hsl(var(--cricket-gold)/0.3)] animate-pulse">
            <span className="text-4xl">🏏</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-cricket-brown to-accent bg-clip-text text-transparent mb-6">
            Score Every Ball, Anywhere
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The easiest way to manage and track cricket scores in real time. Whether it is a friendly match or a tournament, we have got you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
            onClick={() => router.push('/matches')}
             className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--cricket-gold)/0.4)] active:scale-[0.98]">
              🏏 Start Scoring
            </button>
            <button  onClick={() => router.push('/matches')}
            className="bg-card/80 backdrop-blur-lg border-2 border-primary/20 text-foreground py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:border-primary/40 hover:bg-card/90">
              📊 View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-card/80 backdrop-blur-lg p-6 lg:p-8 rounded-2xl shadow-[0_10px_30px_-10px_hsl(var(--cricket-green)/0.3)] border border-white/20 text-center group hover:shadow-[0_20px_40px_-10px_hsl(var(--cricket-green)/0.4)] transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Live Scoring</h3>
          <p className="text-muted-foreground leading-relaxed">Update and view scores in real-time, ball by ball with intuitive controls.</p>
        </div>
        
        <div className="bg-card/80 backdrop-blur-lg p-6 lg:p-8 rounded-2xl shadow-[0_10px_30px_-10px_hsl(var(--cricket-green)/0.3)] border border-white/20 text-center group hover:shadow-[0_20px_40px_-10px_hsl(var(--cricket-green)/0.4)] transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-cricket-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Player Stats</h3>
          <p className="text-muted-foreground leading-relaxed">Track individual and team performances across all your matches.</p>
        </div>
        
        <div className="bg-card/80 backdrop-blur-lg p-6 lg:p-8 rounded-2xl shadow-[0_10px_30px_-10px_hsl(var(--cricket-green)/0.3)] border border-white/20 text-center group hover:shadow-[0_20px_40px_-10px_hsl(var(--cricket-green)/0.4)] transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 bg-gradient-to-br from-cricket-brown to-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Match History</h3>
          <p className="text-muted-foreground leading-relaxed">Keep a complete record of all past matches and detailed results.</p>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-cricket-gold/10 backdrop-blur-lg p-8 lg:p-12 rounded-2xl border border-white/20 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Ready to Start Scoring?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of cricket enthusiasts who trust our platform for accurate, real-time match scoring.
          </p>
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--cricket-gold)/0.4)] active:scale-[0.98]">
            🏏 Create Your First Match
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-card/80 backdrop-blur-lg border-t border-white/20 text-center py-6 text-sm mt-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Cricket Scorer. Built for cricket lovers with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
