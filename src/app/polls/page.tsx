import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What programming language do you prefer to use?',
    votes: 42,
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you think is the best?',
    votes: 38,
    createdAt: '2023-06-10',
  },
  {
    id: '3',
    title: 'Remote Work Preference',
    description: 'Do you prefer working remotely or in an office?',
    votes: 56,
    createdAt: '2023-06-05',
  },
];

export default function PollsPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Link key={poll.id} href={`/polls/${poll.id}`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>Created on {poll.createdAt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{poll.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{poll.votes} votes</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {mockPolls.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No polls found</h3>
          <p className="text-muted-foreground mb-6">Create your first poll to get started</p>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}