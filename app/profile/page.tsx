'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinedDate: '2023-09-01',
  pollsCreated: 5,
  pollsVoted: 12,
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // This is a placeholder for the actual profile update functionality
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/polls">
          <Button variant="outline" size="sm">
            ← Back to Polls
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatar-placeholder.png" alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
                  <CardDescription>Member since {new Date(mockUser.joinedDate).toLocaleDateString()}</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" defaultValue={mockUser.name} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" defaultValue={mockUser.email} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">New Password</label>
                  <Input id="password" type="password" placeholder="Leave blank to keep current password" />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Activity</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{mockUser.pollsCreated}</p>
                      <p className="text-sm text-muted-foreground">Polls Created</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{mockUser.pollsVoted}</p>
                      <p className="text-sm text-muted-foreground">Polls Voted</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}