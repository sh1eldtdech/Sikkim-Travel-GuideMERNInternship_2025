import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import styles from "./Article.module.css";
import Gangtok from "../../assets/East Sikkim/Gangtok.jpg";
import North from "../../assets/North Sikkim/Gurudongmar Lake.jpg";
import Moasteries from "../../assets/North3.jpg";
import Homestays from "../../assets/Homestays.jpg";
import Sustainable from "../../assets/West Sikkim/Pelling.jpg";

const Article = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedArticle, setExpandedArticle] = useState(null);

  const sanitizeArticleHtml = (content) => DOMPurify.sanitize(content);

  const articles = [
    {
      id: 1,
      title: "Complete Guide to Gangtok: The Capital of Sikkim",
      category: "destinations",
      author: "Travel Expert",
      date: "2024-01-15",
      readTime: "8 min read",
      image: Gangtok,
      excerpt:
        "Discover the vibrant capital city of Sikkim with its monasteries, markets, and mountain views.",
      content: `
        <p>Gangtok, the capital of Sikkim, is a mesmerizing hill station nestled in the Eastern Himalayas at an elevation of 1,650 meters. This enchanting city serves as the perfect gateway to explore the beauty of Sikkim.</p>
        
        <h3>Top Attractions in Gangtok</h3>
        <p><strong>MG Marg:</strong> The heart of Gangtok, this pedestrian-only street is lined with shops, restaurants, and cafes. It's the perfect place for evening strolls and shopping for local handicrafts.</p>
        
        <p><strong>Rumtek Monastery:</strong> One of the most significant monasteries in Sikkim, Rumtek is home to the Dharma Chakra Centre. The monastery offers stunning views and deep spiritual experiences.</p>
        
        <p><strong>Tsomgo Lake:</strong> Located 38 km from Gangtok, this glacial lake is a must-visit destination. The lake remains frozen during winter and offers breathtaking views of the surrounding mountains.</p>
        
        <h3>Best Time to Visit</h3>
        <p>October to December and March to June are the ideal months to visit Gangtok. The weather is pleasant, and you can enjoy clear mountain views.</p>
        
        <h3>Local Cuisine</h3>
        <p>Don't miss trying momos, thukpa, and gundruk while in Gangtok. The local markets offer fresh organic vegetables and unique Sikkimese delicacies.</p>
      `,
    },
    {
      id: 2,
      title: "Trekking in North Sikkim: A Complete Adventure Guide",
      category: "adventure",
      author: "Adventure Specialist",
      date: "2024-01-20",
      readTime: "12 min read",
      image: North,
      excerpt:
        "Explore the pristine wilderness of North Sikkim with challenging treks and stunning landscapes.",
      content: `
        <p>North Sikkim offers some of the most challenging and rewarding trekking experiences in the Indian Himalayas. With its high-altitude landscapes, glacial lakes, and snow-capped peaks, it's a paradise for adventure enthusiasts.</p>
        
        <h3>Popular Trekking Routes</h3>
        <p><strong>Green Lake Trek:</strong> One of the most challenging treks in Sikkim, this 8-day journey takes you to the base of Kanchenjunga. The trek offers stunning views of glaciers and high-altitude flora.</p>
        
        <p><strong>Lachen-Lachung Circuit:</strong> A moderate trek that combines the beauty of both Lachen and Lachung valleys. Perfect for those who want to experience North Sikkim's diversity.</p>
        
        <h3>Essential Preparations</h3>
        <p>Proper acclimatization is crucial for North Sikkim treks. Spend at least 2-3 days in Gangtok before heading to higher altitudes. Carry warm clothing, proper trekking gear, and high-altitude medicines.</p>
        
        <h3>Permits Required</h3>
        <p>Protected Area Permit (PAP) is mandatory for North Sikkim. Apply through registered travel agencies or the Sikkim Tourism Office. Foreign nationals need additional permits.</p>
        
        <h3>Best Season</h3>
        <p>April to June and September to November are ideal for trekking. Avoid monsoon season (July-August) due to heavy rainfall and landslides.</p>
      `,
    },
    {
      id: 3,
      title: "Sacred Monasteries of Sikkim: A Spiritual Journey",
      category: "culture",
      author: "Cultural Expert",
      date: "2024-01-25",
      readTime: "10 min read",
      image: Moasteries,
      excerpt:
        "Discover the spiritual heritage of Sikkim through its ancient monasteries and Buddhist traditions.",
      content: `
        <p>Sikkim's monasteries are not just religious centers but also repositories of art, culture, and history. Each monastery tells a unique story of Buddhist philosophy and Himalayan culture.</p>
        
        <h3>Must-Visit Monasteries</h3>
        <p><strong>Pemayangtse Monastery:</strong> The most sacred monastery in Sikkim, reserved only for pure-blooded Bhutia monks. It houses a beautiful seven-tiered wooden sculpture depicting the celestial palace of Guru Rinpoche.</p>
        
        <p><strong>Tashiding Monastery:</strong> Known as the most sacred monastery in Sikkim, it's believed that a pilgrimage here can wash away sins. The monastery offers panoramic views of the Himalayas.</p>
        
        <p><strong>Enchey Monastery:</strong> Located in Gangtok, this monastery is famous for its annual Cham dance performed during the Pang Lhabsol festival.</p>
        
        <h3>Monastery Etiquette</h3>
        <p>Dress modestly, remove shoes before entering, don't point feet toward Buddha statues, and maintain silence during prayers. Photography may be restricted in certain areas.</p>
        
        <h3>Festival Calendar</h3>
        <p>Plan your visit during major festivals like Saga Dawa, Pang Lhabsol, or Lhabab Duchen to witness colorful celebrations and traditional mask dances.</p>
      `,
    },
    {
      id: 4,
      title: "Sikkim's Organic Revolution: Farm-to-Table Experience",
      category: "food",
      author: "Food Blogger",
      date: "2024-02-01",
      readTime: "6 min read",
      image:
        "https://panorama.solutions/sites/default/files/5fb6884d-3fc8-4cc5-b6e5-44d1ed5470cd.jpg",
      excerpt:
        "Explore Sikkim's organic farming practices and taste authentic farm-to-table cuisine.",
      content: `
        <p>Sikkim made history by becoming India's first fully organic state in 2016. This transformation has not only preserved the environment but also created a unique culinary landscape.</p>
        
        <h3>Organic Farming Practices</h3>
        <p>Sikkim's farmers use traditional methods combined with modern organic techniques. Terraced farming, crop rotation, and natural pest control are common practices across the state.</p>
        
        <h3>Signature Dishes</h3>
        <p><strong>Gundruk:</strong> Fermented leafy green vegetable soup that's rich in probiotics and nutrients. It's a staple food in Sikkimese households.</p>
        
        <p><strong>Sinki:</strong> Fermented radish tap root that's dried and used in various preparations. It's unique to the region and has medicinal properties.</p>
        
        <p><strong>Churpi:</strong> Traditional yak cheese that can be soft or hard. It's a protein-rich snack popular among locals and tourists.</p>
        
        <h3>Farm Visits</h3>
        <p>Many farms offer guided tours where visitors can learn about organic farming, participate in harvesting, and enjoy fresh farm meals.</p>
        
        <h3>Cooking Classes</h3>
        <p>Several homestays and cultural centers offer cooking classes where you can learn to prepare traditional Sikkimese dishes using organic ingredients.</p>
      `,
    },
    {
      id: 5,
      title: "Rhododendron Season: When Sikkim Blooms",
      category: "nature",
      author: "Nature Photographer",
      date: "2024-02-10",
      readTime: "7 min read",
      image:
        "https://charukesi.com/itchyfeet/wp-content/uploads/2010/04/03.jpg",
      excerpt:
        "Witness the spectacular rhododendron blooms that paint Sikkim's mountains in vibrant colors.",
      content: `
        <p>Sikkim's rhododendron season is a spectacular natural phenomenon that transforms the entire landscape into a canvas of vibrant colors. The state flower blooms in various shades across different altitudes.</p>
        
        <h3>Blooming Calendar</h3>
        <p><strong>March-April:</strong> Lower altitude rhododendrons (red and pink) bloom first, particularly visible around Gangtok and South Sikkim.</p>
        
        <p><strong>April-May:</strong> Higher altitude varieties bloom, including the rare blue and white rhododendrons found in North and West Sikkim.</p>
        
        <h3>Best Viewing Locations</h3>
        <p><strong>Rhododendron Sanctuary:</strong> Located in Barsey, this 104-hectare sanctuary houses over 600 species of rhododendrons.</p>
        
        <p><strong>Yumthang Valley:</strong> Known as the Valley of Flowers, it's carpeted with rhododendrons during spring season.</p>
        
        <p><strong>Singalila Ridge:</strong> Offers panoramic views of rhododendron forests with Kanchenjunga in the background.</p>
        
        <h3>Photography Tips</h3>
        <p>Early morning light provides the best conditions for photography. Use polarizing filters to reduce glare and enhance colors. Macro lenses are perfect for close-up shots of individual blooms.</p>
        
        <h3>Conservation Efforts</h3>
        <p>Sikkim has established several protected areas to conserve rhododendron species. Visitors are encouraged to follow eco-friendly practices during their visits.</p>
      `,
    },
    {
      id: 6,
      title: "Kanchenjunga: The Guardian of Sikkim",
      category: "mountains",
      author: "Mountain Guide",
      date: "2024-02-15",
      readTime: "9 min read",
      image:
        "https://www.fusionstays.com/blog/wp-content/uploads/2024/12/banner-1024x446.jpg",
      excerpt:
        "Learn about the majestic Kanchenjunga, the world's third-highest peak and Sikkim's guardian mountain.",
      content: `
        <p>Kanchenjunga, standing at 8,586 meters, is not just the world's third-highest peak but also the guardian deity of Sikkim. The mountain holds deep spiritual significance for the people of Sikkim.</p>
        
        <h3>Cultural Significance</h3>
        <p>In Sikkimese culture, Kanchenjunga is revered as Dzö-nga, the treasury of the five great treasures of God. The five peaks represent the five treasures: gold, silver, gems, grain, and holy books.</p>
        
        <h3>Best Viewing Points</h3>
        <p><strong>Tiger Hill, Darjeeling:</strong> The most famous viewpoint for sunrise views of Kanchenjunga.</p>
        
        <p><strong>Tashiding Monastery:</strong> Offers stunning views of the entire Kanchenjunga range from a spiritual setting.</p>
        
        <p><strong>Dzongri:</strong> A trekking destination that provides close-up views of the mountain's south face.</p>
        
        <h3>Mountaineering History</h3>
        <p>First climbed in 1955 by a British expedition, Kanchenjunga has a rich mountaineering history. The climbers honored local beliefs by stopping just short of the summit.</p>
        
        <h3>Conservation</h3>
        <p>The Kanchenjunga Conservation Area protects the mountain's ecosystem and supports local communities through sustainable tourism practices.</p>
        
        <h3>Weather Patterns</h3>
        <p>Clear views are most common during pre-monsoon (March-May) and post-monsoon (October-December) seasons. Early morning hours offer the best visibility.</p>
      `,
    },
    {
      id: 7,
      title: "Homestays in Sikkim: Living with Local Families",
      category: "accommodation",
      author: "Travel Writer",
      date: "2024-02-20",
      readTime: "8 min read",
      image: Homestays,
      excerpt:
        "Experience authentic Sikkimese culture through homestay accommodations across the state.",
      content: `
        <p>Homestays in Sikkim offer an unparalleled opportunity to experience the warmth of Sikkimese hospitality while immersing yourself in local culture, traditions, and daily life.</p>
        
        <h3>Popular Homestay Destinations</h3>
        <p><strong>Yuksom:</strong> Historic village homestays offer proximity to Khangchendzonga National Park and trekking routes.</p>
        
        <p><strong>Lachen and Lachung:</strong> High-altitude homestays provide authentic mountain experiences with stunning valley views.</p>
        
        <p><strong>Pelling:</strong> Homestays with views of Kanchenjunga and access to monasteries and waterfalls.</p>
        
        <h3>What to Expect</h3>
        <p>Homestays typically include comfortable rooms, shared meals with the host family, and opportunities to participate in daily activities like farming, cooking, and local festivals.</p>
        
        <h3>Cultural Immersion</h3>
        <p>Guests can learn traditional crafts, participate in religious ceremonies, help with organic farming, and enjoy authentic Sikkimese meals prepared with local ingredients.</p>
        
        <h3>Booking Guidelines</h3>
        <p>Book through registered homestay networks or the Sikkim Tourism Development Corporation. Advance booking is recommended, especially during peak seasons.</p>
        
        <h3>Etiquette and Respect</h3>
        <p>Respect local customs, dress modestly, participate in household activities, and maintain cleanliness. Remember you're a guest in someone's home.</p>
      `,
    },
    {
      id: 8,
      title: "Wildlife Sanctuaries: Sikkim's Biodiversity Hotspots",
      category: "wildlife",
      author: "Wildlife Photographer",
      date: "2024-02-25",
      readTime: "10 min read",
      image:
        "https://clubmahindra.gumlet.io/blog/images/Tiger.jpg?dpr=2.6&w=376",
      excerpt:
        "Discover Sikkim's rich biodiversity through its protected wildlife sanctuaries and national parks.",
      content: `
        <p>Sikkim, despite its small size, is home to incredible biodiversity. The state has several protected areas that conserve unique Himalayan ecosystems and endangered species.</p>
        
        <h3>Khangchendzonga National Park</h3>
        <p>A UNESCO World Heritage Site, this park is home to the snow leopard, red panda, Himalayan black bear, and over 550 bird species. The park covers 1,784 square kilometers of pristine wilderness.</p>
        
        <h3>Fambong Lho Wildlife Sanctuary</h3>
        <p>Known for its rich birdlife, this sanctuary is perfect for bird watchers. Species include the Himalayan monal, kalij pheasant, and various species of laughing thrushes.</p>
        
        <h3>Pangolakha Wildlife Sanctuary</h3>
        <p>This high-altitude sanctuary protects alpine ecosystems and is home to the elusive snow leopard, blue sheep, and Tibetan wolf.</p>
        
        <h3>Best Wildlife Viewing</h3>
        <p><strong>Red Panda:</strong> Best spotted in bamboo forests of Singalila and Khangchendzonga National Parks during early morning hours.</p>
        
        <p><strong>Snow Leopard:</strong> Extremely rare sightings in high-altitude areas during winter months.</p>
        
        <h3>Conservation Efforts</h3>
        <p>Community-based conservation programs involve local communities in wildlife protection and provide alternative livelihoods through eco-tourism.</p>
        
        <h3>Visiting Guidelines</h3>
        <p>Obtain necessary permits, follow designated trails, maintain silence, and never feed wildlife. Photography may require additional permits.</p>
      `,
    },
    {
      id: 9,
      title: "Sikkim's Festivals: A Cultural Calendar",
      category: "culture",
      author: "Cultural Researcher",
      date: "2024-03-01",
      readTime: "11 min read",
      image:
        "https://i0.wp.com/travelshoebum.com/wp-content/uploads/2018/09/dsc3243.jpg?fit=3264%2C4715&ssl=1",
      excerpt:
        "Explore the vibrant festivals of Sikkim that showcase the state's rich cultural heritage.",
      content: `
        <p>Sikkim's festivals are colorful celebrations that bring together diverse communities and showcase the state's rich cultural tapestry. These celebrations are deeply rooted in Buddhist and Hindu traditions.</p>
        
        <h3>Major Buddhist Festivals</h3>
        <p><strong>Saga Dawa:</strong> The most important Buddhist festival celebrating Buddha's birth, enlightenment, and death. Pilgrims circumambulate sacred sites and offer prayers.</p>
        
        <p><strong>Pang Lhabsol:</strong> Unique to Sikkim, this festival honors Mount Kanchenjunga and the guardian deities. Spectacular mask dances are performed at monasteries.</p>
        
        <p><strong>Lhabab Duchen:</strong> Celebrates Buddha's descent from heaven. Monasteries are decorated with lights and butter lamps.</p>
        
        <h3>Hindu Festivals</h3>
        <p><strong>Dasain:</strong> The most important Hindu festival in Sikkim, celebrating the victory of good over evil. Families gather for elaborate feasts and ceremonies.</p>
        
        <p><strong>Tihar:</strong> Festival of lights with unique Sikkimese traditions, including the worship of cows, dogs, and crows.</p>
        
        <h3>Seasonal Celebrations</h3>
        <p><strong>Losar:</strong> Tibetan New Year celebrated with traditional foods, prayers, and cultural performances.</p>
        
        <p><strong>Maghey Sankranti:</strong> Marks the end of winter and celebrates the sun's journey northward.</p>
        
        <h3>Festival Participation</h3>
        <p>Tourists are welcome to observe and participate in festivals. Join community celebrations, taste traditional foods, and witness cultural performances.</p>
        
        <h3>Photography Ethics</h3>
        <p>Always ask permission before photographing religious ceremonies or people. Some rituals may be sacred and off-limits to photography.</p>
      `,
    },
    {
      id: 10,
      title: "Alpine Lakes of Sikkim: Jewels of the Himalayas",
      category: "nature",
      author: "Nature Explorer",
      date: "2024-03-05",
      readTime: "9 min read",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b4/Tsongmo_Lake_or_Changu_Lake_-_East_Sikkim.jpg",
      excerpt:
        "Discover the pristine alpine lakes scattered across Sikkim's high-altitude landscapes.",
      content: `
        <p>Sikkim's alpine lakes are among the most pristine and beautiful water bodies in the Himalayas. These glacial lakes, situated at various altitudes, offer breathtaking views and spiritual significance.</p>
        
        <h3>Sacred Lakes</h3>
        <p><strong>Tsomgo Lake:</strong> Also known as Changu Lake, this glacial lake is considered sacred by locals. It remains frozen during winter and reflects the surrounding mountains beautifully.</p>
        
        <p><strong>Gurudongmar Lake:</strong> One of the highest lakes in the world at 5,430 meters, named after Guru Rinpoche. The lake is believed to have healing properties.</p>
        
        <h3>Hidden Gems</h3>
        <p><strong>Khecheopalri Lake:</strong> Known as the wish-fulfilling lake, it's considered sacred by both Buddhists and Hindus. The lake's surface is said to remain clean as birds pick up fallen leaves.</p>
        
        <p><strong>Green Lake:</strong> Located at 4,900 meters, this remote lake requires a challenging trek but offers unparalleled beauty and solitude.</p>
        
        <h3>Best Time to Visit</h3>
        <p>May to October for lower altitude lakes, while high-altitude lakes are accessible only during summer months (June-September).</p>
        
        <h3>Trekking to Lakes</h3>
        <p>Many lakes require trekking through challenging terrain. Proper preparation, guides, and permits are essential for high-altitude lake visits.</p>
        
        <h3>Conservation</h3>
        <p>These pristine ecosystems are fragile. Visitors must follow leave-no-trace principles and respect local customs associated with sacred lakes.</p>
        
        <h3>Photography Tips</h3>
        <p>Early morning and late afternoon provide the best lighting. Use polarizing filters to reduce glare and capture the true colors of the water.</p>
      `,
    },
    {
      id: 11,
      title: "Traditional Crafts of Sikkim: Preserving Heritage",
      category: "culture",
      author: "Handicraft Expert",
      date: "2024-03-10",
      readTime: "8 min read",
      image:
        "https://www.sikkimtours.online/assets/images/craft//sikkim-art-craft-01.webp",
      excerpt:
        "Explore the traditional crafts and handicrafts that represent Sikkim's rich cultural heritage.",
      content: `
        <p>Sikkim's traditional crafts reflect the artistic heritage of its diverse communities. These handicrafts are not just decorative items but carry deep cultural significance and ancestral wisdom.</p>
        
        <h3>Carpet Weaving</h3>
        <p>Tibetan carpet weaving is a prominent craft in Sikkim. These carpets feature traditional motifs and are hand-woven using techniques passed down through generations.</p>
        
        <h3>Thangka Painting</h3>
        <p>Sacred Buddhist paintings on canvas or silk, depicting deities, mandalas, and religious scenes. These require years of training and are considered spiritual practices.</p>
        
        <h3>Wood Carving</h3>
        <p>Intricate wooden sculptures and decorative items featuring Buddhist symbols, dragons, and floral motifs. Walnut and pine wood are commonly used.</p>
        
        <h3>Bamboo and Cane Work</h3>
        <p>Practical items like baskets, furniture, and decorative pieces made from local bamboo and cane. These crafts are environmentally sustainable and locally sourced.</p>
        
        <h3>Traditional Jewelry</h3>
        <p>Silver jewelry with turquoise and coral, including prayer wheels, amulets, and traditional ornaments worn during festivals and ceremonies.</p>
        
        <h3>Where to Buy</h3>
        <p>Government emporiums, local markets, and craft centers in Gangtok offer authentic handicrafts. Always verify authenticity and support local artisans.</p>
        
        <h3>Learning Opportunities</h3>
        <p>Several institutes and workshops offer courses in traditional crafts. The Sikkim Institute of Tibetology provides insights into traditional art forms.</p>
        
        <h3>Preservation Efforts</h3>
        <p>Government initiatives and NGOs work to preserve traditional crafts by providing training, marketing support, and promoting these arts among younger generations.</p>
      `,
    },
    {
      id: 12,
      title: "Sikkim's Tea Gardens: From Leaf to Cup",
      category: "food",
      author: "Tea Connoisseur",
      date: "2024-03-15",
      readTime: "7 min read",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cherry_Resort_inside_Temi_Tea_Garden%2C_Namchi%2C_Sikkim.jpg",
      excerpt:
        "Discover the world-renowned tea gardens of Sikkim and the art of tea cultivation.",
      content: `
        <p>Sikkim's tea gardens produce some of the finest teas in the world. The high-altitude cultivation and organic practices create unique flavors that are celebrated globally.</p>
        
        <h3>Famous Tea Estates</h3>
        <p><strong>Temi Tea Garden:</strong> The only tea garden in Sikkim, spreading over 435 hectares. It produces high-quality black tea with a unique flavor profile.</p>
        
        <p><strong>Organic Certification:</strong> Temi tea is certified organic, making it highly sought after in international markets.</p>
        
        <h3>Tea Processing</h3>
        <p>The tea processing involves withering, rolling, fermentation, and drying. Traditional methods are combined with modern techniques to maintain quality.</p>
        
        <h3>Varieties Produced</h3>
        <p><strong>Black Tea:</strong> Full-bodied with a robust flavor, perfect for morning consumption.</p>
        
        <p><strong>Green Tea:</strong> Light and refreshing with numerous health benefits.</p>
        
        <p><strong>White Tea:</strong> Delicate and subtle, considered the premium variety.</p>
        
        <h3>Tea Tasting Experience</h3>
        <p>Visit tea gardens for guided tours that include tea tasting sessions, processing demonstrations, and insights into tea cultivation.</p>
        
        <h3>Health Benefits</h3>
        <p>Sikkim teas are rich in antioxidants and have various health benefits including improved metabolism and heart health.</p>
        
        <h3>Buying Guide</h3>
        <p>Purchase directly from tea gardens or authorized dealers. Look for organic certification and proper packaging to ensure authenticity.</p>
        
        <h3>Tea Culture</h3>
        <p>Tea is an integral part of Sikkimese culture, served during all social gatherings and religious ceremonies.</p>
      `,
    },
    {
      id: 13,
      title: "Adventure Sports in Sikkim: Thrills in the Himalayas",
      category: "adventure",
      author: "Adventure Guide",
      date: "2024-03-20",
      readTime: "10 min read",
      image:
        "https://www.esikkimtourism.in/wp-content/uploads/2019/05/adventorus-tour.jpg",
      excerpt:
        "Experience heart-pumping adventure sports in Sikkim's stunning mountain landscapes.",
      content: `
        <p>Sikkim offers a wide range of adventure sports that cater to thrill-seekers of all levels. From river rafting to paragliding, the state provides perfect conditions for various adventure activities.</p>
        
        <h3>River Rafting</h3>
        <p><strong>Teesta River:</strong> Offers grades II-IV rapids, suitable for beginners to experienced rafters. The rafting season runs from October to April.</p>
        
        <p><strong>Rangit River:</strong> Gentler rapids perfect for families and beginners. Beautiful scenery along the route.</p>
        
        <h3>Paragliding</h3>
        <p>Gangtok and surrounding areas offer excellent paragliding opportunities with stunning mountain views. Professional instructors and tandem flights are available.</p>
        
        <h3>Mountain Biking</h3>
        <p>Sikkim's mountain trails provide excellent biking opportunities. Popular routes include Gangtok to Tsomgo Lake and various monastery circuits.</p>
        
        <h3>Rock Climbing</h3>
        <p>Natural rock faces around Gangtok and Namchi offer climbing opportunities for different skill levels. Proper equipment and guides are essential.</p>
        
        <h3>Zip Lining</h3>
        <p>Several locations offer zip lining experiences with valley views. Safety equipment and trained operators ensure secure adventures.</p>
        
        <h3>Safety Guidelines</h3>
        <p>Always use certified operators, follow safety instructions, wear appropriate gear, and inform someone about your adventure plans.</p>
        
        <h3>Best Season</h3>
        <p>March to May and September to November are ideal for most adventure sports. Weather conditions are stable and visibility is excellent.</p>
        
        <h3>Certification and Training</h3>
        <p>Several adventure sports institutes in Sikkim offer certification courses and training programs for various activities.</p>
      `,
    },
    {
      id: 14,
      title: "Sikkim's Medicinal Plants: Nature's Pharmacy",
      category: "nature",
      author: "Botanist",
      date: "2024-03-25",
      readTime: "9 min read",
      image:
        "https://sikkimtourism.org/wp-content/uploads/2024/06/Floral-Celebration.jpg",
      excerpt:
        "Explore Sikkim's rich tradition of medicinal plants and their therapeutic uses.",
      content: `
        <p>Sikkim is home to over 4,000 flowering plants, many of which have medicinal properties. The state's diverse climate zones support a wide variety of therapeutic herbs used in traditional medicine.</p>
        
        <h3>Traditional Medicine Systems</h3>
        <p><strong>Sowa Rigpa:</strong> Traditional Tibetan medicine system widely practiced in Sikkim. It emphasizes balance between mind, body, and spirit.</p>
        
        <p><strong>Ayurveda:</strong> Hindu traditional medicine system that uses local herbs for various treatments.</p>
        
        <h3>Important Medicinal Plants</h3>
        <p><strong>Cordyceps:</strong> A fungus found in high-altitude areas, valued for its immune-boosting properties.</p>
        
        <p><strong>Yarsagumba:</strong> Known as Himalayan Viagra, this caterpillar fungus is extremely valuable and rare.</p>
        
        <p><strong>Rhododendron:</strong> Various species have medicinal properties and are used in traditional treatments.</p>
        
        <h3>Research and Conservation</h3>
        <p>The Institute of Traditional Medicine in Sikkim researches medicinal plants and develops sustainable harvesting practices.</p>
        
        <h3>Medicinal Plant Gardens</h3>
        <p>Several gardens showcase medicinal plants with information about their properties and uses. These serve as educational centers for visitors.</p>
        
        <h3>Sustainable Harvesting</h3>
        <p>Community-based programs ensure sustainable collection of medicinal plants while providing livelihoods to local communities.</p>
        
        <h3>Modern Research</h3>
        <p>Scientists are studying Sikkim's medicinal plants for developing new drugs and treatments. Several compounds have shown promising results in laboratory studies.</p>
        
        <h3>Visiting Guidelines</h3>
        <p>Respect local customs regarding medicinal plants, don't collect plants without permission, and consult traditional healers for authentic information.</p>
      `,
    },
    {
      id: 15,
      title: "Sustainable Tourism in Sikkim: Responsible Travel",
      category: "travel-tips",
      author: "Sustainability Expert",
      date: "2024-03-30",
      readTime: "8 min read",
      image: Sustainable,
      excerpt:
        "Learn how to travel responsibly in Sikkim while supporting local communities and protecting the environment.",
      content: `
        <p>Sikkim has positioned itself as a leader in sustainable tourism, balancing environmental protection with economic development. As a responsible traveler, you can contribute to this vision.</p>
        
        <h3>Eco-Friendly Accommodations</h3>
        <p>Choose homestays and eco-lodges that follow sustainable practices. These accommodations use renewable energy, waste management systems, and support local communities.</p>
        
        <h3>Responsible Trekking</h3>
        <p>Follow Leave No Trace principles: pack out all trash, stay on designated trails, respect wildlife, and use established campsites.</p>
        
        <h3>Supporting Local Economy</h3>
        <p>Buy local products, eat at local restaurants, hire local guides, and purchase handicrafts directly from artisans.</p>
        
        <h3>Cultural Sensitivity</h3>
        <p>Respect local customs, dress appropriately at religious sites, ask permission before photographing people, and learn basic local phrases.</p>
        
        <h3>Environmental Protection</h3>
        <p>Use reusable water bottles, avoid single-use plastics, respect wildlife viewing guidelines, and support conservation initiatives.</p>
        
        <h3>Community Involvement</h3>
        <p>Participate in community-based tourism programs, volunteer for conservation projects, and engage with local culture respectfully.</p>
        
        <h3>Sustainable Transportation</h3>
        <p>Use public transportation when available, share rides, choose fuel-efficient vehicles, and consider carbon offset programs.</p>
        
        <h3>Future of Tourism</h3>
        <p>Sikkim aims to become a model for sustainable tourism globally. Your responsible travel choices contribute to this vision and help preserve Sikkim for future generations.</p>
      `,
    },
  ];

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "destinations", label: "Destinations" },
    { id: "adventure", label: "Adventure" },
    { id: "culture", label: "Culture" },
    { id: "food", label: "Food & Cuisine" },
    { id: "nature", label: "Nature" },
    { id: "mountains", label: "Mountains" },
    { id: "accommodation", label: "Accommodation" },
    { id: "wildlife", label: "Wildlife" },
    { id: "travel-tips", label: "Travel Tips" },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (articleId) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.articlePage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Sikkim Travel Articles</h1>
          <p className={styles.heroSubtitle}>
            Discover the hidden gems, culture, and adventures of the mystical
            Himalayan state
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>🔍</div>
          </div>

          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className={styles.articlesSection}>
        <div className={styles.container}>
          <div className={styles.articlesGrid}>
            {filteredArticles.map((article) => (
              <article key={article.id} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <img src={article.image} alt={article.title} />
                  <div className={styles.categoryBadge}>{article.category}</div>
                </div>

                <div className={styles.articleContent}>
                  <div className={styles.articleMeta}>
                    <span className={styles.author}>By {article.author}</span>
                    <span className={styles.date}>{article.date}</span>
                    <span className={styles.readTime}>{article.readTime}</span>
                  </div>

                  <h2 className={styles.articleTitle}>{article.title}</h2>
                  <p className={styles.articleExcerpt}>{article.excerpt}</p>

                  <button
                    onClick={() => toggleExpanded(article.id)}
                    className={styles.readMoreBtn}
                  >
                    {expandedArticle === article.id ? "Read Less" : "Read More"}
                  </button>

                  {expandedArticle === article.id && (
                    <div className={styles.expandedContent}>
                      <div
                        className={styles.articleBody}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeArticleHtml(article.content),
                        }}
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Blog Button */}
      <div className={styles.backSection}>
        <div className={styles.container}>
          <Link to="/vlog" className={styles.backBtn}>
            <span className={styles.backIcon}>←</span>
            Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Article;
