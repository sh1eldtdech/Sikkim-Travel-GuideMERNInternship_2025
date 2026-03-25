import React from 'react';
import styles from './SikkimRegion.module.css';
import Pelling1 from "../../assets/West Sikkim/Pelling.jpg";
import Yuksom from "../../assets/West Sikkim/Yuksom.webp";
import VideoHero from "../../components/VideoHero";

const WestSikkim = () => {
  const destinations = [
    {
      id: 1,
      name: "Pelling",
      description: "Pelling, a scenic hill town in West Sikkim, is renowned for its stunning views of Mount Kanchenjunga. This tranquil destination blends natural beauty, rich history, and thrilling adventure. Visitors flock to explore its picturesque landscapes, ancient monasteries, cascading waterfalls, and enjoy activities like trekking and paragliding.",
      image1: Pelling1,
      image2: "https://glacialtravels.com/Travel/westsikkim/pelling%20(1).png",
      highlights1: [
        "Spectacular views of Mount Kanchenjunga",
        "Ancient monasteries with rich history",
        "Perfect base for trekking adventures",
        "Cascading waterfalls nearby",
        "Paragliding opportunities available"
      ],
      highlights2: [
        "Peaceful hill station atmosphere",
        "Photography paradise for nature lovers",
        "Traditional Sikkimese culture experience",
        "Cool mountain climate year-round",
        "Easy access to multiple attractions"
      ]
    },
    {
      id: 2,
      name: "Yuksum",
      description: "Yuksom is known as the \"Gateway to Kanchenjunga\", as it is the starting point for the famous Goecha La Trek. It was also the first capital of Sikkim and has deep historical significance. The Coronation Throne of Norbugang, where the first Chogyal (King) of Sikkim was crowned, is an important historical site.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Yuksum2.png",
      image2: Yuksom,
      highlights1: [
        "Gateway to Kanchenjunga trek",
        "First capital of Sikkim",
        "Historic Coronation Throne site",
        "Starting point for Goecha La Trek",
        "Rich royal heritage and culture"
      ],
      highlights2: [
        "Sacred lakes and monasteries nearby",
        "Traditional Sikkimese architecture",
        "Trekking equipment and guides available",
        "Peaceful village atmosphere",
        "Ancient chortens and prayer wheels"
      ]
    },
    {
      id: 3,
      name: "Singhshore Bridge",
      description: "Singhshore Bridge is one of the highest suspension bridges in Sikkim, offering stunning views of deep valleys, waterfalls, and forests. Located near Uttarey, this bridge is around 200 meters long and is a great spot for adventure lovers and photographers. Walking on the bridge while enjoying the cool mountain air is an unforgettable experience.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Singshore2.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Singshore.jpg",
      highlights1: [
        "One of highest suspension bridges",
        "200 meters long engineering marvel",
        "Spectacular valley views below",
        "Adventure thrill for bridge walkers",
        "Perfect for photography enthusiasts"
      ],
      highlights2: [
        "Cool mountain breeze while crossing",
        "Waterfalls visible from bridge",
        "Dense forest canopy surroundings",
        "Safe walkway with protective railings",
        "Accessible from Uttarey village"
      ]
    },
    {
      id: 4,
      name: "Robdentse Ruins",
      description: "Rabdentse was the second capital of Sikkim (1670–1814) and now stands as a historic ruin surrounded by lush greenery. It offers a glimpse into the royal past of Sikkim, with stone chortens, palace remains, and meditation spots. To reach the site, visitors have to walk through a forested trail, making the journey peaceful and scenic.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Rabdents2.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Rabdents.jpg",
      highlights1: [
        "Second capital of Sikkim ruins",
        "Stone chortens and palace remains",
        "Meditation spots among ruins",
        "Forest trail leads to site",
        "Peaceful and scenic journey"
      ],
      highlights2: [
        "Royal history from 1670-1814",
        "Lush greenery surrounds ruins",
        "Archaeological significance preserved",
        "Quiet contemplation atmosphere",
        "Heritage site with cultural value"
      ]
    },
    {
      id: 5,
      name: "Kanchanjunga Falls",
      description: "One of the most famous waterfalls in Sikkim, Kanchenjunga Falls is a massive, multi-tiered waterfall surrounded by dense forests. The water originates from the glaciers of Mount Kanchenjunga, which gives it a powerful and mesmerizing flow. Located near Pelling, it is a popular tourist spot where visitors can take photos, enjoy the sound of cascading water, and even dip their feet in the cold mountain stream.",
      image1: "https://glacialtravels.com/Travel/westsikkim/KanchanFalls2.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/KanchanFalls.jpg",
      highlights1: [
        "Massive multi-tiered waterfall",
        "Water from Kanchenjunga glaciers",
        "Powerful and mesmerizing flow",
        "Dense forest surroundings",
        "Popular photography destination"
      ],
      highlights2: [
        "Cold mountain stream for dipping",
        "Cascading water sounds soothing",
        "Accessible from Pelling town",
        "Mist creates refreshing atmosphere",
        "Ideal picnic spot for families"
      ]
    },
    {
      id: 6,
      name: "Chenrezig Statue",
      description: "The Chenrezig Statue is one of the largest statues of Chenrezig (Avalokiteshvara), the Buddha of Compassion. It stands atop a hill in Pelling, offering panoramic views of the mountains. The glass Sky Walk, built alongside the statue, is the first of its kind in India.",
      image1: "https://glacialtravels.com/Travel/westsikkim/ChenzStatue.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/ChenzStatue2.jpg",
      highlights1: [
        "Largest Chenrezig statue in region",
        "Buddha of Compassion representation",
        "Panoramic mountain views from top",
        "First glass Sky Walk in India",
        "Spiritual significance for Buddhists"
      ],
      highlights2: [
        "Golden statue gleams in sunlight",
        "Hilltop location offers 360° views",
        "Modern engineering with tradition",
        "Popular meditation and prayer site",
        "Architectural marvel worth visiting"
      ]
    },
    {
      id: 7,
      name: "Varsey Rhododendron Sanctuary",
      description: "This sanctuary is a paradise for nature lovers, famous for its colorful rhododendron forests. During spring (March–May), the entire region turns into a vibrant mix of red, pink, and white rhododendron flowers. It is also home to Red Pandas, Himalayan Black Bears, and exotic bird species. Trekkers and photographers love this place for its serene atmosphere and breathtaking views of the Kanchenjunga range.",
      image1: "https://glacialtravels.com/Travel/westsikkim/RhodePark.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/RhodePark2.jpg",
      highlights1: [
        "Colorful rhododendron forests",
        "Spring blooms in red, pink, white",
        "Home to Red Pandas",
        "Himalayan Black Bears habitat",
        "Exotic bird species sanctuary"
      ],
      highlights2: [
        "Trekking paradise for nature lovers",
        "Photography opportunities abundant",
        "Serene and peaceful atmosphere",
        "Kanchenjunga range views",
        "Biodiversity conservation area"
      ]
    },
    {
      id: 8,
      name: "Pamayangtse Gompa",
      description: "One of the oldest and most important monasteries in Sikkim, Pemayangtse Gompa was founded in the 17th century and belongs to the Nyingma sect of Tibetan Buddhism. The monastery is beautifully decorated with ancient Buddhist murals, sculptures, and thangkas. A major attraction inside is the seven-tiered wooden structure called \"Zangdok Palri,\" which depicts Guru Padmasambhava's heavenly palace.",
      image1: "https://glacialtravels.com/Travel/westsikkim/PemagystaGompa.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/PemagystaGompa2.jpg",
      highlights1: [
        "Oldest monastery in Sikkim",
        "Founded in 17th century",
        "Nyingma sect of Tibetan Buddhism",
        "Ancient Buddhist murals and sculptures",
        "Beautiful thangkas collection"
      ],
      highlights2: [
        "Seven-tiered Zangdok Palri structure",
        "Guru Padmasambhava's palace depiction",
        "Active monastery with monks",
        "Spiritual ceremonies and rituals",
        "Architectural heritage preservation"
      ]
    },
    {
      id: 9,
      name: "Sky Walk",
      description: "The Sky Walk in Pelling is the first glass skywalk in India. Built near the Chenrezig Statue, this attraction offers an exciting experience of walking on a transparent floor while enjoying stunning views of the mountains and valleys below. Tourists love taking photos here, as the backdrop includes snow-capped peaks and a giant golden Buddha statue. It's a must-visit for adventure seekers and photographers",
      image1: "https://glacialtravels.com/Travel/westsikkim/SkyWalk2.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Sky%20walk.jpg",
      highlights1: [
        "First glass skywalk in India",
        "Transparent floor walking experience",
        "Stunning mountain and valley views",
        "Near giant golden Buddha statue",
        "Adventure thrill for visitors"
      ],
      highlights2: [
        "Perfect photography backdrop",
        "Snow-capped peaks visible",
        "Safe glass construction",
        "Must-visit for thrill seekers",
        "Unique perspective of landscape"
      ]
    },
    {
      id: 10,
      name: "Dzongri La",
      description: "Dzongri La is a high-altitude mountain pass and a dream destination for trekkers and adventure lovers. Located at around 4,200 meters above sea level, it offers breathtaking views of Mount Kanchenjunga and other Himalayan peaks. The trek to Dzongri is challenging but rewarding, passing through lush forests, rhododendron trails, and alpine meadows.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Dzongri.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Dzongri2.jpg",
      highlights1: [
        "High-altitude mountain pass at 4,200m",
        "Dream destination for trekkers",
        "Breathtaking Kanchenjunga views",
        "Multiple Himalayan peaks visible",
        "Challenging but rewarding trek"
      ],
      highlights2: [
        "Lush forests along trek route",
        "Rhododendron trails in spring",
        "Alpine meadows with wildflowers",
        "Adventure lovers paradise",
        "Spectacular sunrise and sunset views"
      ]
    },
    {
      id: 11,
      name: "Kirateshwar Mahadev Temple",
      description: "This is a sacred Hindu temple dedicated to Lord Shiva, located on the banks of the Rangit River. The temple is believed to be a powerful spiritual site, attracting devotees from across Sikkim and nearby regions. It is especially crowded during the Shivratri festival. The peaceful riverside location makes it a great place for prayers and meditation.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Mahadev%20temple.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Mahadev%20temple.png",
      highlights1: [
        "Sacred Hindu temple to Lord Shiva",
        "Located on Rangit River banks",
        "Powerful spiritual site",
        "Devotees from across region visit",
        "Crowded during Shivratri festival"
      ],
      highlights2: [
        "Peaceful riverside location",
        "Ideal for prayers and meditation",
        "Holy river adds spiritual ambiance",
        "Traditional temple architecture",
        "Religious ceremonies held regularly"
      ]
    },
    {
      id: 12,
      name: "Yangthang Farms",
      description: "Yangthang Farms is a quiet countryside retreat where visitors can experience organic farming and traditional Sikkimese village life. The farm is known for its fresh dairy products, fruits, and vegetables. Tourists can take a relaxing walk, learn about organic farming, and taste homemade Sikkimese food. It's a great spot for nature lovers and those looking for a peaceful rural experience.",
      image1: "https://glacialtravels.com/Travel/westsikkim/Yangthang.jpg",
      image2: "https://glacialtravels.com/Travel/westsikkim/Yangthang2.jpg",
      highlights1: [
        "Quiet countryside retreat",
        "Organic farming experience",
        "Traditional Sikkimese village life",
        "Fresh dairy products available",
        "Organic fruits and vegetables"
      ],
      highlights2: [
        "Relaxing walks through farm",
        "Learn organic farming techniques",
        "Taste homemade Sikkimese food",
        "Perfect for nature lovers",
        "Peaceful rural experience"
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
            src="https://media.istockphoto.com/id/2216220084/video/breathtaking-landscapes-of-the-everest-region-with-snow-capped-peaks-glacial-rivers-and.mp4?s=mp4-640x640-is&k=20&c=OqiD7F0Y4KSeKAw4wPulhWx4MO7g2MF9yNM2TjkMdgU=" 
          />
          <div className={styles.videoOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>West Sikkim</h1>
          <p className={styles.heroCaption}>Your Himalayan Escape</p>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>West Sikkim Overview</h2>
        <p className={styles.overviewText}>
          West Sikkim enchants visitors with its stunning natural landscapes, vibrant culture, and peaceful spiritual atmosphere. Discover the picturesque hill station of Pelling, famed for its spectacular views of the Kanchenjunga range.
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

export default WestSikkim;