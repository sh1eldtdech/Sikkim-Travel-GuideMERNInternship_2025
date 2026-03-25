import React from "react";
import styles from "./SikkimRegion.module.css";
import TemiTeaGarden from "../../assets/South Sikkim/TemiTeaGarden.jpg";
import Namchi from "../../assets/South Sikkim/Namchi.jpg";
import South1 from "../../assets/South1.jpg";
import MaenamHill from "../../assets/South Sikkim/MaenamHill.jpg"
import VideoHero from "../../components/VideoHero";

const SouthSikkim = () => {
  const destinations = [
    {
      id: 1,
      name: "Temi Tea Garden",
      description:
        "Temi Tea Garden, the only tea estate in Sikkim located in Namchi, is renowned for its lush organic tea plantations set against a backdrop of the Kanchenjunga range. Established in 1969, it offers scenic walks, tea-tasting, and insight into traditional organic tea processing.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Temi2.png",
      image2:
        TemiTeaGarden,
      highlights1: [
        "Only organic tea garden in Sikkim",
        "Panoramic views of Kanchenjunga range",
        "Traditional tea processing methods observed",
        "Guided tours available for visitors",
        "Fresh mountain air enhances experience"
      ],
      highlights2: [
        "Tea tasting sessions with local varieties",
        "Photography opportunities in lush plantations",
        "Peaceful walking trails through gardens",
        "Local workers demonstrate plucking techniques",
        "Best visited during tea harvesting season"
      ]
    },
    {
      id: 2,
      name: "Char Dham",
      description:
        "The Char Dham complex in Solophok near Namchi replicates India's four holy shrines, crowned by an imposing Shiva statue atop the hill. It's a major spiritual and cultural attraction offering panoramic views and a serene atmosphere.",
      image1: Namchi,
      image2: "https://glacialtravels.com/Travel/southsikkim/2.png",
      highlights1: [
        "Replica of India's four sacred pilgrimage sites",
        "108-foot tall statue of Lord Shiva",
        "360-degree panoramic valley views",
        "Architectural marvel with intricate details",
        "Spiritual ambiance for meditation"
      ],
      highlights2: [
        "Cable car access to main complex",
        "Prayer halls with peaceful atmosphere",
        "Religious ceremonies held regularly",
        "Pilgrims from across India visit",
        "Best views during clear weather days"
      ]
    },
    {
      id: 3,
      name: "Buddha Park (Tathagata Tsal)",
      description:
        "Buddha Park near Ravangla, featuring a 130-ft high statue of Buddha set amidst landscaped gardens and Cho-Djo lake, is a tranquil spiritual spot consecrated by the 14th Dalai Lama.",
      image1:
        South1,
      image2:
        "https://glacialtravels.com/Travel/southsikkim/Buddha.png",
      highlights1: [
        "130-feet tall bronze Buddha statue",
        "Consecrated by 14th Dalai Lama himself",
        "Beautiful landscaped gardens surrounding",
        "Cho-Djo lake adds to scenic beauty",
        "Peaceful meditation spots available"
      ],
      highlights2: [
        "Prayer wheels line the pathway",
        "Stunning views of Himalayan peaks",
        "Cultural center with Buddhist artifacts",
        "Ideal for spiritual retreats",
        "Photography restricted in certain areas"
      ]
    },
    {
      id: 4,
      name: "Samdruptse Hill & Guru Padmasambhava Statue",
      description:
        "Samdruptse Hill in Namchi is home to the towering statue of Guru Padmasambhava (135 ft), offering panoramic views of the region and serving as a key pilgrimage and photo point.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Samdruptse2.png",
      image2:
        "https://glacialtravels.com/Travel/southsikkim/Samdruptse.png",
      highlights1: [
        "135-feet tall Guru Padmasambhava statue",
        "Highest statue of Guru Rinpoche globally",
        "Panoramic views of entire South Sikkim",
        "Sacred site for Buddhist pilgrims",
        "Colorful prayer flags flutter around"
      ],
      highlights2: [
        "Accessible via well-maintained roads",
        "Small temple complex at base",
        "Sunrise and sunset views spectacular",
        "Local vendors sell religious items",
        "Peaceful environment for prayers"
      ]
    },
    {
      id: 5,
      name: "Maenam Hill",
      description:
        "Maenam Hill, part of the Maenam Wildlife Sanctuary accessible from Ravangla, is a popular trekking destination offering lush forests, panoramic views, and rich biodiversity.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Menaam.png",
      image2: MaenamHill,
      highlights1: [
        "Part of Maenam Wildlife Sanctuary",
        "Rich biodiversity with rare species",
        "Trekking trails through dense forests",
        "Panoramic views from hilltop",
        "Cool climate throughout the year"
      ],
      highlights2: [
        "Bird watching opportunities abundant",
        "Rhododendrons bloom in spring season",
        "Wildlife sightings possible during trek",
        "Camping spots available for overnight stays",
        "Local guides provide forest insights"
      ]
    },
    {
      id: 6,
      name: "Ralong Monastery",
      description:
        "Ralong Monastery, an ancient Buddhist monastery near Ravangla, is celebrated for its vivid murals, Tibetan architecture, and serene monastic ambiance amidst pine forests.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Ralong.png",
      image2:
        "https://glacialtravels.com/Travel/southsikkim/Ralong22.png",
      highlights1: [
        "Ancient Tibetan Buddhist monastery",
        "Vivid murals depicting Buddhist stories",
        "Traditional Tibetan architectural style",
        "Peaceful pine forest surroundings",
        "Monks perform daily prayer rituals"
      ],
      highlights2: [
        "Library contains ancient manuscripts",
        "Meditation halls open to visitors",
        "Prayer wheels surrounding main building",
        "Festival celebrations attract crowds",
        "Offers spiritual learning programs"
      ]
    },
    {
      id: 7,
      name: "Sai Mandir, Namchi",
      description:
        "Sai Mandir, located in Namchi near Char Dham, is a well-known temple devoted to Sai Baba, attracting devotees for its peaceful setting and spiritual environment.",
      image1: "https://glacialtravels.com/Travel/southsikkim/Sai%20mandir%202.png",
      image2: "https://glacialtravels.com/Travel/southsikkim/Sai%20mandir.png",
      highlights1: [
        "Dedicated to Shirdi Sai Baba",
        "Peaceful and serene temple atmosphere",
        "Regular aarti and prayer sessions",
        "Beautiful temple architecture",
        "Devotees from various faiths visit"
      ],
      highlights2: [
        "Temple courtyard for group prayers",
        "Prasadam distributed to visitors",
        "Thursday special prayers held",
        "Clean and well-maintained premises",
        "Located near other pilgrimage sites"
      ]
    },
    {
      id: 8,
      name: "Namchi Ropeway",
      description:
        "The Namchi Ropeway connects River View Point and Char Dham Complex, offering thrilling aerial views of the Namchi valley, tea gardens, and distant hills.",
      image1: "https://glacialtravels.com/Travel/southsikkim/Rope.png",
      image2:
        "https://glacialtravels.com/Travel/southsikkim/Rope22.png",
      highlights1: [
        "Connects River View Point to Char Dham",
        "Aerial views of Namchi valley",
        "Thrilling ride through mountains",
        "Glass cabins for clear visibility",
        "Safe and well-maintained system"
      ],
      highlights2: [
        "Tea gardens visible from cable cars",
        "Distant Himalayan peaks in view",
        "Comfortable seating for all ages",
        "Operating hours weather dependent",
        "Photography allowed during ride"
      ]
    },
    {
      id: 9,
      name: "Ravangla Rose Garden",
      description:
        "Ravangla's Rose Garden is an explosion of rose varieties set in well-maintained gardens, offering vibrant colours against the Himalayan backdrop during the flowering season.",
      image1: "https://glacialtravels.com/Travel/southsikkim/Rose2.png",
      image2:
        "https://glacialtravels.com/Travel/southsikkim/Rose.png",
      highlights1: [
        "Multiple varieties of roses cultivated",
        "Vibrant colors during blooming season",
        "Well-maintained garden pathways",
        "Himalayan backdrop enhances beauty",
        "Best visited during spring months"
      ],
      highlights2: [
        "Benches placed for peaceful sitting",
        "Photography enthusiasts love visiting",
        "Pleasant fragrance fills the air",
        "Local gardeners maintain flower beds",
        "Entry fee nominal for maintenance"
      ]
    },
    {
      id: 10,
      name: "Ngadak Monastery",
      description:
        "Ngadak Monastery, situated close to Ravangla, is a lesser-known but beautiful hilltop monastery known for its peaceful prayer halls and panoramic valley views.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Ngadak2.png",
      image2: "https://glacialtravels.com/Travel/southsikkim/Ngadak.png",
      highlights1: [
        "Lesser-known hilltop monastery",
        "Peaceful prayer halls for meditation",
        "Panoramic valley views from location",
        "Traditional Buddhist architecture",
        "Away from tourist crowds"
      ],
      highlights2: [
        "Monks available for spiritual guidance",
        "Ancient Buddhist scriptures preserved",
        "Prayer flags create colorful ambiance",
        "Sunrise views particularly stunning",
        "Quiet environment for reflection"
      ]
    },
    {
      id: 11,
      name: "Tarey Bhir (Cliff Walk)",
      description:
        "Tarey Bhir, located near Ravangla, is a sheer cliff-edge viewpoint offering thrilling cliff walks, adventure paths, and jaw-dropping views of the Ralong Khola valley below.",
      image1:
        "https://glacialtravels.com/Travel/southsikkim/Tarey.png",
      image2: "https://glacialtravels.com/Travel/southsikkim/tarey2.png",
      highlights1: [
        "Thrilling cliff-edge walking paths",
        "Jaw-dropping views of valley below",
        "Adventure activities for thrill seekers",
        "Safety railings along cliff edges",
        "Professional guides available"
      ],
      highlights2: [
        "Ralong Khola valley visible far below",
        "Not suitable for height-phobic visitors",
        "Best photography spot for landscapes",
        "Wind can be strong at cliff edge",
        "Sunrise and sunset views spectacular"
      ]
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.videoContainer}>
          <VideoHero 
            className={styles.heroVideo} 
            src="https://videocdn.cdnpk.net/videos/9e2b3f2b-7ee8-4a8b-9f79-cb650156e93b/horizontal/previews/watermarked/large.mp4" 
          />

          <div className={styles.videoOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>South Sikkim</h1>
          <p className={styles.heroCaption}>
             Feels like a journey of the soul
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>South Sikkim Overview</h2>
        <p className={styles.overviewText}>
          South Sikkim is a serene and picturesque region known for its lush
          greenery, gentle hills, and peaceful ambiance. With its pleasant
          climate and scenic beauty, it offers a perfect blend of spirituality,
          culture, and nature. The district is home to the popular town of
          Namchi, the administrative headquarters, which is a major center for
          religious tourism.
        </p>
      </section>

      {/* Destinations Section */}
      <section className={styles.destinationsSection}>
        {destinations.map((destination) => (
          <div key={destination.id} className={styles.destinationCard}>
            <h3 className={styles.destinationTitle}>{destination.name}</h3>
            <p className={styles.destinationDescription}>
              {destination.description}
            </p>
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

export default SouthSikkim;