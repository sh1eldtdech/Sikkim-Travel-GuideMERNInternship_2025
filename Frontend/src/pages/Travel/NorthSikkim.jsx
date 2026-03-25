// NorthSikkim.jsx
import React from "react";
import styles from "./SikkimRegion.module.css";
import NorthImg from "../../assets/North Sikkim/Gurudongmar Lake.jpg";
import North1 from "../../assets/North1.jpg"
import VideoHero from "../../components/VideoHero";

const NorthSikkim = () => {
  const destinations = [
    {
      id: 1,
      name: "Lachen",
      description:
        "Lachen is a beautiful village in North Sikkim, known for its peaceful and natural surroundings. It is surrounded by tall mountains, green forests, and clear lakes. The calm and quiet atmosphere makes it a perfect place for people who love nature or want to relax away from busy city life.",
      image1: "https://glacialtravels.com/Travel/northsikkim/Lachen2.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/Lachen.png",
      highlights1: [
        "Traditional wooden houses with mountain backdrop",
        "Starting point for Gurudongmar Lake trek",
        "Local Buddhist monastery with ancient artifacts",
        "Rhododendron forests bloom in spring",
        "Yak herders showcase traditional lifestyle"
      ],
      highlights2: [
        "Clear mountain streams flow through village",
        "Homestays offer authentic local cuisine",
        "Snow-capped peaks visible year-round",
        "Perfect base camp for high-altitude adventures",
        "Local guides share fascinating folklore"
      ]
    },
    {
      id: 2,
      name: "Lachung",
      description:
        "Lachung is a lovely village in North Sikkim, surrounded by colorful flowers, waterfalls, and tall mountains. It is known for its beautiful nature, friendly people, and rich culture. With its peaceful environment and stunning views, Lachung is a great place to visit and enjoy the beauty of the Himalayas.",
      image1: "https://glacialtravels.com/Travel/northsikkim/2.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/lachung.png",
      highlights1: [
        "Gateway to famous Yumthang Valley",
        "Apple orchards produce sweet mountain apples",
        "Lachung Monastery overlooks entire valley",
        "Traditional Lepcha architecture preserved",
        "Hot springs nearby for relaxation"
      ],
      highlights2: [
        "Confluence of Lachen and Lachung Rivers",
        "Local handicrafts sold by village women",
        "Spectacular sunrise views from hilltops",
        "Trekking trails lead to hidden waterfalls",
        "Village council maintains unique governance"
      ]
    },
    {
      id: 3,
      name: "Gurudongmar Lake",
      description:
        "Gurudongmar Lake, located in North Sikkim at a height of 17,800 feet, is a stunning and peaceful place. Surrounded by tall mountains, the lake is one of the highest in the world. Its clear blue water and beautiful views make it a truly magical spot that amazes everyone who visits.",
      image1: NorthImg,
      image2: North1,
      highlights1: [
        "Sacred to both Hindus and Buddhists",
        "Named after Guru Padmasambhava",
        "Crystal clear waters reflect sky perfectly",
        "Surrounded by barren Himalayan landscape",
        "Temperature drops below freezing even in summer"
      ],
      highlights2: [
        "One portion never freezes due to blessing",
        "Prayer flags flutter around lake perimeter",
        "Altitude causes breathlessness—acclimatize first",
        "Sunrise paints mountains in golden hues",
        "Photography restricted in certain areas"
      ]
    },
    {
      id: 4,
      name: "Yumthang Valley",
      description:
        "Yumthang Valley, located in North Sikkim, is a beautiful place known as the Valley of Flowers. It is surrounded by tall mountains, green forests, and colorful flowers, especially rhododendrons. With its peaceful nature, clear streams, and stunning views, Yumthang Valley is a great place for both relaxation and adventure.",
      image1:
        "https://glacialtravels.com/Travel/northsikkim/YumthangValley.png",
      image2:
        "https://glacialtravels.com/Travel/northsikkim/YumthangValley2.png",
      highlights1: [
        "Famous Valley of Flowers in Sikkim",
        "Rhododendrons bloom in vibrant colors",
        "Natural hot springs for therapeutic baths",
        "Yaks graze peacefully in meadows",
        "River Lachung flows through valley center"
      ],
      highlights2: [
        "Best visited during April-May for flowers",
        "Wooden bridges cross mountain streams",
        "Traditional yak cheese available locally",
        "Trekking base for higher altitude lakes",
        "Photography paradise during spring season"
      ]
    },
    {
      id: 5,
      name: "Zero Point",
      description:
        "Zero Point, the last civilian point accessible in North Sikkim, offers breathtaking views of snow-capped peaks and glaciers. Located at an altitude of about 15,300 feet, this destination provides a unique experience of standing at the edge of the Indo-China border area, surrounded by pristine Himalayan wilderness.",
      image1: "https://glacialtravels.com/Travel/northsikkim/ZeroPoint.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/ZeroPoint2.png",
      highlights1: [
        "Last point civilians can visit in North",
        "Panoramic views of Himalayan glaciers",
        "Snow-covered landscape throughout year",
        "Army checkposts ensure border security",
        "Oxygen levels significantly lower here"
      ],
      highlights2: [
        "Popular destination for adventure seekers",
        "Photography of peaks and glaciers allowed",
        "Road journey itself is thrilling adventure",
        "Clear weather offers spectacular mountain views",
        "Return journey must be completed before dark"
      ]
    },
    {
      id: 6,
      name: "Chopta Valley",
      description:
        "Chopta Valley, in North Sikkim, is a beautiful high-altitude valley known for its snowy mountains, flowing rivers, and colorful rhododendron forests. It offers amazing views and is also a starting point for treks to places like Gurudongmar Lake.",
      image1: "https://glacialtravels.com/Travel/northsikkim/Chopta2.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/ZeroPoint.png",
      highlights1: [
        "Trekking base for Gurudongmar Lake",
        "Ancient rhododendron trees line paths",
        "Military camps visible along routes",
        "High-altitude meadows perfect for camping",
        "Crystal clear mountain streams throughout"
      ],
      highlights2: [
        "Rare Himalayan blue poppy spotted here",
        "Traditional stone shelters for trekkers",
        "Sunrise views over Eastern Himalayas",
        "Yak trails connect to higher valleys",
        "Weather changes rapidly—carry warm clothes"
      ]
    },
    {
      id: 7,
      name: "Mangan",
      description:
        "Mangan, the main town of North Sikkim, is a peaceful and beautiful place. Surrounded by big mountains and green forests, it offers lovely views and a calm atmosphere. Mangan is perfect for people who want to relax and enjoy nature while also experiencing local culture and adventure.",
      image1: "https://glacialtravels.com/Travel/northsikkim/Mangan1.png",
      image2: "https://glacialtravels.com/images/places/Chungthang.jpg",
      highlights1: [
        "Administrative headquarters of North Sikkim",
        "Traditional markets sell local produce",
        "Government rest houses for travelers",
        "Starting point for various trekking routes",
        "Local festivals celebrated with enthusiasm"
      ],
      highlights2: [
        "Lepcha cultural center showcases heritage",
        "Scenic drives to nearby villages available",
        "Local guides available for mountain expeditions",
        "Traditional wooden architecture preserved",
        "Bridge over Teesta River connects districts"
      ]
    },
    {
      id: 8,
      name: "Thangu Valley",
      description:
        "Thangu Valley, in North Sikkim, is a peaceful and beautiful place often called the Hidden Valley. It is surrounded by tall mountains, green forests, and colorful wildflowers. With its quiet surroundings, clear streams, and scenic views, Thangu Valley is a great spot for nature lovers and adventurers.",
      image1: "https://glacialtravels.com/Travel/northsikkim/Thangu1.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/Thangu2.png",
      highlights1: [
        "Hidden valley off main tourist circuit",
        "Wildflowers carpet meadows in summer",
        "Traditional yak herding practices observed",
        "Ancient trade route to Tibet passes through",
        "Pristine mountain streams for fresh water"
      ],
      highlights2: [
        "Perfect solitude for meditation retreats",
        "Rare Himalayan wildlife spotting opportunities",
        "Traditional stone houses blend with landscape",
        "Local shepherds share mountain stories",
        "Camping under star-filled night skies"
      ]
    },
    {
      id: 9,
      name: "Mangshila View Point",
      description:
        "Mangshila View Point, located in North Sikkim, is a beautiful spot that offers wide views of the mountains and valleys. Surrounded by green forests and tall peaks, it is known for its amazing sunrises, sunsets, and colorful wildflowers. It's a peaceful and scenic place, perfect for nature lovers and photographers.",
      image1: "https://glacialtravels.com/Travel/northsikkim/mangshila.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/mangshila2.png",
      highlights1: [
        "Panoramic views of entire North Sikkim",
        "Sunrise photography spot for enthusiasts",
        "Wildflowers bloom during monsoon season",
        "Prayer flags mark sacred viewing points",
        "Clear weather reveals distant snow peaks"
      ],
      highlights2: [
        "Peaceful meditation spot away from crowds",
        "Local tea stalls serve hot beverages",
        "Trekking trails lead to higher viewpoints",
        "Sunset colors reflect on mountain faces",
        "Binoculars help spot distant landmarks"
      ]
    },
    {
      id: 10,
      name: "Phodong Monastery",
      description:
        "Phodong Monastery, in North Sikkim, is a peaceful and holy place that reflects the rich culture of the region. Surrounded by mountains and green forests, it is known for its beautiful buildings, colorful paintings, and detailed carvings. The monastery offers a calm and spiritual experience, making it a special place to visit in Sikkim.",
      image1: "https://glacialtravels.com/Travel/northsikkim/10.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/9.png",
      highlights1: [
        "18th-century Nyingma Buddhist monastery",
        "Ancient murals depict Buddhist teachings",
        "Monks perform daily prayers and rituals",
        "Traditional architecture with golden roofs",
        "Library contains rare Buddhist manuscripts"
      ],
      highlights2: [
        "Annual masked dance festivals celebrated",
        "Peaceful meditation halls for visitors",
        "Scenic location overlooks Teesta valley",
        "Traditional butter lamps illuminate halls",
        "Local pilgrims visit for blessings regularly"
      ]
    },
    {
      id: 11,
      name: "Hot Springs",
      description:
        "The hot springs in Sikkim, located in the Himalayas, are perfect for relaxing and refreshing the body. These natural springs are full of minerals and are believed to help heal and calm the mind. With green forests and tall mountains around, the hot springs offer a peaceful and soothing place to unwind.",
      image1: "https://glacialtravels.com/Travel/northsikkim/HotSpring1.png",
      image2: "https://glacialtravels.com/Travel/northsikkim/HotSpring2.png",
      highlights1: [
        "Natural mineral-rich thermal waters",
        "Therapeutic properties for muscle relief",
        "Separate bathing areas for privacy",
        "Surrounded by pristine mountain scenery",
        "Local legends attribute healing powers"
      ],
      highlights2: [
        "Temperature varies from warm to hot",
        "Best enjoyed during cold winter months",
        "Changing rooms available for visitors",
        "Sulfur content gives distinctive smell",
        "Popular stop during Yumthang valley trips"
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
            src="https://videos.pexels.com/video-files/15983714/15983714-hd_1920_1080_30fps.mp4" 
          />

          <div className={styles.videoOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>North Sikkim</h1>
          <p className={styles.heroCaption}>
            Where the Himalayas Awaken
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>North Sikkim Overview</h2>
        <p className={styles.overviewText}>
          North Sikkim is a breathtaking region known for its rugged terrain, high-altitude landscapes, and pristine natural beauty. It is the most remote and least populated district of Sikkim, offering a raw and untouched Himalayan experience. The area is perfect for nature lovers, adventure seekers, and those looking to explore Sikkim's unique biodiversity and culture.
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

export default NorthSikkim;