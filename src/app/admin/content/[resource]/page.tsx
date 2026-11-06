import { notFound } from 'next/navigation';
import ContentManager from '@/components/admin/ContentManager';
import { CMS_RESOURCES } from '@/lib/cms-config';

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  if (!CMS_RESOURCES[resource]) notFound();
  return <ContentManager resourceName={resource} />;
}
