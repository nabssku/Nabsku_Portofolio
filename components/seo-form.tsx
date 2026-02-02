'use client';

import { useState, useEffect } from 'react';
import { createSeo, getSeo } from '@/actions/dashboard';
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
  const [seoData, setSeoData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    twitter_card: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    async function loadSeoData() {
      try {
        const result = await getSeo();
        if (result.data) {
          setSeoData(result.data);
          setFormData({
            title: result.data.title || '',
            description: result.data.description || '',
            keywords: result.data.keywords || '',
            twitter_card: result.data.twitter_card || '',
          });
        }
      } catch (error) {
        console.error('Failed to load SEO data:', error);
      } finally {
        setLoadingData(false);
      }
    }
    loadSeoData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('keywords', formData.keywords);
    submitFormData.append('twitter_card', formData.twitter_card);

    // Handle file input
    const fileInput = document.getElementById('og_image') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      submitFormData.append('og_image', fileInput.files[0]);
    }

    const result = await createSeo(submitFormData);
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
      // Reload data after successful update
      const updatedResult = await getSeo();
      if (updatedResult.data) {
        setSeoData(updatedResult.data);
        setFormData({
          title: updatedResult.data.title || '',
          description: updatedResult.data.description || '',
          keywords: updatedResult.data.keywords || '',
          twitter_card: updatedResult.data.twitter_card || '',
        });
      }
      // Reset file input
      if (fileInput) fileInput.value = '';
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>Manage meta tags and social media previews</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Your Portfolio - Full Stack Developer"
              required
              disabled={loadingData}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Experienced full stack developer specializing in React, Node.js, and modern web technologies..."
              required
              rows={3}
              disabled={loadingData}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              placeholder="web development, react, nodejs, portfolio"
              disabled={loadingData}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og_image">Open Graph Image (Optional)</Label>
            <Input
              id="og_image"
              type="file"
              accept="image/*"
              disabled={loadingData}
            />
            {seoData?.og_image && (
              <p className="text-sm text-muted-foreground">
                Current image: {seoData.og_image.split('/').pop()}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Recommended: 1200x630px for best social media sharing
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_card">Twitter Card Type (Optional)</Label>
            <Select
              value={formData.twitter_card}
              onValueChange={(value) => handleInputChange('twitter_card', value)}
              disabled={loadingData}
            >
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
