import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Clock, TrendingUp, Eye, UserCheck, Calendar, Instagram, Youtube, ExternalLink, Settings, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MissionData {
  socialLink?: string;
  tiktokLink?: string;
  platform?: 'tiktok' | 'instagram' | 'youtube';
  followers: number;
  adsWatched: number;
  followCompleted: boolean;
  timestamp: string;
  totalFollowersForLink: number;
}

interface PlatformLinks {
  tiktok: string;
  instagram: string;
  youtube: string;
}

const Management = () => {
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<MissionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [platformLinks, setPlatformLinks] = useState<PlatformLinks>({
    tiktok: 'https://www.tiktok.com/@dannycross443',
    instagram: 'https://www.instagram.com/imdannyc4u/',
    youtube: 'https://www.youtube.com/@Dannycross_1'
  });
  const [followerLimit, setFollowerLimit] = useState<number>(100);

  useEffect(() => {
    // Load mission data from localStorage
    const storedData = localStorage.getItem('velionMissions');
    if (storedData) {
      const missionData = JSON.parse(storedData);
      setMissions(missionData);
      setFilteredMissions(missionData);
    }

    // Load platform links from localStorage
    const storedLinks = localStorage.getItem('velionPlatformLinks');
    if (storedLinks) {
      setPlatformLinks(JSON.parse(storedLinks));
    }

    // Load follower limit from localStorage
    const storedLimit = localStorage.getItem('velionFollowerLimit');
    if (storedLimit) {
      setFollowerLimit(parseInt(storedLimit));
    }
  }, []);

  useEffect(() => {
    // Filter missions based on search query
    if (!searchQuery.trim()) {
      setFilteredMissions(missions);
    } else {
      const filtered = missions.filter(mission => {
        const link = mission.socialLink || mission.tiktokLink || '';
        return link.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredMissions(filtered);
    }
  }, [searchQuery, missions]);

  // Platform configurations - now using dynamic links
  const platformConfigs = {
    tiktok: {
      name: 'TikTok',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      followUrl: platformLinks.tiktok,
      color: 'text-pink-400 bg-pink-500/20',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    },
    instagram: {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      followUrl: platformLinks.instagram,
      color: 'text-purple-400 bg-purple-500/20',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    youtube: {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      followUrl: platformLinks.youtube,
      color: 'text-red-400 bg-red-500/20',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  };

  const savePlatformLinks = () => {
    localStorage.setItem('velionPlatformLinks', JSON.stringify(platformLinks));
    localStorage.setItem('velionFollowerLimit', followerLimit.toString());
    setShowSettings(false);
    // Show success message
    alert('Settings updated successfully!');
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

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h1 className="text-5xl md:text-7xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient animate-float">
              VELION MANAGEMENT
            </h1>
            <Button 
              onClick={() => setShowSettings(!showSettings)} 
              className="liquid-button bg-blue-500/20 border-blue-400 text-blue-400 hover:bg-blue-500/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-liquid-primary to-liquid-secondary mx-auto rounded-full opacity-80 mb-4"></div>
          <p className="text-xl font-inter text-liquid-muted">
            Mission Control Center
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="liquid-card mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-liquid-primary" />
              <h2 className="text-2xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient">
                Platform Settings
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-liquid-muted font-inter">
                Configure the follow account links for each platform and system limits:
              </p>

              {/* Follower Limit Settings */}
              <div className="bg-liquid-surface/20 rounded-lg p-4 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-orange-500/20 text-orange-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6"/>
                      <path d="m21 12-6 0m-6 0-6 0"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-liquid-text">Follower Limit</h3>
                    <p className="text-sm text-liquid-muted">Maximum followers allowed per profile link</p>
                  </div>
                </div>
                <Input
                  type="number"
                  min="10"
                  max="1000"
                  step="10"
                  value={followerLimit}
                  onChange={(e) => setFollowerLimit(Math.max(10, parseInt(e.target.value) || 100))}
                  placeholder="100"
                  className="liquid-input"
                />
                <p className="text-xs text-liquid-muted mt-2">
                  Set between 10-1000 followers. This limit applies to all profile links.
                </p>
              </div>
              
              <div className="grid md:grid-cols-1 gap-6">
                {/* TikTok Settings */}
                <div className="bg-liquid-surface/20 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-pink-500/20 text-pink-400">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-liquid-text">TikTok Follow Link</h3>
                      <p className="text-sm text-liquid-muted">Link users will follow for TikTok missions</p>
                    </div>
                  </div>
                  <Input
                    type="url"
                    value={platformLinks.tiktok}
                    onChange={(e) => setPlatformLinks(prev => ({ ...prev, tiktok: e.target.value }))}
                    placeholder="https://www.tiktok.com/@username"
                    className="liquid-input"
                  />
                </div>

                {/* Instagram Settings */}
                <div className="bg-liquid-surface/20 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-liquid-text">Instagram Follow Link</h3>
                      <p className="text-sm text-liquid-muted">Link users will follow for Instagram missions</p>
                    </div>
                  </div>
                  <Input
                    type="url"
                    value={platformLinks.instagram}
                    onChange={(e) => setPlatformLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://www.instagram.com/username/"
                    className="liquid-input"
                  />
                </div>

                {/* YouTube Settings */}
                <div className="bg-liquid-surface/20 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-liquid-text">YouTube Follow Link</h3>
                      <p className="text-sm text-liquid-muted">Link users will follow for YouTube missions</p>
                    </div>
                  </div>
                  <Input
                    type="url"
                    value={platformLinks.youtube}
                    onChange={(e) => setPlatformLinks(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="https://www.youtube.com/@username"
                    className="liquid-input"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={savePlatformLinks} className="liquid-button bg-green-500/20 border-green-400 text-green-400 hover:bg-green-500/30">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => setShowSettings(false)} variant="outline" className="liquid-button">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {missions.length === 0 ? (
          // No Missions Display
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
            {/* Search and Filter Section */}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-liquid-muted w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by profile link..."
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
              // No Results Display
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
              <div className="space-y-6">
                {filteredMissions.map((mission, index) => {
                  const completionStatus = getCompletionStatus(mission);
                  const requiredAds = Math.floor(mission.followers / 2);
                  const platform = mission.platform || 'tiktok'; // Default to tiktok for backward compatibility
                  const platformConfig = platformConfigs[platform];
                  const profileLink = mission.socialLink || mission.tiktokLink || '';
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-liquid-surface/30 to-liquid-surface/10 backdrop-blur-sm border border-liquid-primary/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Mission Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-liquid-primary/10">
                        <div className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full ${
                            completionStatus.status === 'completed' ? 'bg-green-400' : 
                            completionStatus.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'
                          } animate-pulse`}></div>
                          <div>
                            <h3 className="text-xl font-inter font-bold text-liquid-text">
                              Mission #{missions.indexOf(mission) + 1}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-liquid-muted mt-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(mission.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${completionStatus.color} border-0 font-inter font-medium px-4 py-2 text-sm`}>
                          {completionStatus.text}
                        </Badge>
                      </div>

                      {/* Platform Information */}
                      <div className="mb-6">
                        <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${platformConfig.bgColor} border ${platformConfig.borderColor}`}>
                          <div className={`p-2 rounded-full ${platformConfig.color}`}>
                            {platformConfig.icon}
                          </div>
                          <div>
                            <div className="text-sm font-inter font-medium text-liquid-muted">Platform</div>
                            <div className="text-lg font-inter font-bold text-liquid-text">{platformConfig.name}</div>
                          </div>
                        </div>
                      </div>

                      {/* Mission Details Grid */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Left Column - Links */}
                        <div className="space-y-4">
                          {/* User Profile Link */}
                          <div className="bg-liquid-surface/20 rounded-lg p-4 border border-liquid-primary/10">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4 text-liquid-primary" />
                              <span className="text-sm font-inter font-semibold text-liquid-text">User {platformConfig.name} Profile</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-liquid-muted font-inter break-all flex-1">
                                {profileLink}
                              </div>
                              <a 
                                href={profileLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-liquid-primary hover:text-liquid-secondary transition-colors flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* Follow Account Link */}
                          <div className="bg-liquid-surface/20 rounded-lg p-4 border border-liquid-primary/10">
                            <div className="flex items-center gap-2 mb-3">
                              <UserCheck className="w-4 h-4 text-liquid-secondary" />
                              <span className="text-sm font-inter font-semibold text-liquid-text">Follow Account Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a 
                                href={platformConfig.followUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-liquid-primary hover:text-liquid-secondary font-inter text-sm transition-colors break-all flex-1"
                              >
                                {platformConfig.followUrl}
                              </a>
                              <ExternalLink className="w-4 h-4 text-liquid-primary flex-shrink-0" />
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Follower Stats */}
                        <div className="flex items-center justify-center">
                          <div className="text-center bg-liquid-surface/20 rounded-lg p-6 border border-liquid-primary/10 w-full">
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-liquid-gradient mb-2">
                              {mission.followers.toLocaleString()}
                            </div>
                            <div className="text-sm text-liquid-text font-inter font-medium mb-1">Requested Followers</div>
                            <div className="text-xs text-liquid-muted/80 font-inter">
                              Profile currently has {mission.totalFollowersForLink.toLocaleString()} followers
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                      <div className="text-center">
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
