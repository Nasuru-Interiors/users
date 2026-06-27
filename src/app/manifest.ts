import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'First Choice Roofing Services',
    short_name: 'First Choice',
    description:
      "Lagos, Nigeria's leading supplier of premium aluminium roofing sheets.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E10600',
    icons: [],
  };
}
