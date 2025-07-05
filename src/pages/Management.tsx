
import React from 'react';

const Management = () => {
  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient mb-6 animate-float">
            VELION MANAGEMENT
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-liquid-primary to-liquid-secondary mx-auto rounded-full opacity-80 mb-4"></div>
          <p className="text-xl font-inter text-liquid-muted">
            Mission Control Center
          </p>
        </div>

        <div className="liquid-card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-liquid-primary to-liquid-secondary rounded-full flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-2xl font-inter font-semibold mb-4 text-liquid-text">
            Management Dashboard
          </h2>
          <p className="text-liquid-muted font-inter">
            Advanced analytics and mission tracking coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Management;
