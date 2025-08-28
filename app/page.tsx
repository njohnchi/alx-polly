import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Polly</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Create and share polls with your friends, colleagues, or the world.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Create Polls</CardTitle>
              <CardDescription>
                Easily create custom polls with multiple options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Design polls with customizable options, set end dates, and share them instantly.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vote & Share</CardTitle>
              <CardDescription>
                Vote on polls and share results in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cast your vote on any poll and see results update instantly. Share polls with anyone.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="lg">Register</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
