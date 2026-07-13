import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const gbp = (pounds) => Math.round(pounds * 100);

async function main() {
  console.log("Seeding Walnutterz database…");

  // ---- Users ----
  const adminPass = await bcrypt.hash("admin123", 10);
  const custPass = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@walnutterz.com" },
    update: {},
    create: {
      email: "admin@walnutterz.com",
      passwordHash: adminPass,
      name: "Walnutterz Admin",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: custPass,
      name: "Sam Collector",
      role: "CUSTOMER",
    },
  });

  // ---- Products ----
  const products = [
    {
      slug: "england",
      name: "England",
      shortDescription:
        "England Walnutter here! Small walnut head, massive football heart! 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      description:
        "A hand-painted walnut head figure in the classic England kit. Individually cast, sanded, primed and painted by hand — a one-of-a-kind collectible celebrating the Three Lions.",
      imagePath: "/assets/images/England.jpg",
      gallery: [
        "/assets/images/England.jpg",
        "/assets/images/England pair.jpg",
        "/assets/images/England team rear view.jpg",
        "/assets/images/England team side view.jpg",
      ],
      category: "International",
      occasions: ["Birthday", "Father's Day", "Christmas", "Football Club Awards"],
      era: "1990s",
      featured: true,
      salesCount: 42,
    },
    {
      slug: "brazil",
      name: "Brazil",
      shortDescription:
        "Olá, my friend! I'm Brazil. I may be carved from a walnut, but football flows through every brushstroke. Thanks for bringing me home.",
      description:
        "The Seleção in miniature. A genuine walnut shell head, hand-painted in iconic canary yellow — samba flair for your shelf, bar or trophy cabinet.",
      imagePath: "/assets/images/Brazil.jpg",
      gallery: ["/assets/images/Brazil.jpg", "/assets/images/Side shot.jpg"],
      category: "International",
      occasions: ["Birthday", "Christmas"],
      era: "1980s",
      salesCount: 31,
    },
    {
      slug: "france",
      name: "France",
      shortDescription:
        "Bonjour! I'm France: I may have a walnut for a head, but my first touch is still magnifique! Give me a good spot on the shelf and I'll remind everyone that football is as much art as it is competition.",
      description:
        "Les Bleus, lovingly reborn in walnut. Each figure is hand-cast and hand-painted, a distinctive keepsake for any lover of the beautiful game.",
      imagePath: "/assets/images/France.jpg",
      gallery: ["/assets/images/France.jpg"],
      category: "International",
      occasions: ["Birthday", "Father's Day"],
      era: "2000s",
      salesCount: 18,
    },
    {
      slug: "huddersfield-town",
      name: "Huddersfield Town",
      shortDescription: "Terriers through and through — a proud Yorkshire keepsake.",
      description:
        "'Huddersfield Town here! Famous one time winners of the FA Cup back in 1922 with a famous 1-0 victory over Preston North End!' A hand-painted walnut head figure in Town blue and white.",
      imagePath: "/assets/images/Huddersfield Town.jpg",
      gallery: ["/assets/images/Huddersfield Town.jpg"],
      category: "Club",
      occasions: ["Football Club Awards", "Coach Gift", "Player of the Match"],
      era: "1990s",
      salesCount: 12,
    },
    {
      slug: "leeds-united-home",
      name: "Leeds United Home",
      shortDescription: "'Marching on Together - we're gonna see you win!'",
      description:
        "All white, all Leeds. A hand-crafted walnut head figure in the classic home kit — a must for any Elland Road faithful.",
      imagePath: "/assets/images/Leeds United Home.jpg",
      gallery: ["/assets/images/Leeds United Home.jpg"],
      category: "Club",
      occasions: ["Birthday", "Football Club Awards"],
      era: "1970s",
      salesCount: 27,
    },
    {
      slug: "leeds-united-away",
      name: "Leeds United Away",
      shortDescription: "'Built in Walnut. Born in Yorkshire!'",
      description:
        "The Leeds United away colours, hand-painted onto a genuine walnut head figure. Individually made to order and finished by hand.",
      imagePath: "/assets/images/Leeds United Away.jpg",
      gallery: ["/assets/images/Leeds United Away.jpg"],
      category: "Club",
      occasions: ["Birthday", "Retirement"],
      era: "2010s",
      salesCount: 9,
    },
    {
      slug: "liverpool",
      name: "Liverpool",
      shortDescription: "'You'll never walk alone!'",
      description:
        "The Kop in a keepsake. A hand-painted walnut head figure in Liverpool red — a distinctive gift for any Red.",
      imagePath: "/assets/images/Liverpool.jpg",
      gallery: ["/assets/images/Liverpool.jpg"],
      category: "Club",
      occasions: ["Father's Day", "Christmas", "Retirement"],
      era: "1980s",
      salesCount: 35,
    },
    {
      slug: "crystal-palace",
      name: "Crystal Palace",
      shortDescription: "'Away the Eagles!'",
      description:
        "Red and blue Eagles pride, hand-crafted from a walnut shell and painted by hand. A one-of-a-kind Palace collectible.",
      imagePath: "/assets/images/Crystal Palace.jpg",
      gallery: ["/assets/images/Crystal Palace.jpg"],
      category: "Club",
      occasions: ["Birthday", "Coach Gift", "Player of the Match"],
      era: "2000s",
      salesCount: 7,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        regularPrice: gbp(12),
        imagePath: p.imagePath,
        gallery: JSON.stringify(p.gallery),
        category: p.category,
        occasions: JSON.stringify(p.occasions),
        era: p.era,
        featured: p.featured ?? false,
        salesCount: p.salesCount ?? 0,
      },
      create: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        regularPrice: gbp(12),
        currency: "GBP",
        stockStatus: "in_stock",
        imagePath: p.imagePath,
        gallery: JSON.stringify(p.gallery),
        category: p.category,
        occasions: JSON.stringify(p.occasions),
        era: p.era,
        featured: p.featured ?? false,
        salesCount: p.salesCount ?? 0,
      },
    });
  }

  // ---- Reviews (for Featured Figure of the Week) ----
  const england = await prisma.product.findUnique({ where: { slug: "england" } });
  if (england) {
    await prisma.review.deleteMany({ where: { productId: england.id } });
    await prisma.review.createMany({
      data: [
        {
          productId: england.id,
          authorName: "James, 38",
          rating: 10,
          text: "A delightful throwback to my youth — the detail is astonishing. A perfect collectible.",
        },
        {
          productId: england.id,
          authorName: "Emma, 42",
          rating: 9,
          text: "Bought one for my son and he adores it. A brilliant way to connect with football history.",
        },
        {
          productId: england.id,
          authorName: "Riley's Dad",
          rating: 10,
          text: "Outstanding quality and a fantastic keepsake. Couldn't recommend Walnutterz enough!",
        },
      ],
    });
  }

  // ---- Time Tunnel players ----
  await prisma.timeTunnelPlayer.deleteMany({});
  const tunnel = [
    ["1960s", "Bobby Charlton", "England's 1966 World Cup hero and a Manchester United legend, famed for thunderous strikes and unmatched sportsmanship."],
    ["1960s", "George Best", "The Belfast Boy — mercurial, magical and box-office. Perhaps the most naturally gifted British footballer of all time."],
    ["1960s", "Pelé", "Three-time World Cup winner and the global face of the beautiful game throughout the golden 1960s."],
    ["1970s", "Johan Cruyff", "The architect of Total Football, whose turn still bears his name. Grace, vision and revolution in equal measure."],
    ["1970s", "Kenny Dalglish", "King Kenny — a Celtic and Liverpool icon whose intelligence and finishing defined a glittering era."],
    ["1970s", "Kevin Keegan", "Twice European Footballer of the Year, a bundle of energy and charisma who lit up the decade."],
    ["1980s", "Diego Maradona", "The 1986 World Cup belonged to him. Genius and controversy wrapped in the number 10 shirt."],
    ["1980s", "Ruud Gullit", "Dreadlocked brilliance — the AC Milan and Netherlands talisman who led the Oranje to Euro 88 glory."],
    ["1980s", "John Barnes", "Liverpool's flying winger whose solo goal against Brazil in 1984 remains the stuff of legend."],
    ["1990s", "Paul Gascoigne", "Gazza's tears at Italia 90 and that goal against Scotland at Euro 96 — the heartbeat of English football."],
    ["1990s", "Eric Cantona", "The collar-up King of the Stretford End who inspired Manchester United's Premier League dominance."],
    ["1990s", "Alan Shearer", "The Premier League's record goalscorer — a centre-forward of raw power and ruthless finishing."],
    ["2000s", "Thierry Henry", "Arsenal's Invincible — pace, poise and unforgettable finishes at Highbury and beyond."],
    ["2000s", "Steven Gerrard", "The Istanbul miracle's driving force and Liverpool's inspirational captain for a generation."],
    ["2000s", "David Beckham", "Bend-it brilliance and Galáctico glamour — a set-piece maestro known the world over."],
    ["2010s", "Lionel Messi", "Barcelona's little magician, breaking records season after season with impossible ease."],
    ["2010s", "Cristiano Ronaldo", "A relentless goal machine and serial Champions League winner across England, Spain and Italy."],
    ["2010s", "Luka Modrić", "The midfield metronome who dethroned Messi and Ronaldo to win the 2018 Ballon d'Or."],
  ];
  let order = 0;
  for (const [decade, name, story] of tunnel) {
    await prisma.timeTunnelPlayer.create({
      data: { decade, name, story, sortOrder: order++ },
    });
  }

  // ---- Site content blocks ----
  const contentBlocks = [
    {
      key: "meet-the-maker",
      title: "Meet the Maker",
      body:
        "Walnutterz began at a kitchen table with a walnut shell, a fine brush and a lifelong love of football. What started as a bit of fun quickly became an obsession — carving, casting and hand-painting tiny characters that capture the spirit of the players and clubs we grew up adoring.\n\nEvery figure is made by hand, one at a time. I chose walnut because it's natural, characterful and completely unlike the mass-produced plastic alternatives — no two shells are ever the same, so no two figures are ever alike. From the first plaster mould to the final coat of varnish, each piece takes hours of patient work.\n\nFootball has always been about memories for me — where you were, who you watched it with, the players who made you fall in love with the game. Walnutterz is my way of turning those memories into something you can hold, display and treasure.",
      imagePath: "/assets/images/Paints + Brushes.jpg",
      videoUrl: "",
    },
    {
      key: "making-of",
      title: "The Making of a Walnutterz",
      body:
        "People love seeing how handmade products are made — and every Walnutterz figure is a labour of love. Here's how a humble walnut shell becomes a one-of-a-kind football keepsake.",
      imagePath: "/assets/images/Paints + Brushes.jpg",
      videoUrl: "",
    },
    {
      key: "home-hero",
      title: "Celebrate Football Nostalgia!",
      body:
        "Discover hand-crafted walnut head models that capture the magic of football's golden era, blending art and fandom in a unique way.",
      imagePath: "/assets/images/WALNUTTERS_TEAM_02.jpg",
      videoUrl: "",
    },
  ];
  for (const c of contentBlocks) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: c,
      create: c,
    });
  }

  // ---- Gallery items ----
  await prisma.galleryItem.deleteMany({});
  await prisma.galleryItem.createMany({
    data: [
      { customerName: "Back of the Net FC", imagePath: "/assets/images/Back of the Net.jpg", category: "Clubhouses", caption: "Our five figures on display at the centre.", approved: true },
      { customerName: "The Shearer Shelf", imagePath: "/assets/images/Walnutters_SHELF_01.jpg", category: "Trophy cabinets", caption: "Pride of place in the football room.", approved: true },
      { customerName: "World Cup Wall", imagePath: "/assets/images/World Cup teams v2.jpg", category: "Man caves", caption: "The full World Cup line-up.", approved: true },
      { customerName: "Thornes Juniors", imagePath: "/assets/images/Thornes Juniors.jpg", category: "Children's bedrooms", caption: "Riley's personalised figure.", approved: true },
      { customerName: "The Kop Corner", imagePath: "/assets/images/Liverpool.jpg", category: "Home bars", caption: "You'll never walk alone.", approved: true },
      { customerName: "England Squad", imagePath: "/assets/images/England pair.jpg", category: "Football rooms", caption: "The Three Lions in miniature.", approved: true },
    ],
  });

  // ---- Blog posts ----
  const posts = [
    {
      slug: "the-art-of-football-nostalgia",
      title: "The Art of Football Nostalgia",
      excerpt: "How a walnut shell becomes a tribute to football's greatest legends.",
      imagePath: "/assets/images/WALNUTTERS_TEAM_02.jpg",
      body:
        "At Walnutterz, we blend history with creativity to bring you unique hand-crafted walnut head football models. Each piece is a tribute to football legends of the past and present, meticulously crafted to capture the spirit of the game. From the initial plaster cast mould to the final hand-painted details, we reveal the passion and precision behind every model. Join us as we celebrate the intersection of football history and artisanal craftsmanship.",
    },
    {
      slug: "craftsmanship-that-captures-iconic-moments",
      title: "Craftsmanship That Captures Iconic Moments",
      excerpt: "From Gascoigne's tears to Shearer's celebrations — reborn in walnut.",
      imagePath: "/assets/images/Walnutters_FACUP_WIMLIV.jpg",
      body:
        "Our walnut head models aren't just collectibles; they're a journey back to iconic moments in football history. Imagine holding a miniature tribute to your favourite player, lovingly crafted from natural materials. We explore the stories behind these legendary figures, from Gascoigne's unforgettable World Cup moments to Shearer's Premier League triumphs, celebrating the nostalgia of 1990s and early 2000s football.",
    },
    {
      slug: "customisation-making-your-vision-a-reality",
      title: "Customisation: Making Your Vision a Reality",
      excerpt: "Commemorate a personal football hero with a bespoke figure.",
      imagePath: "/assets/images/Birthday Gifts.jpg",
      body:
        "One of the standout features of our walnut head models is the ability to customise them to your heart's content. Whether you want to commemorate a personal football hero or create a unique gift, our customisation options allow you to add a personal touch to your model. Discover how our bespoke models can capture the essence of your favourite football moments, making them a cherished part of your collection.",
    },
  ];
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // ---- A sample paid order for the demo customer ----
  const existingOrder = await prisma.order.findFirst({ where: { userId: customer.id } });
  if (!existingOrder) {
    const liverpool = await prisma.product.findUnique({ where: { slug: "liverpool" } });
    await prisma.order.create({
      data: {
        orderNumber: "WN-100001",
        userId: customer.id,
        email: customer.email,
        customerName: customer.name ?? "Sam Collector",
        status: "FULFILLED",
        paymentStatus: "mock_paid",
        subtotal: gbp(24),
        shipping: gbp(3.95),
        total: gbp(27.95),
        shippingAddress: JSON.stringify({
          line1: "1 Nostalgia Lane",
          city: "Wakefield",
          postcode: "WF1 1AA",
          country: "United Kingdom",
        }),
        items: {
          create: [
            { productId: england?.id, name: "England", unitPrice: gbp(12), quantity: 1, imagePath: "/assets/images/England.jpg" },
            { productId: liverpool?.id, name: "Liverpool", unitPrice: gbp(12), quantity: 1, imagePath: "/assets/images/Liverpool.jpg" },
          ],
        },
      },
    });
  }

  console.log("Seed complete.");
  console.log("  Admin:    admin@walnutterz.com / admin123");
  console.log("  Customer: customer@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
