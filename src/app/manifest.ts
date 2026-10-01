import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nasuru Interios',
    short_name: 'Nasuru',
    description:
      'Interior deco supply: curtains, wallpapers, wall panels, flooring, lighting and decor accessories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f6fa',
    theme_color: '#2F5D8C',
    icons: [],
  };
}
