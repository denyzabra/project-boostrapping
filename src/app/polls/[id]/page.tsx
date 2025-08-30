'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for a poll
const mockPoll = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What programming language do you prefer to use?',
  createdAt: '2023-06-15',
  options: [
    { id: '1', text: 'JavaScript', votes: 15 },
    { id: '2', text: 'Python', votes: 12 },
    { id: '3', text: 'TypeScript', votes: 8 },
    { id: '4', text: 'Java', votes: 5 },
    { id: '5', text: 'C#', votes: 2 },
  ],
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [poll, setPoll] = useState(mockPoll);

  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (!selectedOption) return;

    // Update the poll with the new vote
    const updatedOptions = poll.options.map(option => {
      if (option.id === selectedOption) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    setPoll({ ...poll, options: updatedOptions });
    setHasVoted(true);
  };

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/polls" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to Polls
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>Created on {poll.createdAt}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{poll.description}</p>

          <div className="space-y-4">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center">
                    {!hasVoted ? (
                      <input
                        type="radio"
                        id={option.id}
                        name="poll-option"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="mr-2"
                      />
                    ) : null}
                    <label htmlFor={option.id} className="flex-1">
                      {option.text}
                    </label>
                    {hasVoted && (
                      <span className="text-sm font-medium">{percentage}% ({option.votes} votes)</span>
                    )}
                  </div>
                  
                  {hasVoted && (
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          {!hasVoted ? (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
              className="w-full"
            >
              Vote
            </Button>
          ) : (
            <div className="w-full text-center">
              <p className="text-muted-foreground mb-2">Thank you for voting!</p>
              <p className="text-sm">Total votes: {totalVotes}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}