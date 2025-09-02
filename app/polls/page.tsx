import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { Poll } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Polls - Polling App',
  description: 'View and participate in polls',
};

async function getPolls() {
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

  // Get all public polls
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      options:poll_options(count),
      profiles:profiles(name)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching polls:', error);
    return [];
  }

  return polls as Poll[];
}

export default async function PollsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const polls = await getPolls();
  const success = searchParams.success === 'true';
  const pollId = searchParams.pollId as string;

  return (
    <div className="container py-8">
      {success && pollId && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your poll has been created successfully.{' '}
            <Link href={`/polls/${pollId}`} className="font-medium underline underline-offset-4">
              View your poll
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No polls found</h2>
          <p className="text-muted-foreground mb-6">Be the first to create a poll!</p>
          <Link href="/polls/create">
            <Button>Create Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Link href={`/polls/${poll.id}`} key={poll.id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                  <CardDescription>
                    {poll.description && (
                      <p className="line-clamp-2">{poll.description}</p>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {poll.options?.length || 0} options
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(poll.created_at).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}