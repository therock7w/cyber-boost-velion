
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MissionData {
  tiktokLink: string;
  followers: number;
  adsWatched: number;
  followCompleted: boolean;
  timestamp: string;
  totalFollowersForLink: number;
}

const Management = () => {
  const [missions, setMissions] = useState<MissionData[]>([]);

  useEffect(() => {
    // Load mission data from localStorage
    const storedData = localStorage.getItem('velionMissions');
    if (storedData) {
      setMissions(JSON.parse(storedData));
    }
  }, []);

  const clearAllData = () => {
    localStorage.removeItem('velionMissions');
    setMissions([]);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

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

        {missions.length === 0 ? (
          <div className="liquid-card text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-liquid-primary to-liquid-secondary rounded-full flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
            <h2 className="text-2xl font-inter font-semibold mb-4 text-liquid-text">
              No Missions Yet
            </h2>
            <p className="text-liquid-muted font-inter">
              Complete a mission on the main page to see data here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient">
                Mission Reports ({missions.length})
              </h2>
              <Button onClick={clearAllData} className="liquid-button">
                Clear All Data
              </Button>
            </div>

            <div className="grid gap-6">
              {missions.map((mission, index) => (
                <div key={index} className="liquid-card">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-inter font-semibold mb-4 text-liquid-text">
                        Mission #{index + 1}
                      </h3>
                      <div className="space-y-2 text-liquid-muted">
                        <p><strong>TikTok Profile:</strong> {mission.tiktokLink}</p>
                        <p><strong>Followers Requested:</strong> {mission.followers}</p>
                        <p><strong>Total for this Profile:</strong> {mission.totalFollowersForLink}</p>
                        <p><strong>Submitted:</strong> {formatDate(mission.timestamp)}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-inter font-semibold mb-4 text-liquid-text">
                        Mission Status
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-liquid-muted">Ads Watched:</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            mission.adsWatched >= Math.floor(mission.followers / 2) 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {mission.adsWatched}/{Math.floor(mission.followers / 2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-liquid-muted">Follow Completed:</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            mission.followCompleted 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {mission.followCompleted ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;
