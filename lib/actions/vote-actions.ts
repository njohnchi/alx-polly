'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateVoteInput } from '../types';

/**
 * Submit a vote for a poll option
 */
export async function createVote(data: CreateVoteInput) {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if user is authenticated
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return { error: 'You must be logged in to vote', success: false };
  }

  const userId = session.session.user.id;

  try {
    // Check if poll has ended
    const { data: poll } = await supabase
      .from('polls')
      .select('end_date')
      .eq('id', data.poll_id)
      .single();

    if (poll?.end_date && new Date(poll.end_date) < new Date()) {
      return { error: 'This poll has ended', success: false };
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', data.poll_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingVote) {
      return { error: 'You have already voted on this poll', success: false };
    }

    // Submit vote
    const { error } = await supabase.from('votes').insert({
      poll_id: data.poll_id,
      option_id: data.option_id,
      user_id: userId,
    });

    if (error) {
      console.error('Error submitting vote:', error);
      return { error: 'Failed to submit vote', success: false };
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${data.poll_id}`);
    return { success: true };
  } catch (error) {
    console.error('Error in createVote:', error);
    return { error: 'An unexpected error occurred', success: false };
  }
}

/**
 * Get a user's vote for a specific poll
 */
export async function getUserVote(pollId: string) {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if user is authenticated
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return null;
  }

  const userId = session.session.user.id;

  try {
    const { data: vote } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .maybeSingle();

    return vote ? vote.option_id : null;
  } catch (error) {
    console.error('Error in getUserVote:', error);
    return null;
  }
}