import React from 'react';
import styles from './SikkimRegion.module.css';
import Zuluk1 from "../../assets/East4.jpg"
import Gangtok1 from "../../assets/East Sikkim/Gangtok.jpg"
import VideoHero from "../../components/VideoHero";

const EastSikkim = () => {
  
const destinations = [
  {
    id: 1,
    name: "Nathula Pass",
    description: "Nathu La is a high-altitude mountain pass in the Himalayas connecting India's Sikkim with Tibet, China. A historically significant part of the ancient Silk Road, it now serves as a key border trading post. Located at over 4,300 meters, it offers stunning Himalayan views but requires permits for Indian citizens to visit, typically best done during the summer months.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/Nathula.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Nathula2.png",
    highlights1: [
      "Snow-covered roads with panoramic views",
      "Ideal location for photography enthusiasts",
      "Visible border fencing with Chinese soldiers",
      "Military presence adds to historic vibe",
      "Clear skies offer majestic views of peaks"
    ],
    highlights2: [
      "Local guides provide insightful stories",
      "Drive to pass is adventurous and scenic",
      "Prayer flags enhance spiritual ambiance",
      "Often covered with snow even in spring",
      "Popular destination for patriotic tourists"
    ]
  },
  {
    id: 2,
    name: "Changu Lake",
    description: "Tsomgo Lake, also known as Changu Lake, is a glacial lake in Sikkim, India, located at an altitude of 3,753 m (12,313 ft). The lake remains frozen during the winter season and is surrounded by snow-capped mountains. It is a popular tourist destination and is considered sacred by the local Sikkimese people.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/1.png",
    image2: "https://glacialtravels.com/Travel/eastsikkim/2.png",
    highlights1: [
      "Yaks rides available around the lake",
      "Lake color changes with seasons",
      "Flora includes rhododendrons in bloom",
      "Reflection of clouds is mesmerizing",
      "Road access via scenic mountain passes"
    ],
    highlights2: [
      "Lake is surrounded by legends and tales",
      "Ice blocks float during early spring",
      "Vendors sell hot tea and snacks nearby",
      "Ideal picnic spot in warmer months",
      "Accessible by rented vehicles from Gangtok"
    ]
  },
  {
    id: 3,
    name: "Reshikhola",
    description: "Reshikhola is a peaceful place on the border of Sikkim and West Bengal. It is named after the Reshi River, which flows through it. Surrounded by green hills, it is a perfect spot for nature lovers. People come here to relax, enjoy the fresh air, and listen to the sound of the river. You can also go for short walks, watch birds, or camp by the riverside.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/ReshiKhola.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Reshikhola.png",
    highlights1: [
      "Wooden cottages along riverside trails",
      "Stars visible clearly at night",
      "Cool mist in mornings adds to beauty",
      "Simple village lifestyle observed closely",
      "Home-cooked local meals available"
    ],
    highlights2: [
      "Great place to spot Himalayan butterflies",
      "Riverbank ideal for meditation or yoga",
      "Sound of river aids in relaxation",
      "Easy hikes through pine forests",
      "Safe and family-friendly environment"
    ]
  },
  {
    id: 4,
    name: "Zuluk",
    description: "Zuluk is a small hamlet located at an altitude of around 10,000 feet on the rugged terrain of the lower Himalayas in East Sikkim. This offbeat destination is famous for its zigzag roads and breathtaking sunrise views over the Kanchenjunga peak. The winding roads with hairpin bends offer an adventurous drive and spectacular mountain views throughout the journey.",
    image1: Zuluk1,
    image2: "https://glacialtravels.com/Travel/eastsikkim/Zaluk2.jpg",
    highlights1: [
      "Part of famous Old Silk Route",
      "Excellent stopover for bikers",
      "Homestays with warm hospitality",
      "Snowfall common during winter months",
      "Surreal cloud formations around dawn"
    ],
    highlights2: [
      "Military bunkers visible during travel",
      "Clear views of winding road loops",
      "Great photographic location in monsoon",
      "Ideal for early morning drives",
      "Surroundings change color seasonally"
    ]
  },
  {
    id: 5,
    name: "Kupup Lake",
    description: "Kupup Lake, also known as Elephant Lake due to its shape, is a pristine high-altitude lake located at about 13,000 feet above sea level. This beautiful lake is surrounded by barren mountains and offers stunning reflections of the sky. The lake is often frozen during winter months and presents a mesmerizing landscape for photographers and nature enthusiasts.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/Elephant%20Lake.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/kupup_valley.jpg",
    highlights1: [
      "Located near India-China border trade route",
      "Misty mornings offer magical views",
      "Rare Himalayan birds spotted nearby",
      "Horse riding options available",
      "Road to lake lined with prayer flags"
    ],
    highlights2: [
      "Ideal spot for landscape photography",
      "Air feels thin due to altitude",
      "Often featured in Silk Route tours",
      "Offers panoramic views of barren terrain",
      "Crystal clear waters shimmer under sun"
    ]
  },
  {
    id: 6,
    name: "Baba Mandir",
    description: "Baba Harbhajan Singh Temple, commonly known as Baba Mandir, is dedicated to an Indian Army soldier who died in 1968. Located at an altitude of 13,123 feet, this sacred shrine is believed to protect the soldiers stationed in the area. The temple attracts thousands of devotees and tourists who come to pay their respects and seek blessings from Baba Harbhajan Singh.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/BabaHarbajan.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/baba-harbhajan-singh2.jpg",
    highlights1: [
      "Belongings of soldier kept in shrine",
      "Temple maintained by Indian Army",
      "Pilgrims believe in supernatural presence",
      "Prayer room has peaceful atmosphere",
      "Tales of soldier’s spirit still being on duty"
    ],
    highlights2: [
      "Army mess often visited by tourists",
      "Photos and stories on display inside",
      "Devotees light candles for blessings",
      "Prayer flags flutter around compound",
      "Location offers quiet spiritual ambiance"
    ]
  },
  {
    id: 7,
    name: "Nathang Valley",
    description: "Nathang Valley, often called the \"Ladakh of the East,\" is a high-altitude valley in East Sikkim, India. Situated at over 13,000 feet above sea level, it's known for its vast, treeless landscape resembling the Tibetan plateau. This stark yet beautiful terrain offers breathtaking panoramic views of the surrounding snow-capped Himalayan peaks.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/Nathang2.png",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Nathang.png",
    highlights1: [
      "Rare black-necked cranes can be seen",
      "Valley colors shift with seasons",
      "Perfect for astrophotography at night",
      "Sunrise paints golden hue on hills",
      "Snowfall transforms it into white desert"
    ],
    highlights2: [
      "Military camps seen along roads",
      "Wind speed can be very high",
      "Road to valley has dramatic drops",
      "Minimal mobile connectivity adds to adventure",
      "One of least populated regions in Sikkim"
    ]
  },
  {
    id: 8,
    name: "Mandakini falls",
    description: "Mandakini Falls is a beautiful waterfall in Sikkim, located on the way to Changu Lake (Tsomgo Lake) and Nathula Pass. The waterfall cascades down from a great height, creating a stunning view surrounded by lush greenery and rocky cliffs. The sound of the flowing water and the cool mist make it a refreshing stop for travelers.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/mandakini-water-falls-1360325.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Mandakini.png",
    highlights1: [
      "Roadside stop with scenic picnic spot",
      "Water flows strongly during monsoon",
      "Surrounding area rich in moss and ferns",
      "Cool mist refreshes tired travelers",
      "Small footbridge nearby for photos"
    ],
    highlights2: [
      "Sounds of water audible from distance",
      "Butterflies flutter around stream edge",
      "Benches placed near viewing point",
      "Great for slow shutter photography",
      "Less crowded during early mornings"
    ]
  },
  {
    id: 9,
    name: "Kali khola falls",
    description: "Kali Khola Falls, also known as Kuikhola Falls, is a beautiful waterfall located on the way to Rongli in East Sikkim. The water cascades down from a great height, creating a stunning view and a refreshing atmosphere. Surrounded by lush green hills, it is a perfect spot to take a break and enjoy nature while traveling.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/kali-khola-falls.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Kalikhola.png",
    highlights1: [
      "Often forms rainbows on sunny days",
      "Popular stopover on Silk Route trips",
      "Surrounding forest echoes bird songs",
      "Slippery rocks near base—caution advised",
      "Best visited in early morning light"
    ],
    highlights2: [
      "Children enjoy splashing near edges",
      "Occasionally monkeys seen in trees",
      "Footpaths lead to nearby viewpoints",
      "Cool breeze adds to soothing effect",
      "Tiny local stalls sell tea & snacks"
    ]
  },
  {
    id: 10,
    name: "Hanuman Tok",
    description: "Hanuman Tok is a famous temple in Gangtok, Sikkim, dedicated to Lord Hanuman. It is located at an altitude of around 7,200 feet and offers a breathtaking view of Mount Kanchenjunga and the surrounding valleys. The temple is well-maintained by the Indian Army and has a peaceful atmosphere, making it a great place for meditation and prayers.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/Hanumantok.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/Hanuman_tok2.jpg",
    highlights1: [
      "Steps leading to temple are scenic",
      "Area around temple filled with flowers",
      "Panoramic view deck for visitors",
      "Devotees chant hymns in groups",
      "Gentle bells echo through the valley"
    ],
    highlights2: [
      "Temple painted in vibrant colors",
      "Forest path leads to viewpoint",
      "Wall murals depict Hanuman’s stories",
      "Parking available close to entrance",
      "Ideal for spiritual retreat seekers"
    ]
  },
  {
    id: 11,
    name: "Menmecho Lake",
    description: "Menmecho Lake is a sacred high-altitude lake situated at around 12,000 feet above sea level. This pristine lake is surrounded by rugged mountains and offers a spiritual experience for visitors. The lake is considered holy by the local Buddhist community and provides a serene environment for meditation and reflection amidst the stunning Himalayan landscape.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/menmecholake.jpg",
    image2: "https://glacialtravels.com/Travel/eastsikkim/menmechoLake2.jpg",
    highlights1: [
      "Serene blue-green water color",
      "Surroundings filled with prayer flags",
      "Perfect camping spot for trekkers",
      "Lake changes color with sky",
      "Far from commercial tourist zones"
    ],
    highlights2: [
      "Spiritual site for monks and lamas",
      "Often covered in fog during dawn",
      "Pathway offers great hike opportunity",
      "Boats occasionally seen on surface",
      "Known for peaceful sunrises"
    ]
  },
  {
    id: 12,
    name: "Gangtok Ropeway",
    description: "The Gangtok Ropeway is a popular cable car ride that offers a breathtaking aerial view of Gangtok city, the surrounding valleys, and the snow-capped Himalayas. The ropeway has three stations: Deorali (lower station), Namnang (middle station), and Tashiling (upper station). The ride covers a distance of about 1 km and takes around 7 minutes, giving visitors a stunning bird's-eye view of the landscape.",
    image1: "https://glacialtravels.com/Travel/eastsikkim/Ropeway2.jpg",
    image2: Gangtok1,
    highlights1: [
      "Ride operated by state tourism board",
      "Glass cabins for full scenic views",
      "Best taken around sunset for colors",
      "Safe for all ages including children",
      "Panoramic shots of entire Gangtok town"
    ],
    highlights2: [
      "Helps avoid road traffic congestion",
      "Multiple departure points for flexibility",
      "Provides clear view of MG Marg area",
      "Accessible by walk from main bazaar",
      "Often used by daily commuters too"
    ]
  }
];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.videoContainer}>
          <VideoHero 
            className={styles.heroVideo} 
            src="https://media.istockphoto.com/id/2150271703/video/aerial-view-of-solomons-temple-in-aizawl-the-capital-city-of-mizoram-this-architectural.mp4?s=mp4-640x640-is&k=20&c=dz2m_3Cz0b64bKHDVufOon-1f4SeH6WSJIs6S3vOwts=" 
          />
          <div className={styles.videoOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>East Sikkim</h1>
          <p className={styles.heroCaption}>Discover the breathtaking beauty of Eastern Himalayas</p>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>East Sikkim Overview</h2>
        <p className={styles.overviewText}>
          East Sikkim, home to the vibrant capital Gangtok, offers a captivating blend of natural beauty, cultural richness, and adventure. Explore the majestic
          Kanchenjunga, the third-highest peak in the world, and witness breathtaking sunrises over the snow-capped Himalayas. Immerse yourself in the spiritual
          ambiance of ancient monasteries like Rumtek and Enchey, and delve into the local culture at vibrant markets and handicraft centers. For adventure seekers,
          East Sikkim offers thrilling opportunities for trekking, hiking, and exploring the scenic landscapes.
        </p>
      </section>

      {/* Destinations Section */}
      <section className={styles.destinationsSection}>
        {destinations.map((destination) => (
          <div key={destination.id} className={styles.destinationCard}>
            <h3 className={styles.destinationTitle}>{destination.name}</h3>
            <p className={styles.destinationDescription}>{destination.description}</p>
            <div className={styles.imageGrid}>
              <div className={styles.imageContainer}>
                <div className={styles.flipCard}>
                  <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                      <img
                        src={destination.image1}
                        alt={`${destination.name} view 1`}
                        className={styles.destinationImage}
                        loading="lazy"
                        width="400"
                        height="300"
                        decoding="async"
                      />
                    </div>
                    <div className={styles.flipCardBack}>
                      <div className={styles.highlightsContent}>
                        <h4 className={styles.highlightsTitle}>Highlights</h4>
                        <ul className={styles.highlightsList}>
                          {destination.highlights1.map((highlight, index) => (
                            <li key={index} className={styles.highlightItem}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.imageContainer}>
                <div className={styles.flipCard}>
                  <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                      <img
                        src={destination.image2}
                        alt={`${destination.name} view 2`}
                        className={styles.destinationImage}
                        loading="lazy"
                        width="400"
                        height="300"
                        decoding="async"
                      />
                    </div>
                    <div className={styles.flipCardBack}>
                      <div className={styles.highlightsContent}>
                        <h4 className={styles.highlightsTitle}>Highlights</h4>
                        <ul className={styles.highlightsList}>
                          {destination.highlights2.map((highlight, index) => (
                            <li key={index} className={styles.highlightItem}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default EastSikkim;