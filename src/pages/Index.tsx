
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Instagram, Youtube } from 'lucide-react';

// Store total followers requested per social media link
const followerTracker = new Map<string, number>();
// Store used follower amounts per social media link
const usedFollowerAmounts = new Map<string, Set<number>>();

type Platform = 'tiktok' | 'instagram' | 'youtube';

const Index = () => {
  const [socialLink, setSocialLink] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [selectedFollowers, setSelectedFollowers] = useState<number | null>(null);
  const [watchedAds, setWatchedAds] = useState<number[]>([]);
  const [followClicked, setFollowClicked] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [showMissions, setShowMissions] = useState(false);

  const followerOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Platform configurations
  const platformConfigs = {
    tiktok: {
      name: 'TikTok',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      placeholder: 'https://www.tiktok.com/@username',
      regex: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/i
    },
    instagram: {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      placeholder: 'https://www.instagram.com/username',
      regex: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+/i
    },
    youtube: {
      name: 'YouTube',
      icon: <Youtube className="w-6 h-6" />,
      placeholder: 'https://www.youtube.com/@username',
      regex: /^https?:\/\/(www\.)?youtube\.com\/@[\w.-]+/i
    }
  };

  // Validate social media URL based on selected platform
  const validateSocialUrl = (url: string, platform: Platform): boolean => {
    return platformConfigs[platform].regex.test(url);
  };

  // Check if adding selected followers would exceed 100 total for this link
  const checkFollowerLimit = (url: string, newFollowers: number): boolean => {
    const currentTotal = followerTracker.get(url) || 0;
    return currentTotal + newFollowers > 100;
  };

  // Check if this follower amount has already been used for this link
  const checkDuplicateAmount = (url: string, amount: number): boolean => {
    const usedAmounts = usedFollowerAmounts.get(url);
    return usedAmounts ? usedAmounts.has(amount) : false;
  };

  // Handle social media link input
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setSocialLink(link);
    
    if (link && !validateSocialUrl(link, selectedPlatform)) {
      setLinkError(`Please enter a valid ${platformConfigs[selectedPlatform].name} profile URL (e.g., ${platformConfigs[selectedPlatform].placeholder})`);
    } else if (link && selectedFollowers) {
      if (checkFollowerLimit(link, selectedFollowers)) {
        setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already received 100 followers and cannot be used again.`);
      } else if (checkDuplicateAmount(link, selectedFollowers)) {
        setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already been used with ${selectedFollowers} followers. Please choose a different amount.`);
      } else {
        setLinkError('');
      }
    } else {
      setLinkError('');
    }
  };

  // Handle platform selection
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSocialLink('');
    setLinkError('');
    setShowMissions(false);
  };

  // Handle follower selection
  const handleFollowerSelect = (count: number) => {
    setSelectedFollowers(count);
    
    // Check if this selection would exceed the limit or is duplicate for the current link
    if (socialLink) {
      if (checkFollowerLimit(socialLink, count)) {
        setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already received 100 followers and cannot be used again.`);
        setShowMissions(false);
      } else if (checkDuplicateAmount(socialLink, count)) {
        setLinkError(`This ${platformConfigs[selectedPlatform].name} profile has already been used with ${count} followers. Please choose a different amount.`);
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
    // Open dummy social media page based on platform
    const dummyUrls = {
      tiktok: 'https://www.tiktok.com/@example_account',
      instagram: 'https://www.instagram.com/example_account',
      youtube: 'https://www.youtube.com/@example_account'
    };
    
    window.open(dummyUrls[selectedPlatform], '_blank');
    setFollowClicked(true);
    
    // Show popup message
    setTimeout(() => {
      alert('Please make sure you have followed the account. If you haven\'t or if you unfollow, you will not receive any followers.');
    }, 1000);
  };

  // Check if send button should be enabled
  const isSendEnabled = () => {
    if (!selectedFollowers || !socialLink || linkError) return false;
    
    const requiredAds = Math.floor(selectedFollowers / 2);
    return watchedAds.length >= requiredAds && followClicked;
  };

  // Handle send button
  const handleSend = () => {
    if (!isSendEnabled()) return;

    // Update follower tracker with new total
    const currentTotal = followerTracker.get(socialLink) || 0;
    followerTracker.set(socialLink, currentTotal + selectedFollowers!);

    // Update used amounts tracker
    if (!usedFollowerAmounts.has(socialLink)) {
      usedFollowerAmounts.set(socialLink, new Set());
    }
    usedFollowerAmounts.get(socialLink)!.add(selectedFollowers!);

    // Create form data to send to management page
    const formData = {
      socialLink,
      platform: selectedPlatform,
      followers: selectedFollowers,
      adsWatched: watchedAds.length,
      followCompleted: followClicked,
      timestamp: new Date().toISOString(),
      totalFollowersForLink: followerTracker.get(socialLink)
    };

    console.log('Sending data:', formData);

    // Store data in localStorage for management page
    const existingData = JSON.parse(localStorage.getItem('velionMissions') || '[]');
    existingData.push(formData);
    localStorage.setItem('velionMissions', JSON.stringify(existingData));

    // Show success message
    toast({
      title: "Mission Completed!",
      description: "Your mission has been submitted successfully. You will receive your followers soon!",
      duration: 5000,
    });

    // Reset form
    setSocialLink('');
    setSelectedFollowers(null);
    setWatchedAds([]);
    setFollowClicked(false);
    setShowMissions(false);
    setLinkError('');
  };

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
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(platformConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handlePlatformSelect(key as Platform)}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                  selectedPlatform === key
                    ? 'bg-gradient-to-r from-liquid-primary to-liquid-secondary text-white border-liquid-primary/50 shadow-lg'
                    : 'bg-liquid-surface/50 text-liquid-text border-white/10 hover:border-liquid-primary/30'
                }`}
              >
                {config.icon}
                <span className="font-inter font-medium">{config.name}</span>
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
        </div>

        {/* Followers Selection */}
        <div className="mb-12">
          <Label className="block text-xl font-inter font-semibold mb-6 text-liquid-text">
            Choose followers amount
          </Label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {followerOptions.map((count) => (
              <div key={count} className="radio-option">
                <input
                  type="radio"
                  id={`followers-${count}`}
                  name="followers"
                  value={count}
                  checked={selectedFollowers === count}
                  onChange={() => handleFollowerSelect(count)}
                />
                <label htmlFor={`followers-${count}`}>
                  {count}
                </label>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Index;
