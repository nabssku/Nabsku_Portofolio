'use client';

import { useState } from 'react';
import { createShortLink } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AddShortLinkForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createShortLink(formData);
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
        description: 'Short link created successfully',
      });
      const form = document.getElementById('link-form') as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
        <CardDescription>Create a custom short link for any URL</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="link-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="my-link"
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens"
            />
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_url">Target URL</Label>
            <Input
              id="original_url"
              name="original_url"
              type="url"
              placeholder="https://example.com"
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
              'Create Link'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
