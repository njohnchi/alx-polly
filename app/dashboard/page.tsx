import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Pencil, Trash2, Eye } from 'lucide-react';
import { Poll } from '@/lib/types';
import { DeletePollButton } from '@/components/polls/DeletePollButton';

export const metadata: Metadata = {
  title: 'Dashboard - Polling App',
  description: 'Manage your polls',
};

async function getUserPolls() {
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

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/login?returnUrl=/dashboard');
  }

  // Get all polls created by the current user
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      options:poll_options(count),
      votes:votes(count)
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user polls:', error);
    return [];
  }

  return polls as Poll[];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const polls = await getUserPolls();
  const updated = searchParams.updated === 'true';

  return (
    <div className="container py-8">
      {updated && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your poll has been updated successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">You haven't created any polls yet</h2>
          <p className="text-muted-foreground mb-6">Create your first poll to get started!</p>
          <Link href="/polls/create">
            <Button>Create Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                {poll.description && (
                  <CardDescription>
                    <p className="line-clamp-2">{poll.description}</p>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{poll.options?.length || 0} options</span>
                  <span>{poll.votes?.length || 0} votes</span>
                </div>
                <div className="mt-2 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${poll.is_public ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {poll.is_public ? 'Public' : 'Private'}
                  </span>
                  {poll.end_date && (
                    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs ${new Date(poll.end_date) < new Date() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {new Date(poll.end_date) < new Date() ? 'Ended' : 'Active'}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                </Link>
                <div className="space-x-2">
                  <Link href={`/dashboard/edit/${poll.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </Link>
                  <DeletePollButton id={poll.id} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}