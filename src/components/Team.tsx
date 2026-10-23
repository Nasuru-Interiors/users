import Image from 'next/image';
import type { AboutContent } from '@/lib/types';

/** "Meet the team" cards from the About content managed in the admin. Hidden when empty. */
export default function Team({
  team,
  heading = 'Meet the Team',
  className = 'bg-white',
}: {
  team: AboutContent['team'];
  heading?: string;
  className?: string;
}) {
  const members = (team || []).filter((m) => m.name?.trim());
  if (!members.length) return null;

  return (
    <section className={`py-20 ${className}`}>
      <div className="mx-auto max-w-content px-5">
        <div className="mb-10 text-center">
          <span className="eyebrow justify-center">Our People</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">{heading}</h2>
        </div>
        <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <li key={m.name} className="border border-brand-ink/8 bg-white text-center shadow-soft">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-bg">
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-serif text-5xl font-semibold text-brand-primary/40">
                    {m.name.trim().charAt(0)}
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className="font-serif text-xl font-semibold text-brand-ink">{m.name}</p>
                {m.role && <p className="mt-1 text-sm text-brand-muted">{m.role}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
