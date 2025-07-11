import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Settings, Save } from 'lucide-react';

interface Mission {
  socialLink: string;
  platform: string;
  followers: number;
  adsWatched: number;
  followCompleted: boolean;
  timestamp: string;
  totalFollowersForLink: number;
}

const Management = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [followerLimit, setFollowerLimit] = useState<number>(110);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [platformUrls, setPlatformUrls] = useState({
    tiktok: '',
    instagram: '',
    youtube: ''
  });

  // Load follower limit from localStorage
  useEffect(() => {
    const storedLimit = localStorage.getItem('velionFollowerLimit');
    if (storedLimit) {
      setFollowerLimit(parseInt(storedLimit));
    }
  }, []);

  useEffect(() => {
    const storedUrls = localStorage.getItem('velionPlatformLinks');
    if (storedUrls) {
      setPlatformUrls(JSON.parse(storedUrls));
    } else {
      // Initialize with default URLs if nothing is stored
      setPlatformUrls({
        tiktok: 'https://www.tiktok.com/@dannycross443',
        instagram: 'https://www.instagram.com/imdannyc4u/',
        youtube: 'https://www.youtube.com/@Dannycross_1'
      });
    }
  }, []);

  useEffect(() => {
    const storedMissions = localStorage.getItem('velionMissions');
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions));
    }
  }, []);

  const filteredMissions = missions.filter(mission => {
    const searchTerm = searchQuery.toLowerCase();
    const link = mission.socialLink.toLowerCase();
    const platform = mission.platform.toLowerCase();

    const matchesSearch = link.includes(searchTerm) || platform.includes(searchTerm);
    const matchesPlatform = platformFilter === 'all' ? true : mission.platform === platformFilter;
    const matchesDate = dateFilter ? format(new Date(mission.timestamp), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd') : true;

    return matchesSearch && matchesPlatform && matchesDate;
  });

  const handleFollowerLimitChange = (increment: number) => {
    const newLimit = Math.max(10, followerLimit + increment);
    setFollowerLimit(newLimit);
    localStorage.setItem('velionFollowerLimit', newLimit.toString());
    
    const action = increment > 0 ? 'increased' : 'decreased';
    toast({
      title: "Follower Limit Updated",
      description: `Follower limit ${action} to ${newLimit}. Follower options updated accordingly.`,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePlatformFilterChange = (value: string) => {
    setPlatformFilter(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDateFilter(date);
  };

  const totalMissions = missions.length;
  const totalFollowers = missions.reduce((sum, mission) => sum + mission.followers, 0);
  const totalAdsWatched = missions.reduce((sum, mission) => sum + mission.adsWatched, 0);

  const savePlatformUrls = () => {
    localStorage.setItem('velionPlatformLinks', JSON.stringify(platformUrls));
    toast({
      title: "Platform URLs Saved",
      description: "The platform follow URLs have been successfully saved.",
    });
  };

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text p-6">
      {/* Background elements */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-inter font-black text-transparent bg-clip-text bg-liquid-gradient mb-4">
            VELION MANAGEMENT
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-liquid-primary to-liquid-secondary mx-auto rounded-full opacity-80"></div>
          <p className="text-liquid-muted font-inter text-lg mt-4">Mission Control Dashboard</p>
        </div>

        {/* Settings Section */}
        <Card className="mb-8 bg-liquid-surface/30 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-liquid-text">
              <Settings className="w-5 h-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-liquid-text mb-2">
                  Follower Limit per Profile
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handleFollowerLimitChange(-10)}
                    disabled={followerLimit <= 10}
                    className="liquid-button px-3 py-1"
                  >
                    -10
                  </Button>
                  <span className="text-2xl font-bold text-liquid-primary min-w-[80px] text-center">
                    {followerLimit}
                  </span>
                  <Button
                    onClick={() => handleFollowerLimitChange(10)}
                    className="liquid-button px-3 py-1"
                  >
                    +10
                  </Button>
                </div>
                <p className="text-sm text-liquid-muted mt-2">
                  Current limit: {followerLimit} followers per social media profile
                </p>
                <p className="text-xs text-liquid-muted mt-1">
                  Adjusting this limit will update the available follower amounts on the main page
                </p>
              </div>

              {/* Platform URLs Configuration */}
              <div>
                <label className="block text-sm font-medium text-liquid-text mb-2">
                  Platform Follow URLs
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-liquid-muted">TikTok URL</label>
                    <Input
                      value={platformUrls.tiktok}
                      onChange={(e) => setPlatformUrls(prev => ({ ...prev, tiktok: e.target.value }))}
                      className="liquid-input"
                      placeholder="https://www.tiktok.com/@username"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-liquid-muted">Instagram URL</label>
                    <Input
                      value={platformUrls.instagram}
                      onChange={(e) => setPlatformUrls(prev => ({ ...prev, instagram: e.target.value }))}
                      className="liquid-input"
                      placeholder="https://www.instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-liquid-muted">YouTube URL</label>
                    <Input
                      value={platformUrls.youtube}
                      onChange={(e) => setPlatformUrls(prev => ({ ...prev, youtube: e.target.value }))}
                      className="liquid-input"
                      placeholder="https://www.youtube.com/@username"
                    />
                  </div>
                </div>
                <Button
                  onClick={savePlatformUrls}
                  className="liquid-button mt-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save URLs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-liquid-surface/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-liquid-text">Total Missions</CardTitle>
              <CardDescription className="text-liquid-muted">All completed missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-liquid-primary">{totalMissions}</div>
            </CardContent>
          </Card>

          <Card className="bg-liquid-surface/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-liquid-text">Total Followers Rewarded</CardTitle>
              <CardDescription className="text-liquid-muted">Across all missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-liquid-primary">{totalFollowers}</div>
            </CardContent>
          </Card>

          <Card className="bg-liquid-surface/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-liquid-text">Total Ads Watched</CardTitle>
              <CardDescription className="text-liquid-muted">Supporting content creators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-liquid-primary">{totalAdsWatched}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <Input
            type="text"
            placeholder="Search social link or platform..."
            className="liquid-input w-full md:w-auto"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <div className="flex items-center gap-4">
            <Select onValueChange={handlePlatformFilterChange}>
              <SelectTrigger className="liquid-select w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent className="bg-liquid-surface border-white/10">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "liquid-button justify-start w-[180px] font-normal",
                    !dateFilter && "text-liquid-muted"
                  )}
                >
                  {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-liquid-surface border-white/10">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2024-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Missions Table */}
        <div className="overflow-x-auto">
          <Table className="bg-liquid-surface/30 border-white/10 rounded-xl">
            <TableCaption>A list of all follower missions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Social Link</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Ads Watched</TableHead>
                <TableHead>Follow Completed</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Total Followers for Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMissions.map((mission, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{mission.socialLink}</TableCell>
                  <TableCell>{mission.platform}</TableCell>
                  <TableCell>{mission.followers}</TableCell>
                  <TableCell>{mission.adsWatched}</TableCell>
                  <TableCell>
                    {mission.followCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      'No'
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(mission.timestamp), 'PPP')}</TableCell>
                  <TableCell>{mission.totalFollowersForLink}</TableCell>
                </TableRow>
              ))}
              {filteredMissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No missions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Total {filteredMissions.length} missions
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Management;
