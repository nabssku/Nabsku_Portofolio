import { redirect } from 'next/navigation';
import { incrementClickAndGetUrl } from '@/actions/shortener';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ShortLinkRedirect({ params }: PageProps) {
  const { slug } = params;

  const originalUrl = await incrementClickAndGetUrl(slug);

  if (originalUrl) {
    redirect(originalUrl);
  } else {
    redirect('/');
  }
}
