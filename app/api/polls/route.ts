
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CreatePollInput } from '@/lib/types';

// Create a Supabase client for server components
const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient(
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
};

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to create a poll' }, { status: 401 });
  }

  const pollData: CreatePollInput = await request.json();

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      ...pollData,
      user_id: user.id,
    })
    .select()
    .single();

  if (pollError) {
    return NextResponse.json({ error: `Failed to create poll: ${pollError.message}` }, { status: 500 });
  }

  const optionsToInsert = pollData.options.map(option => ({
    poll_id: poll.id,
    text: option.text,
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert);

  if (optionsError) {
    return NextResponse.json({ error: `Failed to create poll options: ${optionsError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, pollId: poll.id });
}

export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (pollsError) {
    return NextResponse.json({ error: `Failed to fetch public polls: ${pollsError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, polls });
}
