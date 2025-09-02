import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Poll, PollOption } from '@/lib/types';
import VotingForm from '@/components/polls/VotingForm';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const poll = await getPoll(params.id);
  
  if (!poll) {
    return {
      title: 'Poll Not Found',
      description: 'The requested poll could not be found',
    };
  }
  
  return {
    title: `${poll.title} - Polling App`,
    description: poll.description || 'Vote on this poll',
  };
}

async function getPoll(id: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get the poll with its options
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select(`
      *,
      profiles:profiles(name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (pollError || !poll) {
    console.error('Error fetching poll:', pollError);
    return null;
  }

  // Get poll options
  const { data: options, error: optionsError } = await supabase
    .from('poll_options')
    .select('*')
    .eq('poll_id', id)
    .order('created_at', { ascending: true });

  if (optionsError) {
    console.error('Error fetching poll options:', optionsError);
    return null;
  }

  // Get vote counts for each option
  const { data: voteCounts, error: votesError } = await supabase
    .from('poll_options')
    .select('id, votes:votes(count)')
    .eq('poll_id', id);

  if (votesError) {
    console.error('Error fetching vote counts:', votesError);
    return null;
  }

  // Process options with vote counts
  const processedOptions = options.map((option) => {
    const voteData = voteCounts.find((vc) => vc.id === option.id);
    const voteCount = voteData?.votes?.length || 0;
    return { ...option, votes: voteCount };
  });

  // Calculate total votes
  const totalVotes = processedOptions.reduce((sum, option) => sum + option.votes, 0);

  return { ...poll, options: processedOptions, totalVotes };
}

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = await getPoll(params.id);
  
  if (!poll) {
    notFound();
  }

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
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          {poll.description && <CardDescription>{poll.description}</CardDescription>}
          <p className="text-sm text-muted-foreground mt-2">
            Created by {poll.profiles?.name || 'Anonymous'} on {new Date(poll.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <VotingForm poll={poll} />
        </CardContent>
      </Card>
    </div>
  );
}