import React from 'react';
import RegionPage from './RegionPage';
import TemiTeaGarden from '../../assets/South Sikkim/TemiTeaGarden.jpg';
import Namchi from '../../assets/South Sikkim/Namchi.jpg';
import South1 from '../../assets/South1.jpg';
import MaenamHill from '../../assets/South Sikkim/MaenamHill.jpg';

const destinations = [
  {
    id: 1,
    name: 'Temi Tea Garden',
    description:
      'Temi Tea Garden is the only tea estate in Sikkim, located near Namchi at 1,525 m. Established in 1969, it is certified organic and exports premium Sikkim First Flush and Second Flush teas worldwide. Set against the backdrop of the Kanchenjunga range, the terraced gardens offer scenic walks and an insight into artisan tea processing.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Temi2.png',
    image2: TemiTeaGarden,
    highlights1: ['Only organic tea garden in Sikkim', 'Panoramic views of Kanchenjunga range', 'Traditional tea processing methods observed', 'Guided tours available for visitors', 'Fresh mountain air enhances experience'],
    highlights2: ['Tea tasting sessions with local varieties', 'Photography opportunities in lush plantations', 'Peaceful walking trails through gardens', 'Local workers demonstrate plucking techniques', 'Best visited during harvesting season (Oct–Nov)'],
  },
  {
    id: 2,
    name: 'Char Dham, Namchi',
    description:
      'The Char Dham complex at Solophok Hill near Namchi is a remarkable spiritual site replicating India\'s four holy shrines Badrinath, Dwarka, Puri Jagannath, and Rameshwaram with an imposing 87-ft Shiva statue crowning the summit. It offers 360° panoramic valley views and attracts pilgrims from across India.',
    image1: Namchi,
    image2: 'https://glacialtravels.com/Travel/southsikkim/2.png',
    highlights1: ['Replica of India\'s four sacred pilgrimage sites', '87-foot tall statue of Lord Shiva at summit', '360-degree panoramic valley views', 'Architectural marvel with intricate stone details', 'Spiritual ambiance ideal for meditation'],
    highlights2: ['Cable car access to main complex available', 'Prayer halls with peaceful atmosphere', 'Religious ceremonies held regularly', 'Pilgrims from across India visit', 'Best views during clear weather days'],
  },
  {
    id: 3,
    name: 'Buddha Park (Tathagata Tsal)',
    description:
      'Buddha Park at Ravangla features a majestic 130-ft bronze statue of Buddha, consecrated by the 14th Dalai Lama in 2013. Set amidst beautifully landscaped gardens and the serene Cho-Djo lake, this site offers a tranquil spiritual experience and sweeping views of the Himalayan ranges.',
    image1: South1,
    image2: 'https://glacialtravels.com/Travel/southsikkim/Buddha.png',
    highlights1: ['130-feet tall bronze Buddha statue', 'Consecrated by 14th Dalai Lama in 2013', 'Beautiful landscaped gardens surrounding', 'Cho-Djo lake adds to scenic beauty', 'Peaceful meditation spots available'],
    highlights2: ['Prayer wheels line the pathway', 'Stunning views of Himalayan peaks', 'Cultural centre with Buddhist artifacts', 'Ideal for spiritual retreats', 'Photography restricted in certain areas'],
  },
  {
    id: 4,
    name: 'Samdruptse Guru Padmasambhava Statue',
    description:
      'Samdruptse Hill in Namchi is home to the tallest statue of Guru Padmasambhava (Guru Rinpoche) in the world, standing at 135 ft. The statue overlooks the entire Namchi valley and distant Himalayas. It is a key pilgrimage site for Buddhists and one of the most photographed landmarks in South Sikkim.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Samdruptse2.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Samdruptse.png',
    highlights1: ["135-feet tall Guru Padmasambhava statue", "World's tallest statue of Guru Rinpoche", "Panoramic views of entire South Sikkim", "Sacred site for Buddhist pilgrims", "Colourful prayer flags flutter around"],
    highlights2: ['Accessible via well-maintained roads', 'Small temple complex at base', 'Sunrise and sunset views spectacular', 'Local vendors sell religious items', 'Peaceful environment for prayers and reflection'],
  },
  {
    id: 5,
    name: 'Maenam Hill & Wildlife Sanctuary',
    description:
      'Maenam Hill (3,235 m) is part of the Maenam Wildlife Sanctuary and is one of the finest trekking destinations in South Sikkim. The dense forest is home to red pandas, Himalayan black bears, and over 200 bird species. The summit offers a sweeping 360° view of the Kangchenjunga range.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Menaam.png',
    image2: MaenamHill,
    highlights1: ['Part of Maenam Wildlife Sanctuary', 'Rich biodiversity with rare species', 'Trekking trails through dense forests', 'Panoramic views from 3,235 m summit', 'Cool climate throughout the year'],
    highlights2: ['Red panda sightings possible', 'Over 200 bird species documented', 'Rhododendrons bloom in spring season', 'Camping spots for overnight stays', 'Local guides provide forest insights'],
  },
  {
    id: 6,
    name: 'Ralong Monastery',
    description:
      'Ralong Monastery, established in 1768 and rebuilt in 1768, is one of the oldest Buddhist monasteries near Ravangla. Belonging to the Karma Kagyu sect, it is celebrated for its vivid murals, Tibetan architecture, and serene pine forest surroundings. Monks here preserve centuries of Buddhist traditions.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Ralong.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Ralong22.png',
    highlights1: ['Ancient Karma Kagyu Buddhist monastery', 'Vivid murals depicting Buddhist stories', 'Traditional Tibetan architectural style', 'Peaceful pine forest surroundings', 'Monks perform daily prayer rituals'],
    highlights2: ['Library contains ancient manuscripts', 'Meditation halls open to visitors', 'Prayer wheels surrounding main building', 'Festival celebrations attract crowds', 'Offers spiritual learning programs'],
  },
  {
    id: 7,
    name: 'Sai Mandir, Namchi',
    description:
      'Sai Mandir near Namchi is a beautiful temple devoted to Shirdi Sai Baba, set in peaceful surroundings. The temple complex is well-maintained and draws devotees of all faiths for its calm atmosphere, regular aarti ceremonies, and community prasadam distribution. Thursday prayers are particularly significant.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Sai%20mandir%202.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Sai%20mandir.png',
    highlights1: ['Dedicated to Shirdi Sai Baba', 'Peaceful and serene temple atmosphere', 'Regular aarti and prayer sessions', 'Beautiful temple architecture', 'Devotees from various faiths visit'],
    highlights2: ['Temple courtyard for group prayers', 'Prasadam distributed to visitors', 'Thursday special prayers held', 'Clean and well-maintained premises', 'Located near other pilgrimage sites'],
  },
  {
    id: 8,
    name: 'Namchi Ropeway',
    description:
      'The Namchi Ropeway connects the River View Point with the Char Dham complex at Solophok, offering thrilling aerial views of the Namchi valley, lush tea gardens, and distant Himalayan ridges. Operated by the Sikkim government, this cable car makes the ascent to the Char Dham complex effortless and scenic.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Rope.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Rope22.png',
    highlights1: ['Connects River View Point to Char Dham', 'Aerial views of Namchi valley', 'Thrilling ride through mountain terrain', 'Glass cabins for clear visibility', 'Safe and well-maintained government system'],
    highlights2: ['Tea gardens visible from cable cars', 'Distant Himalayan peaks in view', 'Comfortable seating for all ages', 'Operating hours are weather-dependent', 'Photography freely allowed during ride'],
  },
  {
    id: 9,
    name: 'Ravangla Rose Garden',
    description:
      'The Ravangla Rose Garden is a vibrant explosion of rose varieties set against the Himalayan backdrop. During the flowering season (spring and early summer), the garden bursts into a mosaic of red, pink, yellow, and white roses, making it a favourite for photography and leisurely walks.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Rose2.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Rose.png',
    highlights1: ['Multiple varieties of roses cultivated', 'Vibrant colours during blooming season', 'Well-maintained garden pathways', 'Himalayan backdrop enhances beauty', 'Best visited during spring months'],
    highlights2: ['Benches placed for peaceful sitting', 'Photography enthusiasts love visiting', 'Pleasant fragrance fills the air', 'Local gardeners maintain flower beds', 'Entry fee nominal for maintenance'],
  },
  {
    id: 10,
    name: 'Ngadak Monastery',
    description:
      'Ngadak Monastery is a lesser-known gem on a hilltop near Ravangla, offering a deeply peaceful atmosphere and sweeping valley views. The monastery belongs to the Nyingma tradition and welcomes visitors to its tranquil prayer halls. Its off-the-beaten-path location ensures a crowd-free spiritual experience.',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Ngadak2.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/Ngadak.png',
    highlights1: ['Lesser-known hilltop Nyingma monastery', 'Peaceful prayer halls for meditation', 'Panoramic valley views from location', 'Traditional Buddhist architecture', 'Away from tourist crowds'],
    highlights2: ['Monks available for spiritual guidance', 'Ancient Buddhist scriptures preserved', 'Prayer flags create colourful ambiance', 'Sunrise views particularly stunning', 'Quiet environment for reflection'],
  },
  {
    id: 11,
    name: 'Tarey Bhir (Cliff Walk)',
    description:
      'Tarey Bhir near Ravangla is a dramatic cliff-edge viewpoint with a thrilling suspension walkway along the sheer drop. The word "bhir" means cliff in Nepali, and the views of the Ralong Khola valley hundreds of metres below are truly jaw-dropping. Safety railings are in place, but acrophobia is a real concern!',
    image1: 'https://glacialtravels.com/Travel/southsikkim/Tarey.png',
    image2: 'https://glacialtravels.com/Travel/southsikkim/tarey2.png',
    highlights1: ['Thrilling cliff-edge walking paths', 'Jaw-dropping views of valley below', 'Adventure activities for thrill seekers', 'Safety railings along cliff edges', 'Professional guides available'],
    highlights2: ['Ralong Khola valley visible far below', 'Not suitable for height-phobic visitors', 'Best photography spot for landscapes', 'Wind can be strong at cliff edge', 'Sunrise and sunset views spectacular'],
  },
];

const quickInfo = [
  { icon: <polyline points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, text: 'HQ: Namchi' },
  { icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />, text: 'Altitude: 300 – 3,200 m' },
  { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />, text: 'Best time: Mar – May, Oct – Dec' },
  { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, text: 'Must-see: Char Dham, Buddha Park' },
];

const SouthSikkim = () => (
  <RegionPage
    regionName="South Sikkim"
    heroCaption="A journey of the soul through hills, temples, and tea"
    heroVideo="https://res.cloudinary.com/dncj0cmt4/video/upload/w_1280,q_auto:eco,f_auto/v1778501917/South_Sikkim_8_mb_fsulhx.mp4"
    heroPoster="https://res.cloudinary.com/dncj0cmt4/video/upload/so_0,w_1280,q_auto,f_auto/v1778501917/South_Sikkim_8_mb_fsulhx.jpg"
    overviewTitle="About South Sikkim"
    overviewText="South Sikkim is the smallest yet most spiritually rich district of Sikkim, known for its serene greenery, gentle hills, and profound cultural depth. The town of Namchi its administrative heart is a major centre for religious tourism, home to remarkable landmarks like the Char Dham complex and the world's tallest Guru Padmasambhava statue. The lush organic Temi Tea Garden, the tranquil Buddha Park at Ravangla, and the dramatic Tarey Bhir cliff walk complete a region that beautifully balances nature, adventure, and spirituality."
    quickInfo={quickInfo}
    destinations={destinations}
  />
);

export default SouthSikkim;