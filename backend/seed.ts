const firstSellerId = "acc766d9-349d-458a-bf50-a1d4a07b065e";
const secondSellerId = "399c8bbc-57af-4634-bda5-2f4cac70b758";
const thirdSellerId = "86988efd-ce07-4586-af9e-8810ba9f285b";
const fourthSellerId = "04a0be61-86ac-40b8-92c8-e9608fee718e";

export const dummyPropertyData = [
  {
    sellerId: firstSellerId,
    title: "Luxurious Apartment in Manhattan",
    slug: "testing-inserting-to-db",
    description: "A stunning, modern apartment with panoramic views of the New York skyline.",
    toRent: true,
    address: "Manhattan, New York City",
    closeLandmark: "Central Park",
    propertyType: "House",
    availableFrom: "2024-05-01T12:00:00Z",
    availableTill: "2025-05-01T12:00:00Z",
    price: 10000,
    negotiable: true,
    imageUrl: ["https://example.com/apartment-image1.jpg", "https://example.com/apartment-image2.jpg"],
    status: "Rent",
    expiresOn: "2024-06-01T12:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Cozy House in the Countryside",
    slug: "testing-inserting-to-db",
    description: "Escape to the serene countryside in this charming cottage surrounded by nature.",
    toRent: false,
    address: "Rural area near Lake District",
    closeLandmark: "Lake Windermere",
    propertyType: "House",
    availableFrom: "2024-06-15T00:00:00Z",
    availableTill: "2025-06-15T00:00:00Z",
    price: 350000,
    negotiable: false,
    imageUrl: ["https://example.com/cottage-image1.jpg", "https://example.com/cottage-image2.jpg"],
    status: "Sale",
    expiresOn: "2024-07-15T00:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Modern Apartment in Downtown Los Angeles",
    slug: "testing-inserting-to-db",
    description:
      "Experience urban luxury living in this sleek and contemporary condo located in the heart of downtown LA.",
    toRent: true,
    address: "Downtown Los Angeles, California",
    closeLandmark: "Staples Center",
    propertyType: "House",
    availableFrom: "2024-07-01T00:00:00Z",
    availableTill: "2025-07-01T00:00:00Z",
    price: 3500,
    negotiable: true,
    imageUrl: ["https://example.com/condo-image1.jpg", "https://example.com/condo-image2.jpg"],
    status: "Rent",
    expiresOn: "2024-08-01T00:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Seaside Villa in Malibu",
    slug: "testing-inserting-to-db",
    description:
      "Enjoy breathtaking ocean views and luxurious living in this elegant seaside villa located in Malibu.",
    toRent: false,
    address: "Malibu, California",
    closeLandmark: "Malibu Pier",
    propertyType: "House",
    availableFrom: "2024-08-15T00:00:00Z",
    availableTill: "2025-08-15T00:00:00Z",
    price: 7500000,
    negotiable: false,
    imageUrl: ["https://example.com/villa-image1.jpg", "https://example.com/villa-image2.jpg"],
    status: "Sale",
    expiresOn: "2024-09-15T00:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Rustic Cabin Retreat in the Rockies",
    slug: "testing-inserting-to-db",
    description: "Escape to the tranquility of the Rocky Mountains with this charming rustic cabin retreat.",
    toRent: true,
    address: "Rocky Mountains, Colorado",
    closeLandmark: "Rocky Mountain National Park",
    propertyType: "House",
    availableFrom: "2024-09-01T00:00:00Z",
    availableTill: "2025-09-01T00:00:00Z",
    price: 2000,
    negotiable: true,
    imageUrl: ["https://example.com/cabin-image1.jpg", "https://example.com/cabin-image2.jpg"],
    status: "Rent",
    expiresOn: "2024-10-01T00:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Historic Townhouse in Paris",
    slug: "testing-inserting-to-db",
    description:
      "Step into elegance and history with this stunning historic townhouse located in the heart of Paris.",
    toRent: false,
    address: "Paris, France",
    closeLandmark: "Louvre Museum",
    propertyType: "House",
    availableFrom: "2024-10-15T00:00:00Z",
    availableTill: "2025-10-15T00:00:00Z",
    price: 8500000,
    negotiable: false,
    imageUrl: ["https://example.com/townhouse-image1.jpg", "https://example.com/townhouse-image2.jpg"],
    status: "Sale",
    expiresOn: "2024-11-15T00:00:00Z"
  },
  {
    sellerId: firstSellerId,
    title: "Secluded Mountain Chalet in Switzerland",
    slug: "testing-inserting-to-db",
    description: "Discover serenity and luxury in this secluded mountain chalet nestled in the Swiss Alps.",
    toRent: false,
    address: "Swiss Alps, Switzerland",
    closeLandmark: "Matterhorn",
    propertyType: "House",
    availableFrom: "2025-01-01T00:00:00Z",
    availableTill: "2026-01-01T00:00:00Z",
    price: 12000000,
    negotiable: false,
    imageUrl: ["https://example.com/chalet-image1.jpg", "https://example.com/chalet-image2.jpg"],
    status: "Sale",
    expiresOn: "2025-02-01T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Beachfront Villa in Phuket",
    slug: "testing-inserting-to-db",
    description:
      "Indulge in tropical paradise with this luxurious beachfront villa located in the exotic island of Phuket, Thailand.",
    toRent: true,
    address: "Phuket, Thailand",
    closeLandmark: "Patong Beach",
    propertyType: "House",
    availableFrom: "2025-02-15T00:00:00Z",
    availableTill: "2026-02-15T00:00:00Z",
    price: 5000,
    negotiable: true,
    imageUrl: ["https://example.com/phuket-villa-image1.jpg", "https://example.com/phuket-villa-image2.jpg"],
    status: "Rent",
    expiresOn: "2025-03-15T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Historic Mansion in Rome",
    slug: "testing-inserting-to-db",
    description: "Step back in time with this historic mansion located in the heart of Rome, Italy.",
    toRent: false,
    address: "Rome, Italy",
    closeLandmark: "Colosseum",
    propertyType: "House",
    availableFrom: "2025-03-01T00:00:00Z",
    availableTill: "2026-03-01T00:00:00Z",
    price: 15000000,
    negotiable: false,
    imageUrl: ["https://example.com/rome-mansion-image1.jpg", "https://example.com/rome-mansion-image2.jpg"],
    status: "Sale",
    expiresOn: "2025-04-01T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Modern Loft in Berlin Mitte",
    slug: "testing-inserting-to-db",
    description:
      "Experience contemporary urban living in this stylish loft located in the vibrant neighborhood of Berlin Mitte.",
    toRent: true,
    address: "Berlin Mitte, Berlin, Germany",
    closeLandmark: "Brandenburg Gate",
    propertyType: "House",
    availableFrom: "2025-04-15T00:00:00Z",
    availableTill: "2026-04-15T00:00:00Z",
    price: 2500,
    negotiable: true,
    imageUrl: ["https://example.com/berlin-loft-image1.jpg", "https://example.com/berlin-loft-image2.jpg"],
    status: "Rent",
    expiresOn: "2025-05-15T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Coastal Retreat in Sydney",
    slug: "testing-inserting-to-db",
    description:
      "Escape to coastal serenity with this charming retreat located in the picturesque city of Sydney, Australia.",
    toRent: false,
    address: "Sydney, New South Wales, Australia",
    closeLandmark: "Bondi Beach",
    propertyType: "House",
    availableFrom: "2025-05-01T00:00:00Z",
    availableTill: "2026-05-01T00:00:00Z",
    price: 6500000,
    negotiable: false,
    imageUrl: [
      "https://example.com/sydney-retreat-image1.jpg",
      "https://example.com/sydney-retreat-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2025-06-01T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Lakeside Cottage in Ontario",
    slug: "testing-inserting-to-db",
    description:
      "Embrace lakeside living with this cozy cottage nestled along the shores of Lake Ontario in Canada.",
    toRent: true,
    address: "Lake Ontario, Ontario, Canada",
    closeLandmark: "Niagara Falls",
    propertyType: "House",
    availableFrom: "2025-06-15T00:00:00Z",
    availableTill: "2026-06-15T00:00:00Z",
    price: 1800,
    negotiable: true,
    imageUrl: [
      "https://example.com/ontario-cottage-image1.jpg",
      "https://example.com/ontario-cottage-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2025-07-15T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Hillside Villa in Santorini",
    slug: "testing-inserting-to-db",
    description:
      "Experience the breathtaking beauty of Santorini with this charming hillside villa overlooking the Aegean Sea.",
    toRent: false,
    address: "Santorini, Greece",
    closeLandmark: "Oia Village",
    propertyType: "House",
    availableFrom: "2025-07-01T00:00:00Z",
    availableTill: "2026-07-01T00:00:00Z",
    price: 9000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/santorini-villa-image1.jpg",
      "https://example.com/santorini-villa-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2025-08-01T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Mountain Retreat in Colorado Rockies",
    slug: "testing-inserting-to-db",
    description:
      "Escape to the majestic Colorado Rockies with this secluded mountain retreat offering panoramic views and tranquility.",
    toRent: true,
    address: "Colorado Rockies, Colorado, USA",
    closeLandmark: "Aspen",
    propertyType: "House",
    availableFrom: "2025-08-15T00:00:00Z",
    availableTill: "2026-08-15T00:00:00Z",
    price: 4500,
    negotiable: true,
    imageUrl: [
      "https://example.com/colorado-retreat-image1.jpg",
      "https://example.com/colorado-retreat-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2025-09-15T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Lakeside Chalet in Lucerne",
    slug: "testing-inserting-to-db",
    description:
      "Embrace the tranquility of Lake Lucerne with this charming lakeside chalet offering stunning views and alpine charm.",
    toRent: false,
    address: "Lucerne, Switzerland",
    closeLandmark: "Chapel Bridge",
    propertyType: "House",
    availableFrom: "2025-09-30T00:00:00Z",
    availableTill: "2026-09-30T00:00:00Z",
    price: 6800000,
    negotiable: false,
    imageUrl: [
      "https://example.com/lucerne-chalet-image1.jpg",
      "https://example.com/lucerne-chalet-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2025-10-30T00:00:00Z"
  },
  {
    sellerId: secondSellerId,
    title: "Riverside Mansion in Kyoto",
    slug: "testing-inserting-to-db",
    description:
      "Experience the essence of traditional Japanese architecture with this magnificent riverside mansion located in Kyoto.",
    toRent: false,
    address: "Kyoto, Japan",
    closeLandmark: "Kinkaku-ji (Golden Pavilion)",
    propertyType: "House",
    availableFrom: "2025-10-15T00:00:00Z",
    availableTill: "2026-10-15T00:00:00Z",
    price: 25000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/kyoto-mansion-image1.jpg",
      "https://example.com/kyoto-mansion-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2025-11-15T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Tropical Villa in Bali",
    slug: "testing-inserting-to-db",
    description:
      "Immerse yourself in the tropical paradise of Bali with this stunning villa surrounded by lush greenery and tranquil waters.",
    toRent: true,
    address: "Bali, Indonesia",
    closeLandmark: "Ubud Monkey Forest",
    propertyType: "House",
    availableFrom: "2025-11-01T00:00:00Z",
    availableTill: "2026-11-01T00:00:00Z",
    price: 3000,
    negotiable: true,
    imageUrl: ["https://example.com/bali-villa-image1.jpg", "https://example.com/bali-villa-image2.jpg"],
    status: "Rent",
    expiresOn: "2025-12-01T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Lakeside Cabin in Queenstown",
    slug: "testing-inserting-to-db",
    description:
      "Escape to the serenity of New Zealand's South Island with this cozy lakeside cabin located near Queenstown.",
    toRent: true,
    address: "Queenstown, New Zealand",
    closeLandmark: "Lake Wakatipu",
    propertyType: "House",
    availableFrom: "2025-12-15T00:00:00Z",
    availableTill: "2026-12-15T00:00:00Z",
    price: 1200,
    negotiable: true,
    imageUrl: [
      "https://example.com/queenstown-cabin-image1.jpg",
      "https://example.com/queenstown-cabin-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2026-01-15T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Coastal Villa in Amalfi Coast",
    slug: "testing-inserting-to-db",
    description:
      "Embrace the Mediterranean lifestyle with this luxurious coastal villa perched along the stunning cliffs of the Amalfi Coast in Italy.",
    toRent: false,
    address: "Amalfi Coast, Italy",
    closeLandmark: "Positano",
    propertyType: "House",
    availableFrom: "2026-01-15T00:00:00Z",
    availableTill: "2027-01-15T00:00:00Z",
    price: 12000000,
    negotiable: false,
    imageUrl: ["https://example.com/amalfi-villa-image1.jpg", "https://example.com/amalfi-villa-image2.jpg"],
    status: "Sale",
    expiresOn: "2026-02-15T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Lakeside Mansion in Geneva",
    slug: "testing-inserting-to-db",
    description:
      "Indulge in lakeside luxury with this magnificent mansion boasting panoramic views of Lake Geneva in Switzerland.",
    toRent: false,
    address: "Geneva, Switzerland",
    closeLandmark: "Jet d'Eau",
    propertyType: "House",
    availableFrom: "2026-02-28T00:00:00Z",
    availableTill: "2027-02-28T00:00:00Z",
    price: 18000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/geneva-mansion-image1.jpg",
      "https://example.com/geneva-mansion-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2026-03-28T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "City Apartment in Tokyo",
    slug: "testing-inserting-to-db",
    description:
      "Experience the energy of Tokyo with this modern apartment situated in the bustling heart of the city in Japan.",
    toRent: true,
    address: "Tokyo, Japan",
    closeLandmark: "Shibuya Crossing",
    propertyType: "House",
    availableFrom: "2026-03-15T00:00:00Z",
    availableTill: "2027-03-15T00:00:00Z",
    price: 3500,
    negotiable: true,
    imageUrl: [
      "https://example.com/tokyo-apartment-image1.jpg",
      "https://example.com/tokyo-apartment-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2026-04-15T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Vineyard Estate in Napa Valley",
    slug: "testing-inserting-to-db",
    description:
      "Live the wine country dream with this sprawling vineyard estate nestled in the picturesque Napa Valley of California, USA.",
    toRent: false,
    address: "Napa Valley, California, USA",
    closeLandmark: "St. Helena",
    propertyType: "House",
    availableFrom: "2026-04-01T00:00:00Z",
    availableTill: "2027-04-01T00:00:00Z",
    price: 20000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/napa-vineyard-estate-image1.jpg",
      "https://example.com/napa-vineyard-estate-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2026-05-01T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Beachfront Apartment in Miami",
    slug: "testing-inserting-to-db",
    description:
      "Experience luxury beach living with this sleek apartment located directly on the vibrant shores of Miami Beach, Florida, USA.",
    toRent: true,
    address: "Miami Beach, Florida, USA",
    closeLandmark: "South Beach",
    propertyType: "House",
    availableFrom: "2026-05-15T00:00:00Z",
    availableTill: "2027-05-15T00:00:00Z",
    price: 8000,
    negotiable: true,
    imageUrl: ["https://example.com/miami-condo-image1.jpg", "https://example.com/miami-condo-image2.jpg"],
    status: "Rent",
    expiresOn: "2026-06-15T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Mountain Chalet in Banff",
    slug: "testing-inserting-to-db",
    description:
      "Escape to the Canadian Rockies with this charming mountain chalet located in the breathtaking town of Banff, Alberta, Canada.",
    toRent: true,
    address: "Banff, Alberta, Canada",
    closeLandmark: "Banff National Park",
    propertyType: "House",
    availableFrom: "2026-06-30T00:00:00Z",
    availableTill: "2027-06-30T00:00:00Z",
    price: 2500,
    negotiable: true,
    imageUrl: ["https://example.com/banff-chalet-image1.jpg", "https://example.com/banff-chalet-image2.jpg"],
    status: "Rent",
    expiresOn: "2026-07-30T00:00:00Z"
  },
  {
    sellerId: thirdSellerId,
    title: "Seaside Villa in Santorini",
    slug: "testing-inserting-to-db",
    description:
      "Discover serenity with this elegant seaside villa overlooking the crystal-clear waters of the Aegean Sea on the enchanting island of Santorini, Greece.",
    toRent: false,
    address: "Santorini, Greece",
    closeLandmark: "Oia",
    propertyType: "House",
    availableFrom: "2026-07-15T00:00:00Z",
    availableTill: "2027-07-15T00:00:00Z",
    price: 10500000,
    negotiable: false,
    imageUrl: [
      "https://example.com/santorini-villa-image1.jpg",
      "https://example.com/santorini-villa-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2026-08-15T00:00:00Z"
  },
  {
    sellerId: fourthSellerId,
    title: "Ski Chalet in Verbier",
    slug: "testing-inserting-to-db",
    description:
      "Experience the ultimate ski getaway with this cozy chalet nestled in the Swiss Alps in the renowned ski resort town of Verbier, Switzerland.",
    toRent: true,
    address: "Verbier, Switzerland",
    closeLandmark: "Mont Fort",
    propertyType: "House",
    availableFrom: "2026-08-01T00:00:00Z",
    availableTill: "2027-08-01T00:00:00Z",
    price: 6000,
    negotiable: true,
    imageUrl: [
      "https://example.com/verbier-chalet-image1.jpg",
      "https://example.com/verbier-chalet-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2026-09-01T00:00:00Z"
  },
  {
    sellerId: fourthSellerId,
    title: "Beach House in Byron Bay",
    slug: "testing-inserting-to-db",
    description:
      "Relax and unwind in this stylish beach house located in the trendy coastal town of Byron Bay, Australia, boasting stunning ocean views and laid-back vibes.",
    toRent: true,
    address: "Byron Bay, New South Wales, Australia",
    closeLandmark: "Cape Byron",
    propertyType: "House",
    availableFrom: "2026-09-15T00:00:00Z",
    availableTill: "2027-09-15T00:00:00Z",
    price: 4500,
    negotiable: true,
    imageUrl: [
      "https://example.com/byron-bay-beach-house-image1.jpg",
      "https://example.com/byron-bay-beach-house-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2026-10-15T00:00:00Z"
  },
  {
    sellerId: fourthSellerId,
    title: "Countryside Estate in Tuscany",
    slug: "testing-inserting-to-db",
    description:
      "Immerse yourself in the beauty of the Tuscan countryside with this exquisite estate offering sprawling vineyards, rolling hills, and unparalleled tranquility.",
    toRent: false,
    address: "Tuscany, Italy",
    closeLandmark: "Florence",
    propertyType: "House",
    availableFrom: "2026-10-30T00:00:00Z",
    availableTill: "2027-10-30T00:00:00Z",
    price: 15000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/tuscany-estate-image1.jpg",
      "https://example.com/tuscany-estate-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2026-11-30T00:00:00Z"
  },
  {
    sellerId: fourthSellerId,
    title: "Oceanfront Apartment in Rio de Janeiro",
    slug: "testing-inserting-to-db",
    description:
      "Live the beachfront lifestyle with this modern apartment boasting panoramic views of the Atlantic Ocean in the vibrant city of Rio de Janeiro, Brazil.",
    toRent: true,
    address: "Rio de Janeiro, Brazil",
    closeLandmark: "Copacabana Beach",
    propertyType: "House",
    availableFrom: "2026-12-01T00:00:00Z",
    availableTill: "2027-12-01T00:00:00Z",
    price: 7000,
    negotiable: true,
    imageUrl: [
      "https://example.com/rio-apartment-image1.jpg",
      "https://example.com/rio-apartment-image2.jpg"
    ],
    status: "Rent",
    expiresOn: "2027-01-01T00:00:00Z"
  },
  {
    sellerId: fourthSellerId,
    title: "Colonial Mansion in Cartagena",
    slug: "testing-inserting-to-db",
    description:
      "Step into history with this magnificent colonial mansion located in the UNESCO World Heritage Site of Cartagena, Colombia, boasting timeless architecture and old-world charm.",
    toRent: false,
    address: "Cartagena, Colombia",
    closeLandmark: "Walled City of Cartagena",
    propertyType: "House",
    availableFrom: "2027-01-15T00:00:00Z",
    availableTill: "2028-01-15T00:00:00Z",
    price: 9000000,
    negotiable: false,
    imageUrl: [
      "https://example.com/cartagena-mansion-image1.jpg",
      "https://example.com/cartagena-mansion-image2.jpg"
    ],
    status: "Sale",
    expiresOn: "2027-02-15T00:00:00Z"
  }
];

console.log(dummyPropertyData.length);
