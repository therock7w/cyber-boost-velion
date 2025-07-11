import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Instagram, Youtube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Store total followers requested per social media link
const followerTracker = new Map<string, number>();
// Store used follower amounts per social media link
const usedFollowerAmounts = new Map<string, Set<number>>();

type Platform = 'tiktok' | 'instagram' | 'youtube';

interface FollowerLabel {
  amount: number;
  label: 'NEW' | 'SOON' | null;
}

const Index = () => {
  const [socialLink, setSocialLink] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [selectedFollowers, setSelectedFollowers] = useState<number | null>(null);
  const [watchedAds, setWatchedAds] = useState<number[]>([]);
  const [followClicked, setFollowClicked] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [showMissions, setShowMissions] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followerLimit, setFollowerLimit] = useState<number>(100);
  const [followerLabels, setFollowerLabels] = useState<FollowerLabel[]>([]);

  // Generate follower options dynamically based on the current limit
  const generateFollowerOptions = (limit: number): number[] => {
    const options = [];
    for (let i = 10; i <= limit; i += 10) {
      options.push(i);
    }
    return options;
  };

  const followerOptions = generateFollowerOptions(followerLimit);

  // Load follower limit from localStorage
  useEffect(() => {
    const storedLimit = localStorage.getItem('velionFollowerLimit');
    if (storedLimit) {
      setFollowerLimit(parseInt(storedLimit));
    }
  }, []);

  // Load follower labels from localStorage
  useEffect(() => {
    const storedLabels = localStorage.getItem('velionFollowerLabels');
    if (storedLabels) {
      setFollowerLabels(JSON.parse(storedLabels));
    }
  }, []);

  // Get label for specific follower amount
  const getLabelForAmount = (amount: number): 'NEW' | 'SOON' | null => {
    const labelInfo = followerLabels.find(item => item.amount === amount);
    return labelInfo?.label || null;
  };

  // Platform configurations - get URLs from localStorage or use defaults
  const getFollowUrls = () => {
    const saved = localStorage.getItem('velionPlatformLinks');
    return saved ? JSON.parse(saved) : {
      tiktok: 'https://www.tiktok.com/@dannycross443',
      instagram: 'https://www.instagram.com/imdannyc4u/',
      youtube: 'https://www.youtube.com/@Dannycross_1'
    };
  };

  const platformConfigs = {
    tiktok: {
      name: 'TikTok',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      placeholder: 'https://www.tiktok.com/@username',
      regex: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/i,
      followUrl: getFollowUrls().tiktok
    },
    instagram: {
      name: 'Instagram',
      icon: <Instagram className="w-8 h-8" />,
      placeholder: 'https://www.instagram.com/username',
      regex: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+/i,
      followUrl: getFollowUrls().instagram
    },
    youtube: {
      name: 'YouTube',
      icon: <Youtube className="w-8 h-8" />,
      placeholder: 'https://www.youtube.com/@username',
      regex: /^https?:\/\/(www\.)?youtube\.com\/@[\w.-]+/i,
      followUrl: getFollowUrls().youtube
    }
  };

  // Validate social media URL based on selected platform
  const validateSocialUrl = (url: string, platform: Platform): boolean => {
    return platformConfigs[platform].regex.test(url);
  };

  // Check if this link has reached the configurable follower limit
  const hasReachedLimit = (url: string): boolean => {
    const currentTotal = followerTracker.get(url) || 0;
    return currentTotal >= followerLimit;
  };

  // Check if adding selected followers would exceed the configurable limit
  const checkFollowerLimit = (url: string, newFollowers: number): boolean => {
    const currentTotal = followerTracker.get(url) || 0;
    return currentTotal + newFollowers > followerLimit;
  };

  // Get available follower options for current link
  const getAvailableFollowerOptions = (url: string): number[] => {
    if (!url) return followerOptions;
    
    const currentTotal = followerTracker.get(url) || 0;
    
    // If link has reached the limit, no options available
    if (currentTotal >= followerLimit) return [];
    
    return followerOptions.filter(amount => {
      // Don't show if it would exceed the limit
      if (currentTotal + amount > followerLimit) return false;
      return true;
    });
  };

  // Handle social media link input
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setSocialLink(link);
    
    if (link && !validateSocialUrl(link, selectedPlatform)) {
      setLinkError(`Please enter a valid ${platformConfigs[selectedPlatform].name} profile URL (e.g., ${platformConfigs[selectedPlatform].placeholder})`);
      setShowMissions(false);
    } else if (link && hasReachedLimit(link)) {
      setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already received ${followerLimit} followers and is no longer available for use.`);
      setShowMissions(false);
    } else if (link && selectedFollowers) {
      if (checkFollowerLimit(link, selectedFollowers)) {
        setLinkError(`Adding ${selectedFollowers} followers would exceed the ${followerLimit} follower limit for this profile.`);
        setShowMissions(false);
      } else {
        setLinkError('');
        setShowMissions(true);
      }
    } else {
      setLinkError('');
      if (link && selectedFollowers) {
        setShowMissions(true);
      }
    }
  };

  // Handle platform selection
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSocialLink('');
    setSelectedFollowers(null);
    setLinkError('');
    setShowMissions(false);
  };

  // Handle follower selection
  const handleFollowerSelect = (count: number) => {
    setSelectedFollowers(count);
    
    // Check if this selection is valid for the current link
    if (socialLink) {
      if (hasReachedLimit(socialLink)) {
        setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already received ${followerLimit} followers and is no longer available for use.`);
        setShowMissions(false);
      } else if (checkFollowerLimit(socialLink, count)) {
        setLinkError(`Adding ${count} followers would exceed the ${followerLimit} follower limit for this profile.`);
        setShowMissions(false);
      } else {
        setLinkError('');
        setShowMissions(true);
      }
    } else {
      setShowMissions(true);
    }
    
    setWatchedAds([]);
    setFollowClicked(false);
  };

  // Load existing data on component mount
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem('velionMissions') || '[]');
    
    // Rebuild tracking maps from existing data
    existingData.forEach((mission: any) => {
      const currentTotal = followerTracker.get(mission.socialLink || mission.tiktokLink) || 0;
      followerTracker.set(mission.socialLink || mission.tiktokLink, currentTotal + mission.followers);
      
      const linkKey = mission.socialLink || mission.tiktokLink;
      if (!usedFollowerAmounts.has(linkKey)) {
        usedFollowerAmounts.set(linkKey, new Set());
      }
      usedFollowerAmounts.get(linkKey)!.add(mission.followers);
    });
  }, []);

  // Handle ad watching
  const handleAdWatch = (adIndex: number) => {
    if (!watchedAds.includes(adIndex)) {
      setWatchedAds([...watchedAds, adIndex]);
    }
  };

  // Handle follow button click
  const handleFollowClick = () => {
    // Open the specific account URL for the selected platform
    window.open(platformConfigs[selectedPlatform].followUrl, '_blank');
    setFollowClicked(true);
    
    // Show the styled popup dialog
    setShowFollowDialog(true);
  };

  // Check if send button should be enabled
  const isSendEnabled = () => {
    if (!selectedFollowers || !socialLink || linkError) return false;
    if (hasReachedLimit(socialLink)) return false;
    
    const requiredAds = Math.floor(selectedFollowers / 2);
    return watchedAds.length >= requiredAds && followClicked;
  };

  // Handle send button
  const handleSend = () => {
    if (!isSendEnabled()) return;

    // Update follower tracker with new total
    const currentTotal = followerTracker.get(socialLink) || 0;
    const newTotal = currentTotal + selectedFollowers!;
    followerTracker.set(socialLink, newTotal);

    // Create form data to send to management page
    const formData = {
      socialLink,
      platform: selectedPlatform,
      followers: selectedFollowers,
      adsWatched: watchedAds.length,
      followCompleted: followClicked,
      timestamp: new Date().toISOString(),
      totalFollowersForLink: newTotal
    };

    console.log('Sending data:', formData);

    // Store data in localStorage for management page
    const existingData = JSON.parse(localStorage.getItem('velionMissions') || '[]');
    existingData.push(formData);
    localStorage.setItem('velionMissions', JSON.stringify(existingData));

    // Show success message with limit warning if applicable
    if (newTotal >= followerLimit) {
      toast({
        title: "Mission Completed!",
        description: `Your mission has been submitted successfully. This profile has now reached the ${followerLimit} follower limit and cannot be used again.`,
        duration: 7000,
      });
    } else {
      toast({
        title: "Mission Completed!",
        description: `Your mission has been submitted successfully. This profile now has ${newTotal}/${followerLimit} followers.`,
        duration: 5000,
      });
    }

    // Reset form
    setSocialLink('');
    setSelectedFollowers(null);
    setWatchedAds([]);
    setFollowClicked(false);
    setShowMissions(false);
    setLinkError('');
  };

  // Get current link status for display
  const getCurrentLinkStatus = () => {
    if (!socialLink) return null;
    const currentTotal = followerTracker.get(socialLink) || 0;
    const availableOptions = getAvailableFollowerOptions(socialLink);
    
    return {
      currentTotal,
      remainingSlots: followerLimit - currentTotal,
      isAtLimit: currentTotal >= followerLimit,
      availableOptions: availableOptions.length
    };
  };

  const linkStatus = getCurrentLinkStatus();

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-30"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-20" style={{ animationDelay: '2s' }}></div>
      <div className="liquid-blob w-64 h-64 bottom-20 left-1/3 opacity-25" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient mb-6 animate-float">
            WELCOME TO VELION
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-liquid-primary to-liquid-secondary mx-auto rounded-full opacity-80"></div>
          <p className="text-liquid-muted font-inter text-lg mt-4">Modern follower reward system</p>
        </div>

        {/* Platform Selection */}
        <div className="mb-8">
          <Label className="block text-xl font-inter font-semibold mb-4 text-liquid-text">
            Choose Platform
          </Label>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {Object.entries(platformConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handlePlatformSelect(key as Platform)}
                className={`flex items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                  selectedPlatform === key
                    ? 'bg-gradient-to-r from-liquid-primary to-liquid-secondary text-white border-liquid-primary/50 shadow-lg'
                    : 'bg-liquid-surface/50 text-liquid-text border-white/10 hover:border-liquid-primary/30'
                }`}
              >
                {config.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Social Media Profile Link Input */}
        <div className="mb-12">
          <Label htmlFor="social-link" className="block text-xl font-inter font-semibold mb-4 text-liquid-text">
            Enter your {platformConfigs[selectedPlatform].name} profile link
          </Label>
          <Input
            id="social-link"
            type="url"
            value={socialLink}
            onChange={handleLinkChange}
            placeholder={platformConfigs[selectedPlatform].placeholder}
            className="liquid-input w-full text-lg"
          />
          {linkError && (
            <p className="error-message">{linkError}</p>
          )}
          
          {/* Link Status Display */}
          {linkStatus && socialLink && !linkError && (
            <div className="mt-4 p-4 bg-liquid-surface/30 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-liquid-muted font-inter text-sm">Profile Status</span>
                <span className={`font-inter font-medium ${linkStatus.isAtLimit ? 'text-red-400' : 'text-liquid-primary'}`}>
                  {linkStatus.currentTotal}/{followerLimit} followers used
                </span>
              </div>
              <div className="w-full bg-liquid-surface rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    linkStatus.isAtLimit 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'bg-gradient-to-r from-liquid-primary to-liquid-secondary'
                  }`}
                  style={{ width: `${(linkStatus.currentTotal / followerLimit) * 100}%` }}
                ></div>
              </div>
              {linkStatus.isAtLimit ? (
                <p className="text-red-400 font-inter text-sm font-medium">
                  ⚠️ This profile has reached the maximum limit and cannot be used again
                </p>
              ) : (
                <p className="text-liquid-accent font-inter text-sm">
                  ✓ {linkStatus.remainingSlots} followers remaining • {linkStatus.availableOptions} options available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Followers Selection */}
        <div className="mb-12">
          <Label className="block text-xl font-inter font-semibold mb-6 text-liquid-text">
            Choose followers amount
          </Label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {followerOptions.map((count) => {
              const isAvailable = socialLink ? getAvailableFollowerOptions(socialLink).includes(count) : true;
              const label = getLabelForAmount(count);
              return (
                <div key={count} className={`radio-option relative ${!isAvailable ? 'opacity-40 pointer-events-none' : ''}`}>
                  <input
                    type="radio"
                    id={`followers-${count}`}
                    name="followers"
                    value={count}
                    checked={selectedFollowers === count}
                    onChange={() => handleFollowerSelect(count)}
                    disabled={!isAvailable}
                  />
                  <label htmlFor={`followers-${count}`} className={!isAvailable ? 'line-through' : ''}>
                    {count}
                  </label>
                  {label && isAvailable && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold shadow-lg ${
                        label === 'NEW' 
                          ? 'bg-green-500 text-white animate-pulse' 
                          : 'bg-blue-500 text-white animate-pulse'
                      }`}>
                        {label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {socialLink && getAvailableFollowerOptions(socialLink).length === 0 && (
            <p className="text-red-400 font-inter text-sm mt-4 text-center">
              No follower options available for this profile
            </p>
          )}
        </div>

        {/* Mission Section */}
        {showMissions && selectedFollowers && (
          <div className="mb-12 liquid-card animate-float">
            <h2 className="text-3xl font-inter font-bold mb-8 text-center text-transparent bg-clip-text bg-liquid-gradient">
              Complete Your Mission
            </h2>
            
            {/* Watch Ads Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-inter font-semibold mb-6 text-liquid-text">
                Watch Ads ({Math.floor(selectedFollowers / 2)} required)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: Math.floor(selectedFollowers / 2) }, (_, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAdWatch(index)}
                    className={`liquid-button ${watchedAds.includes(index) ? 'active' : ''}`}
                  >
                    {watchedAds.includes(index) ? '✓' : `Ad ${index + 1}`}
                  </Button>
                ))}
              </div>
              <div className="mt-4 bg-liquid-surface/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-liquid-muted font-inter text-sm">Progress</span>
                  <span className="text-liquid-primary font-inter font-medium">{watchedAds.length}/{Math.floor(selectedFollowers / 2)}</span>
                </div>
                <div className="w-full bg-liquid-surface rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-liquid-primary to-liquid-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(watchedAds.length / Math.floor(selectedFollowers / 2)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Follow Account Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-inter font-semibold mb-6 text-liquid-text">
                Follow Account
              </h3>
              <Button
                onClick={handleFollowClick}
                className={`liquid-button w-full md:w-auto ${followClicked ? 'active' : ''}`}
              >
                {followClicked ? '✓ Follow Completed' : `Follow this ${platformConfigs[selectedPlatform].name} account`}
              </Button>
              {followClicked && (
                <p className="text-liquid-accent font-inter text-sm mt-3">
                  ✓ Follow requirement completed
                </p>
              )}
            </div>
          </div>
        )}

        {/* Send Button */}
        {showMissions && (
          <div className="text-center">
            <Button
              onClick={handleSend}
              disabled={!isSendEnabled()}
              className="liquid-button text-2xl px-16 py-6 font-black"
            >
              SEND MISSION
            </Button>
            {!isSendEnabled() && selectedFollowers && (
              <p className="text-liquid-muted font-inter text-sm mt-4">
                Complete all missions to activate the send button
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-liquid-muted/70 font-inter text-sm">
            Velion System v3.0 | Modern Liquid Design
          </p>
        </div>
      </div>

      {/* Follow Account Dialog */}
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="max-w-md mx-auto bg-liquid-surface/95 backdrop-blur-lg border border-white/20 rounded-3xl text-liquid-text">
          <DialogHeader>
            <DialogTitle className="text-2xl font-inter font-bold text-center text-transparent bg-clip-text bg-liquid-gradient mb-4">
              Important Notice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-liquid-primary to-liquid-secondary flex items-center justify-center">
                {platformConfigs[selectedPlatform].icon}
              </div>
            </div>
            <p className="text-center font-inter text-lg leading-relaxed">
              Please make sure you have <span className="font-bold text-liquid-primary">followed the account</span> on {platformConfigs[selectedPlatform].name}.
            </p>
            <p className="text-center font-inter text-sm text-liquid-muted">
              If you haven't followed or if you unfollow later, you will <span className="font-semibold text-red-400">not receive any followers</span>.
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => setShowFollowDialog(false)}
                className="liquid-button w-full"
              >
                I understand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
