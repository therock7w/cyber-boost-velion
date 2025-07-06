import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Store total followers requested per TikTok link
const followerTracker = new Map<string, number>();
// Store used follower amounts per TikTok link
const usedFollowerAmounts = new Map<string, Set<number>>();

const Index = () => {
  const [tiktokLink, setTiktokLink] = useState('');
  const [selectedFollowers, setSelectedFollowers] = useState<number | null>(null);
  const [watchedAds, setWatchedAds] = useState<number[]>([]);
  const [followClicked, setFollowClicked] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [showMissions, setShowMissions] = useState(false);

  const followerOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Validate TikTok URL
  const validateTikTokUrl = (url: string): boolean => {
    const tiktokRegex = /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/i;
    return tiktokRegex.test(url);
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

  // Handle TikTok link input
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setTiktokLink(link);
    
    if (link && !validateTikTokUrl(link)) {
      setLinkError('Please enter a valid TikTok profile URL (e.g., https://www.tiktok.com/@username)');
    } else if (link && selectedFollowers) {
      if (checkFollowerLimit(link, selectedFollowers)) {
        setLinkError('This TikTok profile has already received 100 followers and cannot be used again.');
      } else if (checkDuplicateAmount(link, selectedFollowers)) {
        setLinkError(`This TikTok profile has already been used with ${selectedFollowers} followers. Please choose a different amount.`);
      } else {
        setLinkError('');
      }
    } else {
      setLinkError('');
    }
  };

  // Handle follower selection
  const handleFollowerSelect = (count: number) => {
    setSelectedFollowers(count);
    
    // Check if this selection would exceed the limit or is duplicate for the current link
    if (tiktokLink) {
      if (checkFollowerLimit(tiktokLink, count)) {
        setLinkError('This TikTok profile has already received 100 followers and cannot be used again.');
        setShowMissions(false);
      } else if (checkDuplicateAmount(tiktokLink, count)) {
        setLinkError(`This TikTok profile has already been used with ${count} followers. Please choose a different amount.`);
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
      const currentTotal = followerTracker.get(mission.tiktokLink) || 0;
      followerTracker.set(mission.tiktokLink, currentTotal + mission.followers);
      
      if (!usedFollowerAmounts.has(mission.tiktokLink)) {
        usedFollowerAmounts.set(mission.tiktokLink, new Set());
      }
      usedFollowerAmounts.get(mission.tiktokLink)!.add(mission.followers);
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
    // Open dummy TikTok page
    window.open('https://www.tiktok.com/@example_account', '_blank');
    setFollowClicked(true);
    
    // Show popup message
    setTimeout(() => {
      alert('Please make sure you have followed the account. If you haven\'t or if you unfollow, you will not receive any followers.');
    }, 1000);
  };

  // Check if send button should be enabled
  const isSendEnabled = () => {
    if (!selectedFollowers || !tiktokLink || linkError) return false;
    
    const requiredAds = Math.floor(selectedFollowers / 2);
    return watchedAds.length >= requiredAds && followClicked;
  };

  // Handle send button
  const handleSend = () => {
    if (!isSendEnabled()) return;

    // Update follower tracker with new total
    const currentTotal = followerTracker.get(tiktokLink) || 0;
    followerTracker.set(tiktokLink, currentTotal + selectedFollowers!);

    // Update used amounts tracker
    if (!usedFollowerAmounts.has(tiktokLink)) {
      usedFollowerAmounts.set(tiktokLink, new Set());
    }
    usedFollowerAmounts.get(tiktokLink)!.add(selectedFollowers!);

    // Create form data to send to management page
    const formData = {
      tiktokLink,
      followers: selectedFollowers,
      adsWatched: watchedAds.length,
      followCompleted: followClicked,
      timestamp: new Date().toISOString(),
      totalFollowersForLink: followerTracker.get(tiktokLink)
    };

    console.log('Sending data:', formData);

    // Store data in localStorage for management page
    const existingData = JSON.parse(localStorage.getItem('velionMissions') || '[]');
    existingData.push(formData);
    localStorage.setItem('velionMissions', JSON.stringify(existingData));

    // Show success message
    toast({
      title: "Success!",
      description: "You will get your followers as soon as possible. Data sent to management.",
      duration: 5000,
    });

    // Navigate to management page after a short delay
    setTimeout(() => {
      window.open('/management', '_blank');
    }, 1000);

    // Reset form
    setTiktokLink('');
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

        {/* TikTok Profile Link Input */}
        <div className="mb-12">
          <Label htmlFor="tiktok-link" className="block text-xl font-inter font-semibold mb-4 text-liquid-text">
            Enter your TikTok profile link
          </Label>
          <Input
            id="tiktok-link"
            type="url"
            value={tiktokLink}
            onChange={handleLinkChange}
            placeholder="https://www.tiktok.com/@username"
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
                {followClicked ? '✓ Follow Completed' : 'Follow this TikTok account'}
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
