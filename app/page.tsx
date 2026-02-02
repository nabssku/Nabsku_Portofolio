import { getProjects, getAbout, getSkills, getExperiences, getSocialLinks, getSeo } from '@/actions/dashboard';
import { ProjectCard } from '@/components/project-card';
import { Navbar } from '@/components/navbar';
import { getUser } from '@/actions/auth';
import { Github, Linkedin, Mail, Code, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { data: seo } = await getSeo();

  const title = seo?.title || 'Portfolio - Full Stack Developer';
  const description = seo?.description || 'Experienced full stack developer specializing in React, Node.js, and modern web technologies';
  const keywords = seo?.keywords || 'web development, react, nodejs, portfolio';
  const ogImage = seo?.og_image || '/og-image.jpg'; // fallback image

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: seo?.twitter_card === 'summary_large_image' ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function Home() {
  const { data: projects } = await getProjects();
  const { data: about } = await getAbout();
  const { data: skills } = await getSkills();
  const { data: experiences } = await getExperiences();
  const { data: socialLinks } = await getSocialLinks();
  const user = await getUser();

  const getSocialIcon = (platform: string, icon?: string | null) => {
    if (icon) {
      // If custom icon is specified, use it (assuming it's a Lucide icon name)
      const IconComponent = require('lucide-react')[icon] || Github;
      return IconComponent;
    }

    // Default icons based on platform
    switch (platform.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return require('lucide-react').Twitter;
      case 'instagram':
        return require('lucide-react').Instagram;
      case 'facebook':
        return require('lucide-react').Facebook;
      case 'youtube':
        return require('lucide-react').Youtube;
      case 'dribbble':
        return require('lucide-react').Dribbble;
      case 'behance':
        return require('lucide-react').Behance;
      case 'medium':
        return require('lucide-react').BookOpen;
      case 'dev.to':
        return Code;
      case 'email':
        return Mail;
      case 'website':
        return require('lucide-react').Globe;
      default:
        return require('lucide-react').ExternalLink;
    }
  };

  const getSocialLabel = (platform: string, url: string) => {
    if (platform.toLowerCase() === 'email') {
      return 'Contact';
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={!!user} />

      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-pulse" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient-x">
              Nabil Sahsada Suratno - Full Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Tetap berkembang dan berinovasi di dunia teknologi dengan portofolio saya.
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((link) => {
                const IconComponent = getSocialIcon(link.platform, link.icon);
                const label = getSocialLabel(link.platform, link.url);
                const isExternal = !link.url.startsWith('mailto:');

                return (
                  <Button key={link.id} variant="outline" size="lg" asChild>
                    <a
                      href={link.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <IconComponent className="mr-2 h-5 w-5" />
                      {label}
                    </a>
                  </Button>
                );
              })
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {about && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={about.photo_url || undefined} alt="Profile" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">About Me</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {about.bio}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Code className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Skills & Technologies</h2>
              <p className="text-muted-foreground">
                Technologies I work with
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-4 py-2 text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {experiences && experiences.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
              <p className="text-muted-foreground">
                My professional journey
              </p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

              <div className="space-y-12">
                {experiences.map((experience, index) => (
                  <div key={experience.id} className="relative flex items-start gap-8">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                      <Briefcase className="h-8 w-8 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="mb-2 md:mb-0">
                          <h3 className="text-xl font-bold text-foreground mb-1">{experience.title}</h3>
                          <p className="text-primary font-semibold text-lg">{experience.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                          {new Date(experience.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {experience.end_date ? new Date(experience.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
