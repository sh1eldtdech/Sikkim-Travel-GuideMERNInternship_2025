import React from 'react';
import RegionPage from './RegionPage';
import Pelling1 from '../../assets/West Sikkim/Pelling.jpg';
import Yuksom from '../../assets/West Sikkim/Yuksom.webp';

const destinations = [
  {
    id: 1,
    name: 'Pelling',
    description:
      'Pelling is a scenic hill station in West Sikkim at 2,150 m, renowned for its spectacular close-up views of Mount Kanchenjunga (8,586 m). This tranquil destination blends natural beauty, rich history, and modern adventure from ancient monasteries and cascading waterfalls to paragliding and the first glass skywalk in India.',
    image1: Pelling1,
    image2: 'https://glacialtravels.com/Travel/westsikkim/pelling%20(1).png',
    highlights1: ['Spectacular close-up views of Kanchenjunga', 'Ancient monasteries with rich history', 'Perfect base for trekking adventures', 'Cascading Kanchenjunga waterfall nearby', 'Paragliding and adventure sports available'],
    highlights2: ['Peaceful hill station atmosphere', 'Photography paradise for nature lovers', 'Traditional Sikkimese cultural experience', 'Cool mountain climate year-round', 'Easy access to multiple top attractions'],
  },
  {
    id: 2,
    name: 'Yuksom (Yuksam)',
    description:
      'Yuksom meaning "Meeting Place of Three Lamas" was the first capital of Sikkim (1642 CE) and is the gateway to the Kanchenjunga National Park and the famous Goecha La trek. The Coronation Throne of Norbugang, where the first Chogyal of Sikkim was crowned, stands as a remarkable historical monument.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Yuksum2.png',
    image2: Yuksom,
    highlights1: ['Gateway to Kanchenjunga National Park', 'First capital of Sikkim since 1642 CE', 'Historic Coronation Throne of Norbugang', 'Starting point for Goecha La trek', 'Rich royal heritage and cultural depth'],
    highlights2: ['Sacred Dubdi Monastery nearby', 'Traditional Sikkimese village atmosphere', 'Trekking equipment and guides available', 'Ancient chortens and prayer wheels', 'Kathok Lake a sacred site for trekkers'],
  },
  {
    id: 3,
    name: 'Singhshore Bridge',
    description:
      'Singhshore Bridge, at 198 m long and 96 m above the Rimbi River valley, is among the highest suspension bridges in Asia. Located near Uttarey, it spans a dramatic gorge framed by dense forests and waterfalls. Walking across while the bridge sways gently in mountain breeze is an unforgettable adrenaline experience.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Singshore2.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Singshore.jpg',
    highlights1: ['198 m long one of Asia\'s highest suspension bridges', '96 m above the Rimbi River gorge', 'Spectacular valley views below', 'Adrenaline thrill for bridge walkers', 'Perfect for photography enthusiasts'],
    highlights2: ['Cool mountain breeze while crossing', 'Waterfalls visible from bridge', 'Dense forest canopy surroundings', 'Safe walkway with protective railings', 'Accessible from Uttarey village'],
  },
  {
    id: 4,
    name: 'Rabdentse Ruins',
    description:
      'Rabdentse was the second capital of the Kingdom of Sikkim from 1670 to 1814, and its atmospheric ruins are now a UNESCO protected site. Set on a forested ridge accessible by a scenic trail from Pemayangtse Monastery, the stone palace ruins, three stone chortens, and sweeping valley views make it a hauntingly beautiful place.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Rabdents2.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Rabdents.jpg',
    highlights1: ['Second capital of Sikkim 1670 to 1814', 'UNESCO protected archaeological site', 'Three imposing stone chortens', 'Forest trail leads to site', 'Peaceful and scenic forest journey'],
    highlights2: ['Sweeping views of the Rangit valley', 'Lush greenery surrounds the ruins', 'Archaeological significance preserved', 'Quiet contemplative atmosphere', 'Easily combined with Pemayangtse visit'],
  },
  {
    id: 5,
    name: 'Kanchenjunga Falls',
    description:
      'Kanchenjunga Falls is a magnificent multi-tiered waterfall fed by the glaciers of Mount Kanchenjunga, creating a powerful and mesmerising flow. Located 4 km from Pelling, the falls plunge through dense forest with a thundering roar, and visitors can dip their feet in the icy glacial stream at its base.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/KanchanFalls2.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/KanchanFalls.jpg',
    highlights1: ['Massive multi-tiered glacial waterfall', 'Fed by Kanchenjunga glacier meltwater', 'Powerful and mesmerising year-round flow', 'Dense forest surroundings', 'Popular photography destination'],
    highlights2: ['Cold glacial stream for foot dipping', 'Cascading water sounds deeply soothing', 'Accessible 4 km from Pelling town', 'Mist creates refreshing cool atmosphere', 'Ideal picnic spot for families'],
  },
  {
    id: 6,
    name: 'Chenrezig Statue',
    description:
      'The Chenrezig Statue in Pelling is one of the largest statues of Avalokiteshvara (the Buddha of Compassion) in the region. Standing atop a hill, it offers panoramic views of the Kanchenjunga range. The adjacent glass Sky Walk the first of its kind in India adds a modern thrill to this spiritual site.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/ChenzStatue.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/ChenzStatue2.jpg',
    highlights1: ['One of the largest Chenrezig statues', 'Buddha of Compassion Avalokiteshvara', 'Panoramic Kanchenjunga mountain views', 'Adjacent to India\'s first glass Sky Walk', 'Deep spiritual significance for Buddhists'],
    highlights2: ['Golden statue gleams in sunlight', 'Hilltop location offers 360° views', 'Modern engineering meets ancient tradition', 'Popular meditation and prayer site', 'Architectural marvel worth visiting'],
  },
  {
    id: 7,
    name: 'Varsey Rhododendron Sanctuary',
    description:
      'The Varsey Rhododendron Sanctuary is a paradise for nature lovers, covering 104 sq km of Barsey forest in West Sikkim. During spring (March-May), the entire region transforms into a vibrant canvas of 26 rhododendron species. It is also home to red pandas, Himalayan black bears, blood pheasants, and satyr tragopans.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/RhodePark.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/RhodePark2.jpg',
    highlights1: ['26 rhododendron species in one sanctuary', 'Spring blooms in red, pink, and white', 'Home to Red Pandas (near-threatened)', 'Himalayan Black Bears habitat', 'Rare blood pheasant and satyr tragopan'],
    highlights2: ['Trekking paradise with minimal crowds', 'Photography opportunities throughout', 'Serene and peaceful forest atmosphere', 'Kanchenjunga range visible on clear days', 'Biodiversity conservation area'],
  },
  {
    id: 8,
    name: 'Pemayangtse Monastery',
    description:
      'Pemayangtse Monastery, founded in the 17th century, is one of the oldest and most revered Buddhist monasteries in Sikkim. Belonging to the Nyingma sect, it houses exquisite murals, sculptures, and rare thangkas. Its greatest treasure is the "Zangdok Palri" a seven-tiered wooden sculpture depicting Guru Padmasambhava\'s heavenly palace.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/PemagystaGompa.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/PemagystaGompa2.jpg',
    highlights1: ['One of the oldest monasteries in Sikkim', 'Founded in the 17th century, Nyingma sect', 'Exquisite ancient murals and sculptures', 'Rare thangka collection preserved', 'Active monastery with resident monks'],
    highlights2: ['Seven-tiered Zangdok Palri masterpiece', "Depicts Guru Padmasambhava's celestial abode", 'Spiritual ceremonies and festivals', 'Architectural heritage preservation', 'Adjacent to Rabdentse ruins trail'],
  },
  {
    id: 9,
    name: 'Sky Walk, Pelling',
    description:
      'The Pelling Sky Walk is India\'s first glass skywalk, built adjacent to the Chenrezig Statue. Walking on its transparent glass floor, visitors experience the thrill of floating above the mountainside while gazing at snow-capped Himalayan peaks, deep valleys, and the giant golden Buddha statue a truly unique perspective.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/SkyWalk2.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Sky%20walk.jpg',
    highlights1: ["India's first glass skywalk", 'Transparent glass floor experience', 'Stunning mountain and valley views', 'Adjacent to the giant golden Buddha', 'Adrenaline thrill for all visitors'],
    highlights2: ['Perfect backdrop for photography', 'Snow-capped peaks clearly visible', 'Safe tempered-glass construction', 'Must-visit for adventure seekers', 'Unique floating-above-mountain feeling'],
  },
  {
    id: 10,
    name: 'Dzongri La',
    description:
      'Dzongri La (4,020 m) is a high-altitude trekking pass and one of the finest vantage points for views of the Kanchenjunga massif. The trek from Yuksom to Dzongri (approx. 25 km) passes through lush forests, rhododendron corridors, and alpine meadows considered one of India\'s most rewarding treks.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Dzongri.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Dzongri2.jpg',
    highlights1: ['High-altitude pass at 4,020 m', 'World-class Kanchenjunga views', 'Trek from Yuksom - approx. 25 km', 'Multiple Himalayan peaks visible', 'Challenging, rewarding 5-6 day trek'],
    highlights2: ['Lush forests and rhododendron corridors', 'Alpine meadows with seasonal wildflowers', 'Dzongri Top 4,280 m panoramic viewpoint', 'Camp under star-filled high-altitude skies', 'Entry via permit from Yuksom checkpoint'],
  },
  {
    id: 11,
    name: 'Kirateshwar Mahadev Temple',
    description:
      'Kirateshwar Mahadev Temple is a revered Hindu temple dedicated to Lord Shiva in his form as Kirateshwar, situated on the banks of the Rangit River in West Sikkim. The riverside location creates a deeply peaceful atmosphere, and the temple is thronged by devotees during the Maha Shivratri festival.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Mahadev%20temple.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Mahadev%20temple.png',
    highlights1: ['Sacred temple to Lord Shiva as Kirateshwar', 'Located on the banks of Rangit River', 'Powerful spiritual site for devotees', 'Draws pilgrims from across the region', 'Thronged during Maha Shivratri festival'],
    highlights2: ['Peaceful riverside location for prayers', 'Ideal for meditation by the river', 'Holy river adds deep spiritual ambiance', 'Traditional Nepali temple architecture', 'Religious ceremonies held throughout year'],
  },
  {
    id: 12,
    name: 'Yangthang Farms',
    description:
      'Yangthang Farms is a serene countryside retreat in West Sikkim where visitors can experience traditional organic farming and authentic Sikkimese village life. The farm produces fresh dairy, seasonal fruits, and organic vegetables. A relaxing walk through the fields, farm-to-table meals, and interaction with local families make this a soulful rural experience.',
    image1: 'https://glacialtravels.com/Travel/westsikkim/Yangthang.jpg',
    image2: 'https://glacialtravels.com/Travel/westsikkim/Yangthang2.jpg',
    highlights1: ['Quiet countryside organic farm retreat', 'Hands-on organic farming experience', 'Traditional Sikkimese village lifestyle', 'Fresh dairy products made on-site', 'Seasonal organic fruits and vegetables'],
    highlights2: ['Relaxing walks through farm fields', 'Learn sustainable farming techniques', 'Taste authentic homemade Sikkimese food', 'Perfect for nature and slow-travel lovers', 'Peaceful rural escape from city life'],
  },
];

const quickInfo = [
  { icon: <polyline points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, text: 'HQ: Geyzing (Gyalshing)' },
  { icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />, text: 'Altitude: 300 – 4,200 m' },
  { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />, text: 'Best time: Mar - May, Oct - Dec' },
  { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, text: 'Must-see: Pelling, Pemayangtse' },
];

const WestSikkim = () => (
  <RegionPage
    regionName="West Sikkim"
    heroCaption="Your Himalayan Escape Ancient Monasteries & Wild Peaks"
    heroVideo="https://res.cloudinary.com/dncj0cmt4/video/upload/w_1280,q_auto:eco,f_auto/v1778500682/West_Sikkim_14mb_nnigu7.mp4"
    heroPoster="https://res.cloudinary.com/dncj0cmt4/video/upload/so_0,w_1280,q_auto,f_auto/v1778500682/West_Sikkim_14mb_nnigu7.jpg"
    overviewText="West Sikkim enchants travellers with its stunning natural landscapes, vibrant culture, and deeply spiritual atmosphere. The district is home to some of Sikkim's most treasured landmarks — the first capital Yuksom, India's first glass skywalk in Pelling, the ancient Pemayangtse Monastery, and the awe-inspiring Kanchenjunga Falls. Adventure lovers can trek to the Dzongri La pass, while wildlife enthusiasts can explore the Varsey Rhododendron Sanctuary, home to red pandas and rare Himalayan birds. West Sikkim truly offers the full Himalayan experience."
    quickInfo={quickInfo}
    destinations={destinations}
  />
);

export default WestSikkim;