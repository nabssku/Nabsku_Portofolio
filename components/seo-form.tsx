'use client';

import { useState } from 'react';
import { createSeo } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function SeoForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createSeo(formData);
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
        description: 'SEO settings updated successfully',
      });
      const form = document.getElementById('seo-form') as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>Manage meta tags and social media previews</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="seo-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Your Portfolio - Full Stack Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Experienced full stack developer specializing in React, Node.js, and modern web technologies..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="web development, react, nodejs, portfolio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og_image">Open Graph Image (Optional)</Label>
            <Input
              id="og_image"
              name="og_image"
              type="file"
              accept="image/*"
            />
            <p className="text-sm text-muted-foreground">
              Recommended: 1200x630px for best social media sharing
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_card">Twitter Card Type (Optional)</Label>
            <Select name="twitter_card">
              <SelectTrigger>
                <SelectValue placeholder="Select Twitter card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update SEO Settings'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
