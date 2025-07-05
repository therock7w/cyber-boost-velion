
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const getCompletionStatus = (mission: MissionData) => {
    const requiredAds = Math.floor(mission.followers / 2);
    const adsCompleted = mission.adsWatched >= requiredAds;
    const followCompleted = mission.followCompleted;
    
    if (adsCompleted && followCompleted) return { status: 'completed', text: 'Completed', color: 'bg-green-500/20 text-green-400' };
    if (adsCompleted || followCompleted) return { status: 'partial', text: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400' };
    return { status: 'pending', text: 'Pending', color: 'bg-red-500/20 text-red-400' };
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
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient mb-2">
                  Mission Reports
                </h2>
                <p className="text-liquid-muted font-inter">
                  {missions.length} {missions.length === 1 ? 'mission' : 'missions'} completed
                </p>
              </div>
              <Button onClick={clearAllData} className="liquid-button">
                Clear All Data
              </Button>
            </div>

            <div className="grid gap-6">
              {missions.map((mission, index) => {
                const completionStatus = getCompletionStatus(mission);
                const requiredAds = Math.floor(mission.followers / 2);
                
                return (
                  <Card key={index} className="liquid-card border-0 shadow-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl font-inter font-bold text-liquid-text mb-2">
                            Mission #{index + 1}
                          </CardTitle>
                          <Badge className={`${completionStatus.color} border-0 font-inter font-medium`}>
                            {completionStatus.text}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-liquid-gradient">
                            {mission.followers}
                          </div>
                          <div className="text-sm text-liquid-muted font-inter">followers</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-inter font-semibold text-liquid-text mb-4 flex items-center">
                            <div className="w-2 h-2 bg-liquid-primary rounded-full mr-3"></div>
                            Mission Details
                          </h3>
                          <div className="space-y-3">
                            <div className="bg-liquid-surface/30 rounded-xl p-4">
                              <div className="text-sm text-liquid-muted font-inter mb-1">TikTok Profile</div>
                              <div className="text-liquid-text font-inter font-medium break-all">
                                {mission.tiktokLink}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-liquid-surface/30 rounded-xl p-4">
                                <div className="text-sm text-liquid-muted font-inter mb-1">Requested</div>
                                <div className="text-xl font-bold text-liquid-primary">{mission.followers}</div>
                              </div>
                              <div className="bg-liquid-surface/30 rounded-xl p-4">
                                <div className="text-sm text-liquid-muted font-inter mb-1">Profile Total</div>
                                <div className="text-xl font-bold text-liquid-secondary">{mission.totalFollowersForLink}</div>
                              </div>
                            </div>
                            <div className="bg-liquid-surface/30 rounded-xl p-4">
                              <div className="text-sm text-liquid-muted font-inter mb-1">Submitted</div>
                              <div className="text-liquid-text font-inter">{formatDate(mission.timestamp)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Mission Progress */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-inter font-semibold text-liquid-text mb-4 flex items-center">
                            <div className="w-2 h-2 bg-liquid-secondary rounded-full mr-3"></div>
                            Mission Progress
                          </h3>
                          
                          {/* Ads Progress */}
                          <div className="bg-liquid-surface/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-liquid-text font-inter font-medium">Ads Watched</span>
                              <Badge className={`${
                                mission.adsWatched >= requiredAds 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              } border-0 font-inter`}>
                                {mission.adsWatched}/{requiredAds}
                              </Badge>
                            </div>
                            <div className="w-full bg-liquid-surface rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-liquid-primary to-liquid-secondary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((mission.adsWatched / requiredAds) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Follow Status */}
                          <div className="bg-liquid-surface/30 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-liquid-text font-inter font-medium">Follow Status</span>
                              <Badge className={`${
                                mission.followCompleted 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              } border-0 font-inter`}>
                                {mission.followCompleted ? '✓ Completed' : '✗ Pending'}
                              </Badge>
                            </div>
                          </div>

                          {/* Overall Progress */}
                          <div className="bg-gradient-to-r from-liquid-primary/10 to-liquid-secondary/10 rounded-xl p-4 border border-liquid-primary/20">
                            <div className="text-center">
                              <div className={`text-2xl font-black ${completionStatus.color.includes('green') ? 'text-green-400' : completionStatus.color.includes('yellow') ? 'text-yellow-400' : 'text-red-400'}`}>
                                {completionStatus.status === 'completed' ? '🎉' : completionStatus.status === 'partial' ? '⏳' : '⏸️'}
                              </div>
                              <div className="text-sm text-liquid-muted font-inter mt-2">
                                Mission {completionStatus.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;
