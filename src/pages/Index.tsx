
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Store submitted TikTok links to prevent duplicates
const submittedLinks = new Set<string>();

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

  // Handle TikTok link input
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setTiktokLink(link);
    
    if (link && !validateTikTokUrl(link)) {
      setLinkError('Please enter a valid TikTok profile URL (e.g., https://www.tiktok.com/@username)');
    } else if (link && submittedLinks.has(link)) {
      setLinkError('This TikTok profile has already been used. Please try a different one.');
    } else {
      setLinkError('');
    }
  };

  // Handle follower selection
  const handleFollowerSelect = (count: number) => {
    setSelectedFollowers(count);
    setShowMissions(true);
    setWatchedAds([]);
    setFollowClicked(false);
  };

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

    // Add link to submitted links
    submittedLinks.add(tiktokLink);

    // Create form data to send to management page
    const formData = {
      tiktokLink,
      followers: selectedFollowers,
      adsWatched: watchedAds.length,
      followCompleted: followClicked,
      timestamp: new Date().toISOString()
    };

    console.log('Sending data:', formData);

    // Show success message
    toast({
      title: "Success!",
      description: "You will get your followers as soon as possible.",
      duration: 5000,
    });

    // Reset form
    setTiktokLink('');
    setSelectedFollowers(null);
    setWatchedAds([]);
    setFollowClicked(false);
    setShowMissions(false);
    setLinkError('');
  };

  return (
    <div className="min-h-screen bg-cyber-black text-neon-green p-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-orbitron font-black text-neon-green mb-4 animate-glow-pulse">
            WELCOME TO VELION
          </h1>
          <div className="w-32 h-1 bg-neon-green mx-auto rounded-full"></div>
        </div>

        {/* TikTok Profile Link Input */}
        <div className="mb-8">
          <Label htmlFor="tiktok-link" className="block text-lg font-orbitron font-bold mb-3">
            Enter your TikTok profile link
          </Label>
          <Input
            id="tiktok-link"
            type="url"
            value={tiktokLink}
            onChange={handleLinkChange}
            placeholder="https://www.tiktok.com/@username"
            className="cyber-input w-full text-lg"
          />
          {linkError && (
            <p className="error-message">{linkError}</p>
          )}
        </div>

        {/* Followers Selection */}
        <div className="mb-8">
          <Label className="block text-lg font-orbitron font-bold mb-4">
            Followers
          </Label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
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
          <div className="mb-8 p-6 border-2 border-neon-green/50 rounded-lg bg-cyber-black/80">
            <h2 className="text-2xl font-orbitron font-bold mb-6 text-center">
              🎯 MISSION OBJECTIVES
            </h2>
            
            {/* Watch Ads Section */}
            <div className="mb-8">
              <h3 className="text-xl font-orbitron font-bold mb-4">
                📺 Watch Ads ({Math.floor(selectedFollowers / 2)} required)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Array.from({ length: Math.floor(selectedFollowers / 2) }, (_, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAdWatch(index)}
                    className={`cyber-button ${watchedAds.includes(index) ? 'watched' : ''}`}
                  >
                    {watchedAds.includes(index) ? '✅ Watched' : `Ad ${index + 1}`}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-neon-green/70 mt-2 font-orbitron">
                Progress: {watchedAds.length}/{Math.floor(selectedFollowers / 2)} ads watched
              </p>
            </div>

            {/* Follow Account Section */}
            <div className="mb-6">
              <h3 className="text-xl font-orbitron font-bold mb-4">
                👥 Follow Account
              </h3>
              <Button
                onClick={handleFollowClick}
                className={`cyber-button w-full md:w-auto ${followClicked ? 'watched' : ''}`}
              >
                {followClicked ? '✅ Follow Completed' : 'Follow this TikTok account'}
              </Button>
              {followClicked && (
                <p className="text-sm text-neon-green/70 mt-2 font-orbitron">
                  ✅ Follow requirement completed
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
              className="cyber-button text-xl px-12 py-4 font-black"
            >
              🚀 SEND
            </Button>
            {!isSendEnabled() && selectedFollowers && (
              <p className="text-sm text-neon-green/70 mt-3 font-orbitron">
                Complete all missions to activate SEND button
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-neon-green/30">
          <p className="text-neon-green/70 font-orbitron text-sm">
            🛡️ VELION SYSTEM v2.0 | SECURE FOLLOWER PROTOCOL ACTIVE 🛡️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
