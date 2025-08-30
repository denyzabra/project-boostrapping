'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PollOption {
  id: string;
  text: string;
}

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options required
    setOptions(options.filter(option => option.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(
      options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    
    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Send data to our API endpoint
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          options: validOptions.map(option => option.text.trim()),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create poll');
      }
      
      // Redirect to the newly created poll
      router.push(`/polls/${data.pollId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the poll');
      console.error('Error creating poll:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/polls" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to Polls
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create a new poll
          </CardDescription>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mt-4">
              {error}
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Poll Title</label>
              <Input
                id="title"
                placeholder="Enter your question"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
              <Input
                id="description"
                placeholder="Add more context to your question"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Poll Options</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </div>
              
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOptionText(option.id, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}