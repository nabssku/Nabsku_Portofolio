# Portfolio Website with Link Shortener

A production-ready portfolio website with an integrated link shortener and admin dashboard built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## Features

### Public Portfolio
- Responsive grid layout showcasing projects
- Hero section with social links
- Dark/Light mode toggle
- SEO-optimized metadata
- Beautiful, modern design

### Link Shortener
- Create custom short links
- Track click analytics
- Copy short links to clipboard
- Redirect tracking with automatic click counting

### Admin Dashboard
- Protected route with authentication
- Project management (upload with images to Supabase Storage)
- Link shortener management
- Dashboard statistics (projects, links, total clicks)
- Real-time data updates

### Security
- Row Level Security (RLS) policies
- Protected admin routes
- Secure authentication with Supabase Auth
- Middleware-based route protection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Icons**: Lucide React
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **State/Auth**: @supabase/ssr
- **Theme**: next-themes

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Git installed

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Create a storage bucket named `portfolio`:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `portfolio`
   - Make it public

3. The database tables (`projects` and `short_links`) are already created via migrations

4. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Choose "Create new user"
   - Enter email and password
   - Save the credentials for login

### 2. Environment Variables

The `.env` file is already configured with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://luydrlyxzirzpwdybchc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio.

### 5. Access Admin Dashboard

1. Navigate to `/login`
2. Enter your admin credentials (created in Supabase)
3. Access the dashboard at `/dashboard`

## Project Structure

```
├── actions/
│   ├── auth.ts           # Authentication server actions
│   ├── dashboard.ts      # Dashboard CRUD operations
│   └── shortener.ts      # Link shortener logic
├── app/
│   ├── [slug]/          # Dynamic route for short links
│   ├── dashboard/       # Admin dashboard page
│   ├── login/           # Login page
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Public portfolio homepage
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── navbar.tsx       # Navigation component
│   ├── project-card.tsx # Project display card
│   ├── stats-card.tsx   # Dashboard statistics card
│   ├── add-project-form.tsx
│   ├── add-short-link-form.tsx
│   └── short-links-table.tsx
├── lib/
│   └── supabase/        # Supabase client configurations
│       ├── client.ts    # Browser client
│       ├── server.ts    # Server client
│       └── middleware.ts # Middleware helper
└── middleware.ts        # Route protection
```

## Database Schema

### Projects Table
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `image_url` (text)
- `demo_link` (text, nullable)
- `created_at` (timestamptz)

### Short Links Table
- `id` (uuid, primary key)
- `slug` (text, unique)
- `original_url` (text)
- `clicks` (integer)
- `created_at` (timestamptz)

## Usage

### Adding Projects
1. Login to the dashboard
2. Fill in the "Add New Project" form
3. Upload an image (stored in Supabase Storage)
4. Add title, description, and optional demo link
5. Submit to publish

### Creating Short Links
1. Login to the dashboard
2. Enter a custom slug (e.g., "my-link")
3. Enter the target URL
4. Submit to create
5. Access via `yourdomain.com/my-link`

### Tracking Analytics
- View total clicks on the dashboard
- See individual link performance in the short links table
- Clicks are automatically tracked when users visit short links

## Security Features

### Row Level Security (RLS)
- Public SELECT access for viewing projects and links
- Authenticated-only INSERT/UPDATE/DELETE operations
- Click increments bypass RLS using service role

### Route Protection
- Middleware protects `/dashboard` routes
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`

### Authentication
- Secure email/password authentication
- Session management with cookies
- Server-side auth validation

## Deployment

### Recommended: Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

### Alternative: Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Customization

### Hero Section
Edit `app/page.tsx` to customize:
- Your name/title
- Description
- Social links

### Styling
- Modify `app/globals.css` for global styles
- Use Tailwind classes for component styling
- Theme colors in `tailwind.config.ts`

### Metadata
Edit `app/layout.tsx` for:
- Page title
- Description
- Open Graph images

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Authentication Issues
- Verify Supabase credentials in `.env`
- Check user exists in Supabase dashboard
- Clear browser cookies and try again

### Storage Issues
- Ensure `portfolio` bucket exists and is public
- Check bucket permissions in Supabase dashboard

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
