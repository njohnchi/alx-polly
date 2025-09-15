
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const id = context.params.id;

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

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const id = context.params.id;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to update a poll' }, { status: 401 });
  }

  // Get the poll to check ownership
  const { data: poll } = await supabase
    .from('polls')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  if (poll.user_id !== user.id) {
    return NextResponse.json({ error: 'You can only update your own polls' }, { status: 403 });
  }

  try {
    const body: UpdatePollInput = await request.json();

    // Update poll
    const { error: updateError } = await supabase
      .from('polls')
      .update({
        title: body.title,
        description: body.description,
        is_multiple_choice: body.is_multiple_choice,
        is_public: body.is_public,
        end_date: body.end_date,
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: `Failed to update poll: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const id = context.params.id;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to delete a poll' }, { status: 401 });
  }

  // Get the poll to check ownership
  const { data: poll } = await supabase
    .from('polls')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  if (poll.user_id !== user.id) {
    return NextResponse.json({ error: 'You can only delete your own polls' }, { status: 403 });
  }

  // Delete poll (cascade will handle options and votes)
  const { error: deleteError } = await supabase
    .from('polls')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: `Failed to delete poll: ${deleteError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
