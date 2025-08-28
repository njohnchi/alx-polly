import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What programming language do you prefer to work with?',
    options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
    votes: 42,
    createdAt: '2023-10-15',
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you think is the best?',
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    votes: 38,
    createdAt: '2023-10-18',
  },
  {
    id: '3',
    title: 'Remote Work Preference',
    description: 'Do you prefer working remotely or in an office?',
    options: ['Remote', 'Office', 'Hybrid'],
    votes: 56,
    createdAt: '2023-10-20',
  },
];

export default function PollsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {poll.options.length} options • {poll.votes} votes
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(poll.createdAt).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}