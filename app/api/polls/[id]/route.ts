
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UpdatePollInput } from '@/lib/types';

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { id } = params;

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select(`
      *,
      options:poll_options(*)
    `)
    .eq('id', id)
    .single();

  if (pollError) {
    return NextResponse.json({ error: `Failed to fetch poll: ${pollError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, poll });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'You must be logged in to update a poll' }, { status: 401 });
    }

    const { data: existingPoll, error: pollCheckError } = await supabase
        .from('polls')
        .select('id, user_id')
        .eq('id', id)
        .single();

    if (pollCheckError || !existingPoll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (existingPoll.user_id !== user.id) {
        return NextResponse.json({ error: 'You do not have permission to update this poll' }, { status: 403 });
    }

    const pollData: UpdatePollInput = await request.json();

    const { error: pollUpdateError } = await supabase
        .from('polls')
        .update({
            title: pollData.title,
            description: pollData.description,
            is_multiple_choice: pollData.is_multiple_choice,
            is_public: pollData.is_public,
            end_date: pollData.end_date,
        })
        .eq('id', id);

    if (pollUpdateError) {
        return NextResponse.json({ error: `Failed to update poll: ${pollUpdateError.message}` }, { status: 500 });
    }

    // ... (logic to update options)

    return NextResponse.json({ success: true, pollId: id });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'You must be logged in to delete a poll' }, { status: 401 });
    }

    const { data: existingPoll, error: pollCheckError } = await supabase
        .from('polls')
        .select('id, user_id')
        .eq('id', id)
        .single();

    if (pollCheckError || !existingPoll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (existingPoll.user_id !== user.id) {
        return NextResponse.json({ error: 'You do not have permission to delete this poll' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
        .from('polls')
        .delete()
        .eq('id', id);

    if (deleteError) {
        return NextResponse.json({ error: `Failed to delete poll: ${deleteError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
