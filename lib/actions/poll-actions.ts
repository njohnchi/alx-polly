'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CreatePollInput, UpdatePollInput } from '../types';

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
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// Create a new poll with options
export async function createPoll(data: CreatePollInput) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to create a poll');
    }
    
    // Insert the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description || null,
        user_id: user.id,
        is_multiple_choice: data.is_multiple_choice,
        is_public: data.is_public,
        end_date: data.end_date || null,
      })
      .select()
      .single();
    
    if (pollError) {
      throw new Error(`Failed to create poll: ${pollError.message}`);
    }
    
    // Insert the options
    const optionsToInsert = data.options.map(option => ({
      poll_id: poll.id,
      text: option.text,
    }));
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);
    
    if (optionsError) {
      throw new Error(`Failed to create poll options: ${optionsError.message}`);
    }
    
    // Revalidate the polls page and redirect to the new poll
    revalidatePath('/polls');
    return { success: true, pollId: poll.id };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Delete a poll
export async function deletePoll(id: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to delete a poll');
    }
    
    // Check if the poll exists and belongs to the user
    const { data: existingPoll, error: pollCheckError } = await supabase
      .from('polls')
      .select('id, user_id')
      .eq('id', id)
      .single();
    
    if (pollCheckError || !existingPoll) {
      throw new Error('Poll not found');
    }
    
    if (existingPoll.user_id !== user.id) {
      throw new Error('You do not have permission to delete this poll');
    }
    
    // Delete the poll (cascade will handle options)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw new Error(`Failed to delete poll: ${deleteError.message}`);
    }
    
    // Revalidate paths
    revalidatePath('/polls');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Get a poll by ID with its options
export async function getPoll(id: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the poll with its options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select(`
        *,
        options:poll_options(*)
      `)
      .eq('id', id)
      .single();
    
    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`);
    }
    
    return { success: true, poll };
  } catch (error) {
    console.error('Error fetching poll:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Get all polls for the current user
export async function getUserPolls() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to view your polls');
    }
    
    // Get all polls for the user
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (pollsError) {
      throw new Error(`Failed to fetch polls: ${pollsError.message}`);
    }
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching user polls:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Get all public polls
export async function getPublicPolls() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get all public polls
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (pollsError) {
      throw new Error(`Failed to fetch public polls: ${pollsError.message}`);
    }
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching public polls:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Update an existing poll
export async function updatePoll(data: UpdatePollInput) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to delete a poll');
    }
    
    // Check if the poll exists and belongs to the user
    const { data: existingPoll, error: pollCheckError } = await supabase
      .from('polls')
      .select('id, user_id')
      .eq('id', id)
      .single();
    
    if (pollCheckError || !existingPoll) {
      throw new Error('Poll not found');
    }
    
    if (existingPoll.user_id !== user.id) {
      throw new Error('You do not have permission to delete this poll');
    }
    
    // Delete the poll (cascade will handle options)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw new Error(`Failed to delete poll: ${deleteError.message}`);
    }
    
    // Revalidate paths
    revalidatePath('/polls');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to update a poll');
    }
    
    // Check if the poll exists and belongs to the user
    const { data: existingPoll, error: pollCheckError } = await supabase
      .from('polls')
      .select('id, user_id')
      .eq('id', data.id)
      .single();
    
    if (pollCheckError || !existingPoll) {
      throw new Error('Poll not found');
    }
    
    if (existingPoll.user_id !== user.id) {
      throw new Error('You do not have permission to update this poll');
    }
    
    // Update the poll
    const { error: pollUpdateError } = await supabase
      .from('polls')
      .update({
        title: data.title,
        description: data.description || null,
        is_multiple_choice: data.is_multiple_choice,
        is_public: data.is_public,
        end_date: data.end_date || null,
      })
      .eq('id', data.id);
    
    if (pollUpdateError) {
      throw new Error(`Failed to update poll: ${pollUpdateError.message}`);
    }
    
    // Get existing options to compare
    const { data: existingOptions, error: optionsError } = await supabase
      .from('poll_options')
      .select('id, text')
      .eq('poll_id', data.id);
    
    if (optionsError) {
      throw new Error(`Failed to fetch poll options: ${optionsError.message}`);
    }
    
    // Create a map of existing options by text for easy lookup
    const existingOptionsMap = new Map();
    existingOptions?.forEach(option => {
      existingOptionsMap.set(option.text, option.id);
    });
    
    // Determine which options to add, update, or delete
    const optionsToAdd = [];
    const optionsToKeep = [];
    
    for (const option of data.options) {
      const existingId = existingOptionsMap.get(option.text);
      if (existingId) {
        // Option already exists, keep it
        optionsToKeep.push(existingId);
      } else {
        // New option to add
        optionsToAdd.push({
          poll_id: data.id,
          text: option.text,
        });
      }
    }
    
    // Add new options
    if (optionsToAdd.length > 0) {
      const { error: addOptionsError } = await supabase
        .from('poll_options')
        .insert(optionsToAdd);
      
      if (addOptionsError) {
        throw new Error(`Failed to add poll options: ${addOptionsError.message}`);
      }
    }
    
    // Delete options that are no longer needed
    const optionsToDelete = existingOptions
      ?.filter(option => !optionsToKeep.includes(option.id))
      .map(option => option.id);
    
    if (optionsToDelete && optionsToDelete.length > 0) {
      const { error: deleteOptionsError } = await supabase
        .from('poll_options')
        .delete()
        .in('id', optionsToDelete);
      
      if (deleteOptionsError) {
        throw new Error(`Failed to delete poll options: ${deleteOptionsError.message}`);
      }
    }
    
    // Revalidate the polls page and dashboard
    revalidatePath('/polls');
    revalidatePath('/dashboard');
    revalidatePath(`/polls/${data.id}`);
    
    return { success: true, pollId: data.id };
  } catch (error) {
    console.error('Error updating poll:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}