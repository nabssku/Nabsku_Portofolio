import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image_url: string;
  demo_link?: string | null;
}

export function ProjectCard({ title, description, image_url, demo_link }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 bg-background/80 backdrop-blur-sm border-border/50">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0 flex gap-2">
        {demo_link && (
          <Button asChild variant="default" size="sm" className="flex-1">
            <a href={demo_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Demo
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" className="flex-1">
          <Github className="mr-2 h-4 w-4" />
          View Code
        </Button>
      </CardFooter>
    </Card>
  );
}
