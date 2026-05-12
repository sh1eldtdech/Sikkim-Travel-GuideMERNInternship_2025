import React from 'react';
import RegionPage from './RegionPage';
import NorthImg from '../../assets/North Sikkim/Gurudongmar Lake.jpg';
import North1 from '../../assets/North1.jpg';

const destinations = [
  {
    id: 1,
    name: 'Lachen',
    description:
      'Lachen is a serene village in North Sikkim perched at around 2,750 m, known for its peace and natural surroundings. Surrounded by towering mountains, ancient forests, and clear alpine streams, it serves as the base for treks to Gurudongmar Lake one of the world\'s highest sacred lakes.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/Lachen2.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/Lachen.png',
    highlights1: ['Traditional wooden houses with mountain backdrop', 'Starting point for Gurudongmar Lake trek', 'Local Buddhist monastery with ancient artifacts', 'Rhododendron forests bloom in spring', 'Yak herders showcase traditional lifestyle'],
    highlights2: ['Clear mountain streams flow through village', 'Homestays offer authentic local cuisine', 'Snow-capped peaks visible year-round', 'Perfect base camp for high-altitude adventures', 'Local guides share fascinating folklore'],
  },
  {
    id: 2,
    name: 'Lachung',
    description:
      'Lachung is a delightful village at 2,700 m in North Sikkim, surrounded by cascading waterfalls, apple orchards, and colourful flowers. It is the gateway to Yumthang Valley the Valley of Flowers and is known for its friendly people, preserved Lepcha architecture, and stunning mountain vistas.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/2.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/lachung.png',
    highlights1: ['Gateway to famous Yumthang Valley', 'Apple orchards produce sweet mountain apples', 'Lachung Monastery overlooks the entire valley', 'Traditional Lepcha architecture preserved', 'Hot springs nearby for relaxation'],
    highlights2: ['Confluence of Lachen and Lachung Rivers', 'Local handicrafts sold by village women', 'Spectacular sunrise views from hilltops', 'Trekking trails lead to hidden waterfalls', 'Village council maintains unique governance'],
  },
  {
    id: 3,
    name: 'Gurudongmar Lake',
    description:
      'Gurudongmar Lake, at 17,800 ft, is one of the highest and holiest lakes in the world. Named after Guru Padmasambhava who is said to have blessed it, the lake has a portion that never freezes considered a miracle. Its crystal-clear blue waters reflecting barren Himalayan peaks create an otherworldly scene.',
    image1: NorthImg,
    image2: North1,
    highlights1: ['Sacred to both Hindus and Buddhists', 'Named after Guru Padmasambhava', 'Crystal clear waters reflect sky perfectly', 'Surrounded by barren Himalayan landscape', 'Temperature drops below freezing in summer'],
    highlights2: ['One portion never freezes considered blessed', 'Prayer flags flutter around lake perimeter', 'Altitude causes breathlessness acclimatise first', 'Sunrise paints mountains in golden hues', 'Photography restricted in certain areas'],
  },
  {
    id: 4,
    name: 'Yumthang Valley',
    description:
      'Yumthang Valley, the "Valley of Flowers" of Sikkim, lies at 3,564 m in North Sikkim. Every spring (April-May), the valley floor explodes with rhododendrons in over 24 species and a riot of wildflowers. Natural hot springs, the Lachung River, and snow-capped peaks complete this extraordinary landscape.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/YumthangValley.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/YumthangValley2.png',
    highlights1: ['Famous Valley of Flowers in Sikkim', 'Rhododendrons bloom in vibrant colours', 'Natural hot springs for therapeutic baths', 'Yaks graze peacefully in meadows', 'River Lachung flows through valley centre'],
    highlights2: ['Best visited April-May for flowers', 'Wooden bridges cross mountain streams', 'Traditional yak cheese available locally', 'Trekking base for higher altitude lakes', 'Photography paradise during spring season'],
  },
  {
    id: 5,
    name: 'Zero Point',
    description:
      'Zero Point is the last civilian-accessible location in North Sikkim, located at around 15,300 ft near the Indo-China border. The landscape here is dramatically different permanently snow-covered glaciers and peaks stretch as far as the eye can see, offering an Arctic-like experience in the Indian Himalayas.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/ZeroPoint.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/ZeroPoint2.png',
    highlights1: ['Last civilian-accessible point in North Sikkim', 'Panoramic views of Himalayan glaciers', 'Snow-covered landscape throughout the year', 'Army checkposts ensure border security', 'Oxygen levels significantly lower here'],
    highlights2: ['Popular destination for adventure seekers', 'Photography of peaks and glaciers allowed', 'Road journey itself is a thrilling adventure', 'Clear weather offers spectacular mountain views', 'Return journey must be completed before dark'],
  },
  {
    id: 6,
    name: 'Chopta Valley',
    description:
      'Chopta Valley is a beautiful high-altitude valley in North Sikkim known for its snowy mountains, flowing rivers, and ancient rhododendron forests. It serves as a trekking base for Gurudongmar Lake and features stunning high-altitude meadows rarely explored by mainstream tourism.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/Chopta2.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/ZeroPoint.png',
    highlights1: ['Trekking base for Gurudongmar Lake', 'Ancient rhododendron trees line paths', 'Military camps visible along routes', 'High-altitude meadows perfect for camping', 'Crystal clear mountain streams throughout'],
    highlights2: ['Rare Himalayan blue poppy spotted here', 'Traditional stone shelters for trekkers', 'Sunrise views over the Eastern Himalayas', 'Yak trails connect to higher valleys', 'Weather changes rapidly carry warm clothes'],
  },
  {
    id: 7,
    name: 'Mangan',
    description:
      'Mangan is the administrative headquarters of North Sikkim district, perched at about 1,000 m with striking mountain views. It is the main entry point to the high-altitude North Sikkim region and serves as a hub for adventure trekkers and those exploring the Lepcha cultural heritage.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/Mangan1.png',
    image2: 'https://glacialtravels.com/images/places/Chungthang.jpg',
    highlights1: ['Administrative headquarters of North Sikkim', 'Traditional markets sell local produce', 'Government rest houses for travellers', 'Starting point for various trekking routes', 'Local festivals celebrated with enthusiasm'],
    highlights2: ['Lepcha cultural centre showcases heritage', 'Scenic drives to nearby villages available', 'Local guides available for mountain expeditions', 'Traditional wooden architecture preserved', 'Bridge over Teesta River connects districts'],
  },
  {
    id: 8,
    name: 'Thangu Valley',
    description:
      'Thangu Valley, often called the "Hidden Valley" of North Sikkim, is a pristine plateau at around 3,600 m with expansive meadows carpeted with wildflowers in summer. An ancient trade route to Tibet passes through here, and the area retains an untouched quality that is rare in the Himalayas.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/Thangu1.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/Thangu2.png',
    highlights1: ['Hidden valley off main tourist circuit', 'Wildflowers carpet meadows in summer', 'Traditional yak herding practices observed', 'Ancient trade route to Tibet passes through', 'Pristine mountain streams for fresh water'],
    highlights2: ['Perfect solitude for meditation retreats', 'Rare Himalayan wildlife spotting opportunities', 'Traditional stone houses blend with landscape', 'Local shepherds share mountain stories', 'Camping under star-filled night skies'],
  },
  {
    id: 9,
    name: 'Mangshila View Point',
    description:
      'Mangshila View Point in North Sikkim offers sweeping views across mountain ranges and valleys. It is renowned for extraordinary sunrises and sunsets that paint the Himalayan skyline in shades of gold and crimson. The site is also beloved for its wildflower blooms and tranquil, uncrowded atmosphere.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/mangshila.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/mangshila2.png',
    highlights1: ['Panoramic views of entire North Sikkim', 'Sunrise photography spot for enthusiasts', 'Wildflowers bloom during monsoon season', 'Prayer flags mark sacred viewing points', 'Clear weather reveals distant snow peaks'],
    highlights2: ['Peaceful meditation spot away from crowds', 'Local tea stalls serve hot beverages', 'Trekking trails lead to higher viewpoints', 'Sunset colours reflect on mountain faces', 'Binoculars help spot distant landmarks'],
  },
  {
    id: 10,
    name: 'Phodong Monastery',
    description:
      'Phodong Monastery, one of the most important Buddhist monasteries of North Sikkim, was founded in the 18th century by the Nyingma sect. The monastery is richly decorated with ancient murals and thangka paintings. Perched on a forested hillside overlooking the Teesta valley, it offers spiritual calm and cultural depth.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/10.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/9.png',
    highlights1: ['18th-century Nyingma Buddhist monastery', 'Ancient murals depict Buddhist teachings', 'Monks perform daily prayers and rituals', 'Traditional architecture with golden roofs', 'Library contains rare Buddhist manuscripts'],
    highlights2: ['Annual masked dance festivals celebrated', 'Peaceful meditation halls for visitors', 'Scenic location overlooks Teesta valley', 'Traditional butter lamps illuminate halls', 'Local pilgrims visit for blessings regularly'],
  },
  {
    id: 11,
    name: 'Yumthang Hot Springs',
    description:
      'The natural hot springs in and around Yumthang Valley are mineral-rich thermal waters set against a backdrop of Himalayan forests and mountains. Known for their therapeutic properties, these springs have been used for centuries by locals and travellers seeking relief from the cold and muscle fatigue.',
    image1: 'https://glacialtravels.com/Travel/northsikkim/HotSpring1.png',
    image2: 'https://glacialtravels.com/Travel/northsikkim/HotSpring2.png',
    highlights1: ['Natural mineral-rich thermal waters', 'Therapeutic properties for muscle relief', 'Separate bathing areas for privacy', 'Surrounded by pristine mountain scenery', 'Local legends attribute healing powers'],
    highlights2: ['Temperature varies from warm to very hot', 'Best enjoyed during cold winter months', 'Changing rooms available for visitors', 'Sulfur content gives distinctive scent', 'Popular stop during Yumthang valley trips'],
  },
];

const quickInfo = [
  { icon: <polyline points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, text: 'HQ: Mangan' },
  { icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />, text: 'Altitude: 1,000 – 5,400 m' },
  { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />, text: 'Best time: May – Jun, Sep – Nov' },
  { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, text: 'Must-see: Gurudongmar, Yumthang' },
];

const NorthSikkim = () => (
  <RegionPage
    regionName="North Sikkim"
    heroCaption="Where the Himalayas Awaken"
    heroVideo="https://videos.pexels.com/video-files/15983714/15983714-hd_1920_1080_30fps.mp4"
    overviewTitle="About North Sikkim"
    overviewText="North Sikkim is the most remote and pristine district of Sikkim, a land where the Himalayas reach their most dramatic heights. Home to sacred lakes at 17,800 ft, the Valley of Flowers, and ancient trade routes to Tibet, it offers an unmatched raw Himalayan experience. Travellers are rewarded with extraordinary biodiversity, unique Lepcha and Bhutia culture, and landscapes that range from rhododendron forests to glacial valleys and barren alpine plateaus."
    quickInfo={quickInfo}
    destinations={destinations}
  />
);

export default NorthSikkim;