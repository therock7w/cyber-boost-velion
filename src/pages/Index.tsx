import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useMutation } from "@tanstack/react-query";
import { submitMission } from "@/lib/api";

interface FormData {
  tiktokLink: string;
  followers: number;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    tiktokLink: '',
    followers: 1000,
  });
  const [totalFollowersForLink, setTotalFollowersForLink] = useState<number>(0);
  const [adsWatched, setAdsWatched] = useState<number>(0);
  const [followCompleted, setFollowCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching total followers for the link
    // In a real application, this would be fetched from an API
    const fetchTotalFollowers = async () => {
      // Simulate an API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTotalFollowersForLink(Math.floor(Math.random() * 100000)); // Simulate follower count
    };

    if (formData.tiktokLink) {
      fetchTotalFollowers();
    } else {
      setTotalFollowersForLink(0);
    }
  }, [formData.tiktokLink]);

  const mutation = useMutation({
    mutationFn: submitMission,
    onSuccess: () => {
      toast({
        title: "Mission Submitted",
        description: "Your mission has been submitted successfully.",
      });
      clearForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit mission: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tiktokLink || !formData.followers) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const missionData = {
      ...formData,
      adsWatched,
      followCompleted,
      timestamp: new Date().toISOString(),
      totalFollowersForLink,
    };

    // Save mission data to localStorage
    let missions = JSON.parse(localStorage.getItem('velionMissions') || '[]');
    missions.push(missionData);
    localStorage.setItem('velionMissions', JSON.stringify(missions));

    mutation.mutate(missionData);
    setIsLoading(false);
  };

  const clearForm = () => {
    setFormData({ tiktokLink: '', followers: 1000 });
    setAdsWatched(0);
    setFollowCompleted(false);
  };

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>

      <div className="flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-liquid-gradient">
            VELION
          </div>
          <Button 
            asChild 
            variant="ghost" 
            className="text-liquid-muted hover:text-liquid-text transition-colors"
          >
            <Link to="/management">ThisIsMe</Link>
          </Button>
        </header>

        {/* Main Content */}
        <div className="container mx-auto p-6 flex-grow flex items-center justify-center">
          <Card className="liquid-card w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-liquid-primary to-liquid-secondary rounded-full flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <CardTitle className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient">
                TIKTOK GROWTH
              </CardTitle>
              <p className="text-liquid-muted font-inter mt-2">
                Submit your TikTok link to start
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tiktokLink" className="text-liquid-text font-inter font-medium">
                    TikTok Link
                  </Label>
                  <Input
                    id="tiktokLink"
                    type="text"
                    name="tiktokLink"
                    value={formData.tiktokLink}
                    onChange={handleChange}
                    placeholder="Enter TikTok link"
                    className="liquid-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followers" className="text-liquid-text font-inter font-medium">
                    Followers
                  </Label>
                  <Input
                    id="followers"
                    type="number"
                    name="followers"
                    value={formData.followers}
                    onChange={handleChange}
                    placeholder="Enter desired followers"
                    className="liquid-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adsWatched" className="text-liquid-text font-inter font-medium">
                    Ads Watched
                  </Label>
                  <Input
                    id="adsWatched"
                    type="number"
                    name="adsWatched"
                    value={adsWatched}
                    onChange={(e) => setAdsWatched(Number(e.target.value))}
                    placeholder="Enter number of ads watched"
                    className="liquid-input"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    id="followCompleted"
                    type="checkbox"
                    checked={followCompleted}
                    onChange={(e) => setFollowCompleted(e.target.checked)}
                    className="liquid-checkbox"
                  />
                  <Label htmlFor="followCompleted" className="text-liquid-text font-inter font-medium">
                    Follow Completed
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="liquid-button w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Mission'}
                </Button>
              </form>

              {totalFollowersForLink > 0 && (
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-sm text-liquid-muted/70 font-inter">
                    Total followers for this link: {totalFollowersForLink.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center p-6 text-liquid-muted font-inter">
          © {new Date().getFullYear()} Velion. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
