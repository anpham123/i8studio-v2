const urlsToTest = [
  // 10 deleted URLs + 1 garbage
  { url: 'http://localhost:3000/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool', expected: '410' },
  { url: 'http://localhost:3000/en/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool', expected: '410' },
  { url: 'http://localhost:3000/en/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city', expected: '410' },
  { url: 'http://localhost:3000/kudochi-sauna', expected: '410' },
  { url: 'http://localhost:3000/apa-hotel', expected: '410' },
  { url: 'http://localhost:3000/hiroshima-gate-park-taisei-design-planners-architects-engineers', expected: '410' },
  { url: 'http://localhost:3000/neko-house', expected: '410' },
  { url: 'http://localhost:3000/hotel-lobby', expected: '410' },
  { url: 'http://localhost:3000/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto', expected: '410' },
  { url: 'http://localhost:3000/club', expected: '410' },
  { url: 'http://localhost:3000/l465rgyua3', expected: '410' },
  // Service redirects (301)
  { url: 'http://localhost:3000/service/3d-animation', expected: '301' },
  { url: 'http://localhost:3000/animation', expected: '301' },
  { url: 'http://localhost:3000/service/3dcg-visualization', expected: '301' },
  { url: 'http://localhost:3000/pachinko-slot', expected: '301' },
  { url: 'http://localhost:3000/pachinko-slot-qbc3ph24gt', expected: '301' },
  { url: 'http://localhost:3000/cg', expected: '301' },
  { url: 'http://localhost:3000/bim', expected: '301' },
  { url: 'http://localhost:3000/blog-2', expected: '301' },
  { url: 'http://localhost:3000/vr', expected: '301' },
  { url: 'http://localhost:3000/3dcg', expected: '301' },
  { url: 'http://localhost:3000/en/animation', expected: '301' },
  { url: 'http://localhost:3000/en/3d-cg', expected: '301' },
  { url: 'http://localhost:3000/vr-rcxsqfh3zc', expected: '301' },
  { url: 'http://localhost:3000/en/3dcg', expected: '301' },
  { url: 'http://localhost:3000/anime', expected: '301' },
];

async function run() {
  console.log('=== VERIFYING GSC URLS RESPONSES ===\n');
  for (const item of urlsToTest) {
    try {
      const res = await fetch(item.url, { redirect: 'manual' });
      const status = res.status;
      const loc = res.headers.get('location') || '';
      const path = item.url.replace('http://localhost:3000', '');
      console.log(`[${status}] ${path} ${loc ? '-> ' + loc : ''}`);
    } catch (e) {
      console.error('Error fetching', item.url, e.message);
    }
  }
}

run();
