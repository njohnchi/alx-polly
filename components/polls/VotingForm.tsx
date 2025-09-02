'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Poll, PollOption } from '@/lib/types';

interface VotingFormProps {
  poll: Poll & { options: (PollOption & { votes: number })[], totalVotes: number };
}

export default function VotingForm({ poll }: VotingFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check if user is logged in and if they've already voted
  useEffect(() => {
    async function checkUserAndVotes() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // Check if user has already voted on this poll
        const { data: existingVote } = await supabase
          .from('votes')
          .select('id')
          .eq('poll_id', poll.id)
          .eq('user_id', session.user.id)
          .single();
        
        if (existingVote) {
          setHasVoted(true);
        }
      }
    }
    
    checkUserAndVotes();
  }, [poll.id, supabase]);

  // Calculate percentage for each option
  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check if user is logged in
      if (!userId) {
        // Redirect to login page with return URL
        router.push(`/auth/login?returnUrl=/polls/${poll.id}`);
        return;
      }
      
      // Check if poll has ended
      if (poll.end_date && new Date(poll.end_date) < new Date()) {
        setError('This poll has ended and is no longer accepting votes.');
        setIsSubmitting(false);
        return;
      }
      
      // Submit vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          poll_id: poll.id,
          option_id: selectedOption,
          user_id: userId
        });
      
      if (voteError) {
        if (voteError.code === '23505') { // Unique constraint violation
          setError('You have already voted on this poll.');
        } else {
          setError(`Error submitting vote: ${voteError.message}`);
        }
        setIsSubmitting(false);
        return;
      }
      
      // Update local state
      setHasVoted(true);
      
      // Refresh the page to show updated results
      router.refresh();
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Vote submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {poll.options.map((option) => (
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
            Thank you for voting! Total votes: {poll.totalVotes}
          </p>
        </div>
      )}
      
      {/* Show poll end date if it exists */}
      {poll.end_date && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          This poll {new Date(poll.end_date) < new Date() ? 'ended' : 'ends'} on {new Date(poll.end_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}