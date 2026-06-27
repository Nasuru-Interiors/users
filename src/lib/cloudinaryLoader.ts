// Custom next/image loader — offloads resizing/format to Cloudinary's CDN
// (f_auto = AVIF/WebP, q_auto = perceptual quality, w_<width> = responsive).
// This keeps optimization off Vercel's image pipeline and on Cloudinary's edge,
// while still letting next/image emit srcset + a preload for priority images.
interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  if (!src || !src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src;
  }
  const params = [
    'f_auto',
    `q_${quality || 'auto'}`,
    `w_${width}`,
    'c_limit',
    'dpr_auto',
  ].join(',');
  return src.replace('/upload/', `/upload/${params}/`);
}
