import { prisma } from "@/lib/prisma";

export type ContentBlock = {
  key: string;
  title: string | null;
  body: string | null;
  imagePath: string | null;
  videoUrl: string | null;
};

export async function getContent(key: string): Promise<ContentBlock | null> {
  const c = await prisma.siteContent.findUnique({ where: { key } });
  if (!c) return null;
  return { key: c.key, title: c.title, body: c.body, imagePath: c.imagePath, videoUrl: c.videoUrl };
}
