
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to view your polls' }, { status: 401 });
  }

  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (pollsError) {
    return NextResponse.json({ error: `Failed to fetch polls: ${pollsError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, polls });
}
