import { getDashboardStats, getShortLinks } from '@/actions/dashboard';
import { StatsCard } from '@/components/stats-card';
import { AddProjectForm } from '@/components/add-project-form';
import { AddShortLinkForm } from '@/components/add-short-link-form';
import { ShortLinksTable } from '@/components/short-links-table';
import { Navbar } from '@/components/navbar';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { FolderKanban, Link2, MousePointerClick, LogOut } from 'lucide-react';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const { data: shortLinks } = await getShortLinks();

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={true} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio and short links</p>
          </div>
          <form action={logout}>
            <Button variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Total Projects"
            value={stats.projectsCount}
            icon={FolderKanban}
            description="Published projects"
          />
          <StatsCard
            title="Short Links"
            value={stats.linksCount}
            icon={Link2}
            description="Active short links"
          />
          <StatsCard
            title="Total Clicks"
            value={stats.totalClicks}
            icon={MousePointerClick}
            description="Across all links"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <AddProjectForm />
          <AddShortLinkForm />
        </div>

        <ShortLinksTable links={shortLinks || []} />
      </div>
    </div>
  );
}
