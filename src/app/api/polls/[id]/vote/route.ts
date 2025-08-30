import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const pollId = params.id;
  
  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();
  
  try {
    const { optionId } = await request.json();
    
    // Validate input
    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the option belongs to the specified poll
    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();
    
    if (optionError || !option) {
      return NextResponse.json(
        { error: 'Invalid poll option' },
        { status: 400 }
      );
    }
    
    // Get client IP address for anonymous voting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Check if user has already voted on this poll
    if (session) {
      const { data: existingVote, error: voteCheckError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', session.user.id)
        .single();
      
      if (existingVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ option_id: optionId })
          .eq('id', existingVote.id);
        
        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          message: 'Vote updated successfully',
        });
      }
    } else {
      // For anonymous users, check by IP address
      const { data: existingVote, error: voteCheckError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .single();
      
      if (existingVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ option_id: optionId })
          .eq('id', existingVote.id);
        
        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          message: 'Vote updated successfully',
        });
      }
    }
    
    // Create new vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: session?.user?.id || null,
        ip_address: session ? null : ipAddress, // Only store IP for anonymous votes
      });
    
    if (voteError) {
      console.error('Error creating vote:', voteError);
      return NextResponse.json(
        { error: 'Failed to record vote' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const pollId = params.id;
  
  try {
    // Get poll results using the custom function
    const { data: results, error } = await supabase
      .rpc('get_poll_results', { poll_uuid: pollId });
    
    if (error) {
      console.error('Error fetching poll results:', error);
      return NextResponse.json(
        { error: 'Failed to fetch poll results' },
        { status: 500 }
      );
    }
    
    // Get poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, title, description, created_at, created_by')
      .eq('id', pollId)
      .single();
    
    if (pollError) {
      console.error('Error fetching poll details:', pollError);
      return NextResponse.json(
        { error: 'Failed to fetch poll details' },
        { status: 500 }
      );
    }
    
    // Calculate total votes
    const totalVotes = results.reduce((sum: number, option: any) => sum + option.vote_count, 0);
    
    // Add percentage to each option
    const resultsWithPercentage = results.map((option: any) => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0,
    }));
    
    return NextResponse.json({
      poll,
      results: resultsWithPercentage,
      totalVotes,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}