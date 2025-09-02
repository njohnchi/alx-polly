import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import CreatePollForm from '@/components/polls/CreatePollForm';

export const metadata: Metadata = {
  title: 'Create Poll - Polling App',
  description: 'Create a new poll and share it with others',
};

async function getUser() {
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

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function CreatePollPage() {
  // Check if user is authenticated
  const user = await getUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    redirect('/auth/login?redirect=/polls/create');
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
      
      <CreatePollForm />
    </div>
  );
}