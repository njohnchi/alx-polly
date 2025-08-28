'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for a single poll
const mockPoll = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What programming language do you prefer to work with?',
  options: [
    { id: '1', text: 'JavaScript', votes: 15 },
    { id: '2', text: 'Python', votes: 12 },
    { id: '3', text: 'Java', votes: 8 },
    { id: '4', text: 'C#', votes: 5 },
    { id: '5', text: 'Go', votes: 2 },
  ],
  totalVotes: 42,
  createdAt: '2023-10-15',
  createdBy: 'John Doe',
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This is a placeholder for the actual voting functionality
  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    
    // Simulate voting process
    setTimeout(() => {
      setIsSubmitting(false);
      setHasVoted(true);
    }, 1000);
  };

  // Calculate percentage for each option
  const getPercentage = (votes: number) => {
    return mockPoll.totalVotes > 0 ? Math.round((votes / mockPoll.totalVotes) * 100) : 0;
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

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
          <CardDescription>{mockPoll.description}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">
            Created by {mockPoll.createdBy} on {new Date(mockPoll.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPoll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name="poll-option"
                    value={option.id}
                    disabled={hasVoted}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    className="mr-2"
                  />
                  <label htmlFor={option.id} className="flex-1">
                    {option.text}
                  </label>
                  {hasVoted && (
                    <span className="text-sm font-medium">
                      {getPercentage(option.votes)}% ({option.votes} votes)
                    </span>
                  )}
                </div>
                {hasVoted && (
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${getPercentage(option.votes)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {!hasVoted ? (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || isSubmitting} 
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          ) : (
            <div className="w-full text-center">
              <p className="text-muted-foreground">
                Thank you for voting! Total votes: {mockPoll.totalVotes}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}