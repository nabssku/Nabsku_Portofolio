'use client';

import { useState, useEffect } from 'react';
import { updateProject } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  demo_link: string | null;
  created_at: string;
}

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    demo_link: project.demo_link || '',
  });
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      title: project.title,
      description: project.description,
      demo_link: project.demo_link || '',
    });
  }, [project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('id', project.id);
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('demo_link', formData.demo_link);

    // Add image if selected (optional for edit)
    const imageInput = document.getElementById('edit-image') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      submitData.append('image', imageInput.files[0]);
    }

    const result = await updateProject(submitData);
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
        description: 'Project updated successfully',
      });
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Project Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-demo_link">Demo Link (Optional)</Label>
            <Input
              id="edit-demo_link"
              value={formData.demo_link}
              onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
              type="url"
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Project Image (Optional)</Label>
            <Input
              id="edit-image"
              type="file"
              accept="image/*"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to keep current image
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
