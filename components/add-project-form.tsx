'use client';

import { useState } from 'react';
import { createProject } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AddProjectForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createProject(formData);
    setLoading(false);

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      const form = document.getElementById('project-form') as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>Upload a new project to your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="project-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_link">Demo Link (Optional)</Label>
            <Input
              id="demo_link"
              name="demo_link"
              type="url"
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
