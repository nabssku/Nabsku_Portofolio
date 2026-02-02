import { getProjects } from '@/actions/dashboard';
import { ProjectCard } from '@/components/project-card';
import { Navbar } from '@/components/navbar';
import { getUser } from '@/actions/auth';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { data: projects } = await getProjects();
  const user = await getUser();

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={!!user} />

      <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Full Stack Developer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Building modern web applications with cutting-edge technologies
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:hello@example.com">
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Featured Projects</h2>
          <p className="text-muted-foreground text-center mb-12">
            Check out some of my recent work
          </p>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image_url={project.image_url}
                  demo_link={project.demo_link}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No projects yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto max-w-6xl px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
