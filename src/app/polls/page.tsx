'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
  option_count: number;
  vote_count: number;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true);
        const url = filter === 'my' ? '/api/polls?mine=true' : '/api/polls';
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }
        
        const data = await response.json();
        setPolls(data.polls);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching polls');
        console.error('Error fetching polls:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPolls();
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Polls
          </Button>
          <Button 
            variant={filter === 'my' ? 'default' : 'outline'}
            onClick={() => setFilter('my')}
          >
            My Polls
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No polls found</h3>
          <p className="text-muted-foreground mb-6">
            {filter === 'my' ? 'You haven\'t created any polls yet.' : 'There are no polls available.'}
          </p>
          <Link href="/polls/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Link href={`/polls/${poll.id}`} key={poll.id} className="block h-full">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                  <CardDescription>
                    Created on {formatDate(poll.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {poll.description && (
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {poll.description}
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>{poll.option_count} options</span>
                    <span>{poll.vote_count} votes</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}