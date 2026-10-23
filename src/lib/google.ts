// Google Business Profile details, copied from the live listing:
// https://maps.google.com/?cid=7685319039278750006
// Update the rating, review count and reviews when they change on Google; keep them
// identical to the listing (never round up or invent figures).

export const GOOGLE_PROFILE = {
  rating: 5.0,
  reviewCount: 5,
  checkedOn: '23 October 2026',
  /** Opens the listing on Google Maps. */
  mapsUrl: 'https://maps.google.com/?cid=7685319039278750006',
  /** Opens the listing straight on its Reviews tab, where "Write a review" sits. */
  reviewsUrl:
    'https://www.google.com/maps/place/Nasuru+Interiors/@6.5364239,3.3519931,17z/data=!4m8!3m7!1s0x103b8d1cd0ecdb5f:0x6aa7bcf299c19936!8m2!3d6.5364239!4d3.3519931!9m1!1b1',
  lat: 6.5364239,
  lng: 3.3519931,
  /** Name + street as Google lists them, so the map embed resolves to the business pin. */
  mapsQuery: 'Nasuru Interiors, 15 Silver St, Mushin, Lagos',
};

/** Opening hours as listed on Google (24h, Lagos time). */
export const OPENING_HOURS = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opens: '08:00',
  closes: '18:00',
  label: 'Monday to Saturday, 8am to 6pm. Closed on Sunday.',
};

/** Selected Google reviews, quoted as written (emoji removed). Surname shortened to an initial. */
export const GOOGLE_REVIEWS: { author: string; text: string; when: string }[] = [
  {
    author: 'Akachukwu K.',
    text: 'Exceptional service, attention to details and patient with my imagination and in the end satisfactory.',
    when: 'October 2026',
  },
  {
    author: 'Nmesoma E.',
    text: 'I got a marble sheet for my house and honestly I loved it so much… the color and thickness was topnotch.',
    when: 'October 2026',
  },
  {
    author: 'Chibuzo M.',
    text: "Supplied this and I really love it. I'll post the finishing later. Thumbs up to the team at Nasuru",
    when: 'October 2026',
  },
];
