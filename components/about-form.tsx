'use client';

import { useState } from 'react';
import { createAbout } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AboutForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createAbout(formData);
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
        description: 'About section updated successfully',
      });
      const form = document.getElementById('about-form') as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit About Section</CardTitle>
        <CardDescription>Update your bio and profile photo</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="about-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Photo (Optional)</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update About'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
