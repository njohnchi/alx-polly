import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { EditPollForm } from '@/components/polls/EditPollForm';

export const metadata: Metadata = {
  title: 'Edit Poll - Polling App',
  description: 'Edit your poll',
};

async function getPoll(id: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get the poll with its options
  const { data: poll, error } = await supabase
    .from('polls')
    .select(`
      *,
      options:poll_options(*)
    `)
    .eq('id', id)
    .single();

  if (error || !poll) {
    return null;
  }

  // Check if the user is the owner of the poll
  if (poll.user_id !== user.id) {
    redirect('/dashboard');
  }

  return poll;
}

export default async function EditPollPage({ params }: { params: { id: string } }) {
  const poll = await getPoll(params.id);

  if (!poll) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Poll</h1>
      <EditPollForm poll={poll} />
    </div>
  );
}