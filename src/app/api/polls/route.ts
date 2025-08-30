import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { title, description, options } = await request.json();
    
    // Validate input
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Invalid poll data. Title and at least 2 options are required.' },
        { status: 400 }
      );
    }
    
    // Start a transaction
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        created_by: session.user.id,
      })
      .select('id')
      .single();
    
    if (pollError) {
      console.error('Error creating poll:', pollError);
      return NextResponse.json(
        { error: 'Failed to create poll' },
        { status: 500 }
      );
    }
    
    // Insert poll options
    const pollOptions = options.map((option: string, index: number) => ({
      poll_id: poll.id,
      text: option,
      position: index + 1,
    }));
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);
    
    if (optionsError) {
      console.error('Error creating poll options:', optionsError);
      return NextResponse.json(
        { error: 'Failed to create poll options' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      pollId: poll.id,
      message: 'Poll created successfully',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  try {
    let query = supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_at,
        created_by,
        poll_options (id, text)
      `);
    
    // Filter by user if userId is provided
    if (userId) {
      query = query.eq('created_by', userId);
    }
    
    // Only return public polls if not filtered by user
    if (!userId) {
      query = query.eq('is_public', true);
    }
    
    const { data: polls, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching polls:', error);
      return NextResponse.json(
        { error: 'Failed to fetch polls' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}