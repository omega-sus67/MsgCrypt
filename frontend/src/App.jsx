import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Seal from './components/Seal';
import Read from './components/Read';

function App() {
  return (
    <Router>
      <div className="min-h-screen Selection:bg-emerald-500/30">
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Seal />} />
            <Route path="/read/:vaultId" element={<Read />} />
          </Routes>
        </main>
        
        <footer className="fixed bottom-0 w-full py-6 text-center text-zinc-600 text-xs border-t border-zinc-900/50 bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex justify-center items-center gap-4">
            <span>Powered by Web Crypto API</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span>Zero-Knowledge Architecture</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
