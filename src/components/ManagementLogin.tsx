
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ManagementLoginProps {
  onLogin: () => void;
}

const ManagementLogin: React.FC<ManagementLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Super secure password - in production, this would be handled server-side
  const MANAGEMENT_PASSWORD = 'Velion2024@SecureManagement!';

  const handleLogin = () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter the management password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (password === MANAGEMENT_PASSWORD) {
        localStorage.setItem('velionManagementAuth', 'authenticated');
        onLogin();
        toast({
          title: "Access Granted",
          description: "Welcome to Velion Management System",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid management password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-liquid-bg text-liquid-text flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="liquid-blob w-96 h-96 top-10 -left-20 opacity-20"></div>
      <div className="liquid-blob w-80 h-80 top-1/2 -right-40 opacity-15" style={{ animationDelay: '3s' }}></div>
      
      <Card className="liquid-card w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-liquid-primary to-liquid-secondary rounded-full flex items-center justify-center">
            <span className="text-3xl">🔐</span>
          </div>
          <CardTitle className="text-3xl font-inter font-bold text-transparent bg-clip-text bg-liquid-gradient">
            SECURE ACCESS
          </CardTitle>
          <p className="text-liquid-muted font-inter mt-2">
            Enter management password to continue
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-liquid-text font-inter font-medium">
              Management Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter secure password"
              className="liquid-input"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleLogin}
            disabled={!password || isLoading}
            className="liquid-button w-full"
          >
            {isLoading ? 'Authenticating...' : 'Access Management'}
          </Button>
          
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-liquid-muted/70 font-inter">
              Authorized Personnel Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementLogin;
