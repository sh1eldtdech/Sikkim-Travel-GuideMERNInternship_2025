import React from 'react';
import RegionPage from './RegionPage';
import Zuluk1 from '../../assets/East4.jpg';
import Gangtok1 from '../../assets/East Sikkim/Gangtok.jpg';

const destinations = [
  {
    id: 1,
    name: 'Nathula Pass',
    description:
      'Nathu La is a high-altitude mountain pass in the Himalayas connecting India\'s Sikkim with Tibet, China. A historically significant part of the ancient Silk Road, it now serves as a key border trading post. Located at over 4,300 metres, it offers stunning Himalayan views and requires permits for Indian citizens.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/Nathula.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Nathula2.png',
    highlights1: ['Snow-covered roads with panoramic views', 'Ideal for photography enthusiasts', 'Visible border fencing with Chinese soldiers', 'Military presence adds to historic vibe', 'Clear skies offer majestic views of peaks'],
    highlights2: ['Local guides provide insightful stories', 'Drive to pass is adventurous and scenic', 'Prayer flags enhance spiritual ambiance', 'Often covered with snow even in spring', 'Popular destination for patriotic tourists'],
  },
  {
    id: 2,
    name: 'Changu Lake (Tsomgo Lake)',
    description:
      'Tsomgo Lake, also known as Changu Lake, is a glacial lake in Sikkim located at an altitude of 3,753 m (12,313 ft). The lake remains frozen during winter and is surrounded by snow-capped mountains. It is a popular tourist destination considered sacred by the local Sikkimese people.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/1.png',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/2.png',
    highlights1: ['Yak rides available around the lake', 'Lake colour changes with seasons', 'Flora includes rhododendrons in bloom', 'Reflection of clouds is mesmerising', 'Road access via scenic mountain passes'],
    highlights2: ['Lake surrounded by legends and tales', 'Ice blocks float during early spring', 'Vendors sell hot tea and snacks nearby', 'Ideal picnic spot in warmer months', 'Accessible by rented vehicles from Gangtok'],
  },
  {
    id: 3,
    name: 'Reshikhola',
    description:
      'Reshikhola is a peaceful hamlet on the border of Sikkim and West Bengal, named after the Reshi River that flows through it. Surrounded by green hills and riverine forests, it is a perfect retreat for nature lovers who want to relax, bird-watch, or camp by the riverside.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/ReshiKhola.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Reshikhola.png',
    highlights1: ['Wooden cottages along riverside trails', 'Stars visible clearly at night', 'Cool mist in mornings adds to beauty', 'Simple village lifestyle observed closely', 'Home-cooked local meals available'],
    highlights2: ['Great place to spot Himalayan butterflies', 'Riverbank ideal for meditation or yoga', 'Sound of river aids in relaxation', 'Easy hikes through pine forests', 'Safe and family-friendly environment'],
  },
  {
    id: 4,
    name: 'Zuluk',
    description:
      'Zuluk is a small hamlet at around 10,000 ft on the rugged lower Himalayas in East Sikkim. Famous for its legendary zigzag road 32 hairpin bends in just a few kilometres and breathtaking sunrise views over Kanchenjunga, it forms a key stop on the Old Silk Route.',
    image1: Zuluk1,
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Zaluk2.jpg',
    highlights1: ['Part of the famous Old Silk Route', 'Excellent stopover for bikers', 'Homestays with warm hospitality', 'Snowfall common during winter months', 'Surreal cloud formations around dawn'],
    highlights2: ['Military bunkers visible during travel', 'Clear views of winding road loops', 'Great photographic location in monsoon', 'Ideal for early morning drives', 'Surroundings change colour seasonally'],
  },
  {
    id: 5,
    name: 'Kupup Lake (Elephant Lake)',
    description:
      'Kupup Lake nicknamed Elephant Lake for its distinctive shape is a pristine high-altitude lake at about 13,000 ft. Surrounded by barren mountains, it offers stunning sky reflections. The lake often freezes in winter and presents a mesmerising landscape for photographers and trekkers.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/Elephant%20Lake.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/kupup_valley.jpg',
    highlights1: ['Located near India-China border trade route', 'Misty mornings offer magical views', 'Rare Himalayan birds spotted nearby', 'Horse riding options available', 'Road to lake lined with prayer flags'],
    highlights2: ['Ideal spot for landscape photography', 'Air feels thin due to altitude', 'Often featured in Silk Route tours', 'Panoramic views of barren terrain', 'Crystal clear waters shimmer under sun'],
  },
  {
    id: 6,
    name: 'Baba Mandir',
    description:
      'Baba Harbhajan Singh Temple is dedicated to an Indian Army soldier who died in 1968 and is said to still protect soldiers in the area. Located at 13,123 ft and maintained by the Indian Army, this sacred shrine draws thousands of devotees and curious travellers each year.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/BabaHarbajan.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/baba-harbhajan-singh2.jpg',
    highlights1: ["Belongings of soldier kept in shrine", "Temple maintained by Indian Army", "Pilgrims believe in supernatural presence", "Prayer room has peaceful atmosphere", "Tales of soldier's spirit still on duty"],
    highlights2: ['Army mess often visited by tourists', 'Photos and stories on display inside', 'Devotees light candles for blessings', 'Prayer flags flutter around compound', 'Location offers quiet spiritual ambiance'],
  },
  {
    id: 7,
    name: 'Nathang Valley',
    description:
      'Nathang Valley, often called the "Ladakh of the East", is a high-altitude valley in East Sikkim at over 13,000 ft. Its vast, treeless landscape resembles the Tibetan plateau and offers breathtaking panoramic views of snow-capped Himalayan peaks in every direction.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/Nathang2.png',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Nathang.png',
    highlights1: ['Rare black-necked cranes can be seen', 'Valley colours shift with seasons', 'Perfect for astrophotography at night', 'Sunrise paints golden hue on hills', 'Snowfall transforms it into white desert'],
    highlights2: ['Military camps seen along roads', 'Wind speed can be very high', 'Road to valley has dramatic drops', 'Minimal mobile connectivity adds to adventure', 'One of least populated regions in Sikkim'],
  },
  {
    id: 8,
    name: 'Mandakini Falls',
    description:
      'Mandakini Falls is a beautiful waterfall in Sikkim, located on the way to Changu Lake and Nathula Pass. The waterfall cascades dramatically from a great height, surrounded by lush greenery and rocky cliffs. Its cool mist and thundering sound make it a refreshing stop for travellers.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/mandakini-water-falls-1360325.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Mandakini.png',
    highlights1: ['Roadside stop with scenic picnic spot', 'Water flows strongly during monsoon', 'Surrounding area rich in moss and ferns', 'Cool mist refreshes tired travellers', 'Small footbridge nearby for photos'],
    highlights2: ['Sounds of water audible from distance', 'Butterflies flutter around stream edge', 'Benches placed near viewing point', 'Great for slow-shutter photography', 'Less crowded during early mornings'],
  },
  {
    id: 9,
    name: 'Kali Khola Falls',
    description:
      'Kali Khola Falls (also called Kuikhola Falls) is a beautiful waterfall on the road to Rongli in East Sikkim. Water cascades from a great height into lush green surroundings, creating a stunning and refreshing atmosphere perfect for a short break during travels along the Silk Route.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/kali-khola-falls.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Kalikhola.png',
    highlights1: ['Often forms rainbows on sunny days', 'Popular stopover on Silk Route trips', 'Surrounding forest echoes bird songs', 'Slippery rocks near base caution advised', 'Best visited in early morning light'],
    highlights2: ['Children enjoy splashing near edges', 'Occasionally monkeys seen in trees', 'Footpaths lead to nearby viewpoints', 'Cool breeze adds to soothing effect', 'Tiny local stalls sell tea & snacks'],
  },
  {
    id: 10,
    name: 'Hanuman Tok',
    description:
      'Hanuman Tok is a revered temple in Gangtok dedicated to Lord Hanuman, perched at 7,200 ft. Maintained by the Indian Army, it offers breathtaking views of Mount Kanchenjunga and the surrounding valleys. The peaceful atmosphere and stunning scenery make it ideal for meditation.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/Hanumantok.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/Hanuman_tok2.jpg',
    highlights1: ['Steps leading to temple are scenic', 'Area around temple filled with flowers', 'Panoramic view deck for visitors', 'Devotees chant hymns in groups', 'Gentle bells echo through the valley'],
    highlights2: ['Temple painted in vibrant colours', 'Forest path leads to viewpoint', 'Wall murals depict Hanuman stories', 'Parking available close to entrance', 'Ideal for spiritual retreat seekers'],
  },
  {
    id: 11,
    name: 'Menmecho Lake',
    description:
      'Menmecho Lake is a sacred high-altitude lake at around 12,000 ft, surrounded by rugged mountains. Considered holy by the local Buddhist community, it provides a serene environment for meditation and reflection amidst a stunning Himalayan landscape rarely visited by mass tourism.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/menmecholake.jpg',
    image2: 'https://glacialtravels.com/Travel/eastsikkim/menmechoLake2.jpg',
    highlights1: ['Serene blue-green water colour', 'Surroundings filled with prayer flags', 'Perfect camping spot for trekkers', 'Lake changes colour with the sky', 'Far from commercial tourist zones'],
    highlights2: ['Spiritual site for monks and lamas', 'Often covered in fog during dawn', 'Pathway offers great hike opportunity', 'Boats occasionally seen on surface', 'Known for peaceful sunrises'],
  },
  {
    id: 12,
    name: 'Gangtok Ropeway',
    description:
      'The Gangtok Ropeway offers a breathtaking aerial view of Gangtok city, the surrounding valleys, and the snow-capped Himalayas. With three stations Deorali, Namnang, and Tashiling the 1-km ride gives visitors a stunning bird\'s-eye view and a fun alternative to road travel.',
    image1: 'https://glacialtravels.com/Travel/eastsikkim/Ropeway2.jpg',
    image2: Gangtok1,
    highlights1: ['Ride operated by state tourism board', 'Glass cabins for full scenic views', 'Best taken around sunset for colours', 'Safe for all ages including children', 'Panoramic shots of entire Gangtok town'],
    highlights2: ['Helps avoid road traffic congestion', 'Multiple departure points for flexibility', 'Provides clear view of MG Marg area', 'Accessible by walk from main bazaar', 'Often used by daily commuters too'],
  },
];

const quickInfo = [
  { icon: <polyline points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, text: 'Capital: Gangtok' },
  { icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />, text: 'Altitude: 280 – 4,310 m' },
  { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />, text: 'Best time: Mar – May, Oct – Dec' },
  { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, text: 'Must-see: Nathula, Changu Lake' },
];

const EastSikkim = () => (
  <RegionPage
    regionName="East Sikkim"
    heroCaption="Discover the breathtaking beauty of Eastern Himalayas"
    heroVideo="https://res.cloudinary.com/dncj0cmt4/video/upload/v1778498595/East_sikkim_Hero_Video_12mb_x1e7bl.mp4"
    heroPoster="https://res.cloudinary.com/dncj0cmt4/video/upload/so_0,w_1280,q_auto,f_auto/v1778498595/East_sikkim_Hero_Video_12mb_x1e7bl.jpg"
    overviewText="East Sikkim, home to the vibrant capital Gangtok, offers a captivating blend of natural beauty, cultural richness, and adventure. Explore the majestic Kanchenjunga the world's third-highest peak and witness breathtaking sunrises over the snow-capped Himalayas. Immerse yourself in the spiritual ambiance of ancient monasteries like Rumtek and Enchey, and delve into the local culture at vibrant markets and handicraft centres. For adventure seekers, East Sikkim offers thrilling opportunities for trekking, hiking, and the legendary Old Silk Route expedition."
    quickInfo={quickInfo}
    destinations={destinations}
  />
);

export default EastSikkim;