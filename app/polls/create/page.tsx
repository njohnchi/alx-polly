'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function CreatePollPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState(['', '']);

  // Add a new option field
  const addOption = () => {
    setOptions([...options, '']);
  };

  // Remove an option field
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Update option value
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // This is a placeholder for the actual poll creation functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate poll creation process
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/polls');
    }, 1000);
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/polls">
          <Button variant="outline" size="sm">
            ← Back to Polls
          </Button>
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create a new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="title">Poll Title</FormLabel>
              <Input 
                id="title" 
                placeholder="Enter a question for your poll" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="description">Description (Optional)</FormLabel>
              <Input 
                id="description" 
                placeholder="Add more context to your question" 
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
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
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeOption(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
              <Input 
                id="endDate" 
                type="date" 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}