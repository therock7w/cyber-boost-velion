import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManagementLogin from '@/components/ManagementLogin';
import { Search, X, Clock, TrendingUp, Eye, UserCheck, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const [filteredMissions, setFilteredMissions] = useState<MissionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('velionManagementAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Load mission data from localStorage
      const storedData = localStorage.getItem('velionMissions');
      if (storedData) {
        const missionData = JSON.parse(storedData);
        setMissions(missionData);
        setFilteredMissions(missionData);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filter missions based on search query
    if (!searchQuery.trim()) {
      setFilteredMissions(missions);
    } else {
      const filtered = missions.filter(mission =>
        mission.tiktokLink.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMissions(filtered);
    }
  }, [searchQuery, missions]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('velionManagementAuth');
    setIsAuthenticated(false);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all mission data? This action cannot be undone.')) {
      localStorage.removeItem('velionMissions');
      setMissions([]);
      setFilteredMissions([]);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery('');
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return new Date(timestamp).toLocaleString();
    }
  };

  const getCompletionStatus = (mission: MissionData) => {
    const requiredAds = Math.floor(mission.followers / 2);
    const adsCompleted = mission.adsWatched >= requiredAds;
    const followCompleted = mission.followCompleted;
    
    if (adsCompleted && followCompleted) return { status: 'completed', text: 'Completed', color: 'bg-green-500/20 text-green-400' };
    if (adsCompleted || followCompleted) return { status: 'partial', text: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400' };
    return { status: 'pending', text: 'Pending', color: 'bg-red-500/20 text-red-400' };
  };

  if (!isAuthenticated) {
    return <ManagementLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h1 className="text-5xl md:text-7xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient animate-float">
              VELION MANAGEMENT
            </h1>
            <Button onClick={handleLogout} variant="outline" className="bg-red-500/20 border-red-400 text-red-400 hover:bg-red-500/30">
              Logout
            </Button>
          </div>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient mb-2">
                  Mission Reports
                </h2>
                <p className="text-liquid-muted font-inter">
                  {filteredMissions.length} of {missions.length} {missions.length === 1 ? 'mission' : 'missions'} shown
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-liquid-muted w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by TikTok link..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="liquid-input pl-10 pr-10 w-full md:w-80"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearchQuery}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-liquid-muted hover:text-liquid-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <Button onClick={clearAllData} className="liquid-button bg-red-500/20 border-red-400 text-red-400 hover:bg-red-500/30">
                  Clear All Data
                </Button>
              </div>
            </div>

            {filteredMissions.length === 0 && searchQuery ? (
              <div className="liquid-card text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-liquid-primary to-liquid-secondary rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-inter font-semibold mb-2 text-liquid-text">
                  No Results Found
                </h3>
                <p className="text-liquid-muted font-inter">
                  No missions found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMissions.map((mission, index) => {
                  const completionStatus = getCompletionStatus(mission);
                  const requiredAds = Math.floor(mission.followers / 2);
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-liquid-surface/30 to-liquid-surface/10 backdrop-blur-sm border border-liquid-primary/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Notification Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-liquid-primary/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            completionStatus.status === 'completed' ? 'bg-green-400' : 
                            completionStatus.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'
                          } animate-pulse`}></div>
                          <div>
                            <h3 className="text-lg font-inter font-bold text-liquid-text">
                              Mission #{missions.indexOf(mission) + 1}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-liquid-muted">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(mission.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${completionStatus.color} border-0 font-inter font-medium px-3 py-1`}>
                          {completionStatus.text}
                        </Badge>
                      </div>

                      {/* Mission Content */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* TikTok Link */}
                        <div className="md:col-span-2">
                          <div className="bg-liquid-surface/20 rounded-lg p-4 border border-liquid-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-liquid-primary" />
                              <span className="text-sm font-inter font-medium text-liquid-muted">TikTok Profile</span>
                            </div>
                            <div className="text-liquid-text font-inter font-medium break-all">
                              {mission.tiktokLink}
                            </div>
                          </div>
                        </div>

                        {/* Follower Count */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-liquid-gradient mb-1">
                              {mission.followers.toLocaleString()}
                            </div>
                            <div className="text-sm text-liquid-muted font-inter">requested followers</div>
                            <div className="text-xs text-liquid-muted/70 font-inter mt-1">
                              Profile has {mission.totalFollowersForLink.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-6 grid md:grid-cols-2 gap-4">
                        {/* Ads Progress */}
                        <div className="bg-liquid-surface/20 rounded-lg p-4 border border-liquid-primary/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-liquid-secondary" />
                              <span className="text-sm font-inter font-medium text-liquid-text">Ads Watched</span>
                            </div>
                            <Badge className={`${
                              mission.adsWatched >= requiredAds 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            } border-0 font-inter text-xs px-2 py-1`}>
                              {mission.adsWatched}/{requiredAds}
                            </Badge>
                          </div>
                          <div className="w-full bg-liquid-surface/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-liquid-primary to-liquid-secondary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((mission.adsWatched / requiredAds) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Follow Status */}
                        <div className="bg-liquid-surface/20 rounded-lg p-4 border border-liquid-primary/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-liquid-primary" />
                              <span className="text-sm font-inter font-medium text-liquid-text">Follow Status</span>
                            </div>
                            <Badge className={`${
                              mission.followCompleted 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            } border-0 font-inter text-xs px-2 py-1`}>
                              {mission.followCompleted ? '✓ Completed' : '✗ Pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="mt-4 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                          completionStatus.status === 'completed' 
                            ? 'bg-green-500/10 border border-green-500/20' 
                            : completionStatus.status === 'partial' 
                            ? 'bg-yellow-500/10 border border-yellow-500/20' 
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          <span className="text-2xl">
                            {completionStatus.status === 'completed' ? '🎉' : completionStatus.status === 'partial' ? '⏳' : '⏸️'}
                          </span>
                          <span className={`text-sm font-inter font-medium ${
                            completionStatus.status === 'completed' ? 'text-green-400' : 
                            completionStatus.status === 'partial' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            Mission {completionStatus.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;
