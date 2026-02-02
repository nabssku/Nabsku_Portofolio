'use client';

import { deleteShortLink } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShortLink {
  id: string;
  slug: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

interface ShortLinksTableProps {
  links: ShortLink[];
}

export function ShortLinksTable({ links }: ShortLinksTableProps) {
  const { toast } = useToast();

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'Short link copied to clipboard',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this short link?')) {
      const result = await deleteShortLink(id);
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Short link deleted successfully',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Short Links</CardTitle>
        <CardDescription>Manage your short links and track clicks</CardDescription>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No short links yet. Create your first one above!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-mono">/{link.slug}</TableCell>
                  <TableCell>
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <span className="truncate max-w-xs">{link.original_url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>{link.clicks}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(link.slug)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
