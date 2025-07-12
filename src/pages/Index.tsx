import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Mission {
  socialLink: string;
  platform: string;
  followers: number;
  adsWatched: number;
  followCompleted: boolean;
  timestamp: string;
  totalFollowersForLink: number;
}

interface FollowerLabel {
  amount: number;
  label: 'NEW' | 'SOON' | null;
}

const Index = () => {
  console.log("Index component rendering");
  
  const [socialLink, setSocialLink] = useState('');
  const [selectedFollowers, setSelectedFollowers] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [followerLimit, setFollowerLimit] = useState<number>(110);
  const [followerLabels, setFollowerLabels] = useState<FollowerLabel[]>([]);
  const [platformUrls, setPlatformUrls] = useState({
    tiktok: '',
    instagram: '',
    youtube: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log("Loading missions from localStorage");
    const storedMissions = localStorage.getItem('velionMissions');
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions));
    }
  }, []);

  useEffect(() => {
    const storedLimit = localStorage.getItem('velionFollowerLimit');
    if (storedLimit) {
      setFollowerLimit(parseInt(storedLimit));
    }
  }, []);

  useEffect(() => {
    const storedLabels = localStorage.getItem('velionFollowerLabels');
    if (storedLabels) {
      setFollowerLabels(JSON.parse(storedLabels));
    }
  }, []);

  useEffect(() => {
    const storedUrls = localStorage.getItem('velionPlatformLinks');
    if (storedUrls) {
      setPlatformUrls(JSON.parse(storedUrls));
    } else {
      setPlatformUrls({
        tiktok: 'https://www.tiktok.com/@dannycross443',
        instagram: 'https://www.instagram.com/imdannyc4u/',
        youtube: 'https://www.youtube.com/@Dannycross_1'
      });
    }
  }, []);

  const generateFollowerOptions = (limit: number): number[] => {
    const options = [];
    for (let i = 10; i <= limit; i += 10) {
      options.push(i);
    }
    return options;
  };

  const followerOptions = generateFollowerOptions(followerLimit);

  const detectPlatform = (url: string): string => {
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com')) return 'youtube';
    return 'unknown';
  };

  const getLabelForAmount = (amount: number): 'NEW' | 'SOON' | null => {
    const labelData = followerLabels.find(label => label.amount === amount);
    return labelData ? labelData.label : null;
  };

  const getAvailableFollowerOptions = (link: string): number[] => {
    const linkMissions = missions.filter(mission => mission.socialLink === link);
    const totalFollowersForLink = linkMissions.reduce((sum, mission) => sum + mission.followers, 0);
    
    return followerOptions.filter(count => totalFollowersForLink + count <= followerLimit);
  };

  const handleFollowerSelect = (count: number) => {
    const label = getLabelForAmount(count);
    
    if (label === 'SOON') {
      toast({
        title: "Coming Soon",
        description: `${count} followers option is coming soon and not available yet.`,
        duration: 3000,
      });
      return;
    }

    setSelectedFollowers(count);
    
    if (socialLink) {
      const isAvailable = getAvailableFollowerOptions(socialLink).includes(count);
      if (!isAvailable) {
        toast({
          title: "Selection Not Available",
          description: `This selection would exceed the follower limit for this profile.`,
          duration: 3000,
        });
        return;
      }
    }

    console.log(`Selected ${count} followers`);
  };

  const handleSubmit = async () => {
    if (!socialLink || !selectedFollowers) {
      toast({
        title: "Missing Information",
        description: "Please enter a social media link and select follower count.",
        variant: "destructive",
      });
      return;
    }

    const platform = detectPlatform(socialLink);
    if (platform === 'unknown') {
      toast({
        title: "Invalid Platform",
        description: "Please enter a valid TikTok, Instagram, or YouTube link.",
        variant: "destructive",
      });
      return;
    }

    const availableOptions = getAvailableFollowerOptions(socialLink);
    if (!availableOptions.includes(selectedFollowers)) {
      toast({
        title: "Follower Limit Exceeded",
        description: `This selection would exceed the ${followerLimit} follower limit for this profile.`,
        variant: "destructive",
      });
      return;
    }

    const existingMissions = missions.filter(mission => mission.socialLink === socialLink);
    const totalFollowersForLink = existingMissions.reduce((sum, mission) => sum + mission.followers, 0) + selectedFollowers;

    const newMission: Mission = {
      socialLink,
      platform,
      followers: selectedFollowers,
      adsWatched: Math.floor(Math.random() * 5) + 1,
      followCompleted: false,
      timestamp: new Date().toISOString(),
      totalFollowersForLink
    };

    const updatedMissions = [...missions, newMission];
    setMissions(updatedMissions);
    localStorage.setItem('velionMissions', JSON.stringify(updatedMissions));

    setSocialLink('');
    setSelectedFollowers(null);
    setIsDialogOpen(false);

    toast({
      title: "Mission Started!",
      description: `You'll receive ${selectedFollowers} followers for your ${platform} profile. Please watch ${newMission.adsWatched} ads to complete the mission.`,
    });
  };

  const handleFollowClick = (platform: string) => {
    const url = platformUrls[platform as keyof typeof platformUrls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  console.log("About to render Index component UI");

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text relative overflow-hidden">
      {/* Background elements */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      <div className="liquid-blob w-72 h-72 bottom-20 left-1/3 opacity-25" style={{ animationDelay: '6s' }}></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-12 px-6">
          <h1 className="text-6xl md:text-8xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient mb-6 leading-tight">
            VELION
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-liquid-primary to-liquid-secondary mx-auto rounded-full opacity-80 mb-4"></div>
          <p className="text-liquid-muted font-inter text-xl max-w-2xl mx-auto">
            Grow your social media presence with our advanced follower system
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Social Media Input */}
            <Card className="mb-8 bg-liquid-surface/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-liquid-text">Enter Your Social Media Link</CardTitle>
                <CardDescription className="text-liquid-muted">
                  Paste your TikTok, Instagram, or YouTube profile link to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="url"
                    placeholder="https://www.tiktok.com/@username"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="liquid-input flex-1"
                  />
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="liquid-button"
                        disabled={!socialLink}
                      >
                        Get Followers
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-liquid-surface border-white/10 text-liquid-text">
                      <DialogHeader>
                        <DialogTitle>Select Follower Package</DialogTitle>
                        <DialogDescription className="text-liquid-muted">
                          Choose how many followers you want to receive
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Follower Options</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {followerOptions.map((count) => {
                              const isAvailable = socialLink ? getAvailableFollowerOptions(socialLink).includes(count) : true;
                              const label = getLabelForAmount(count);
                              const isSoon = label === 'SOON';
                              const isDisabled = !isAvailable || isSoon;
                              
                              return (
                                <div key={count} className={`radio-option relative ${!isAvailable ? 'opacity-40 pointer-events-none' : ''} ${isSoon ? 'soon-button' : ''}`}>
                                  <input
                                    type="radio"
                                    id={`followers-${count}`}
                                    name="followers"
                                    value={count}
                                    checked={selectedFollowers === count}
                                    onChange={() => handleFollowerSelect(count)}
                                    disabled={isDisabled}
                                  />
                                  <label 
                                    htmlFor={`followers-${count}`} 
                                    className={`${!isAvailable && !isSoon ? 'line-through' : ''} ${isSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    {count}
                                  </label>
                                  {label && isAvailable && (
                                    <Badge 
                                      className={`absolute -top-2 -right-2 text-xs px-2 py-1 ${
                                        label === 'NEW' 
                                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                      }`}
                                    >
                                      {label}
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <Button 
                          onClick={handleSubmit}
                          disabled={!selectedFollowers}
                          className="liquid-button w-full"
                        >
                          Start Mission
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Follow Our Accounts */}
            <Card className="mb-8 bg-liquid-surface/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-liquid-text">Follow Our Accounts</CardTitle>
                <CardDescription className="text-liquid-muted">
                  Support us by following our official social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => handleFollowClick('tiktok')}
                    className="liquid-button bg-black hover:bg-gray-800 text-white"
                  >
                    Follow on TikTok
                  </Button>
                  <Button
                    onClick={() => handleFollowClick('instagram')}
                    className="liquid-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Follow on Instagram
                  </Button>
                  <Button
                    onClick={() => handleFollowClick('youtube')}
                    className="liquid-button bg-red-600 hover:bg-red-700 text-white"
                  >
                    Subscribe on YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mission Stats */}
            {missions.length > 0 && (
              <Card className="bg-liquid-surface/30 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-liquid-text">Your Mission Stats</CardTitle>
                  <CardDescription className="text-liquid-muted">
                    Track your progress and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-liquid-primary">{missions.length}</div>
                      <div className="text-sm text-liquid-muted">Total Missions</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-liquid-primary">
                        {missions.reduce((sum, mission) => sum + mission.followers, 0)}
                      </div>
                      <div className="text-sm text-liquid-muted">Followers Gained</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-liquid-primary">
                        {missions.reduce((sum, mission) => sum + mission.adsWatched, 0)}
                      </div>
                      <div className="text-sm text-liquid-muted">Ads Watched</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-liquid-primary">
                        {missions.filter(mission => mission.followCompleted).length}
                      </div>
                      <div className="text-sm text-liquid-muted">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
