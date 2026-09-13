/**
 * Dynamic module route — renders any module in content/modules/ from data.
 * Lives ALONGSIDE the ten hand-built app/learn/<name>/ folders: Next.js
 * always prefers a static folder over [slug], so existing modules are
 * untouched. New-series modules exist only as JSON and land here.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listModuleSlugs, loadModule } from "../../../lib/load-module";
import ModulePlayer from "../../../components/module/module-player";

export function generateStaticParams() {
  return listModuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = loadModule(slug);
  if (!data) return {};
  return {
    metadataBase: new URL("https://www.operationsdecoded.com"),
    title: `${data.module.title} — Operations Decoded`,
    description: data.module.seo.description,
    openGraph: data.module.seo.ogImage ? { images: [data.module.seo.ogImage] } : undefined,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = loadModule(slug);
  if (!data) notFound();
  return <ModulePlayer module={data.module} company={data.company} />;
}
