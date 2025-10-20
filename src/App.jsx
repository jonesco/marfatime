import React, { useMemo, useState, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal, MapPin, Link as LinkIcon, Utensils, Store, Compass } from "lucide-react";

// Marfa Time - single file React site
// Friendly, sophisticated knowledge base for visitors. Client-only, no external fetches.

// ---------------------------
// Data & persistence helpers
// ---------------------------
function clone(o) { return JSON.parse(JSON.stringify(o)); }

const DATA = [
  // NOTE: To add accurate coordinates for map pins:
  // 1. Search location on Google Maps
  // 2. Right-click the red pin
  // 3. Click coordinates to copy
  // 4. Add as: coords: [latitude, longitude]
  
  // Eat & Drink
  {
    id: "hotel-paisano",
    name: "Hotel Paisano / Jett's Grill",
    category: "Eat & Drink",
    blurb:
      "Lovely 1930s hotel with charm. Free coffee or lemonade depending on the hour. Jett's bar and grill is on site. A reliable pick when other spots are closed.",
    tips:
      "Lunch starts at 2 pm. Sip something in the courtyard. Check out the Giant film photos. The pool is a classic hang.",
    rating: 4,
    coords: [30.307656, -104.019722], // 207 N Highland Ave - UPDATE WITH ACTUAL COORDS FROM GOOGLE MAPS
  },
  {
    id: "angels",
    name: "Angel's",
    category: "Eat & Drink",
    blurb: "Cozy Tex-Mex spot by Dollar General with friendly vibes. This tiny local favorite can be tough to snag a seat during lunch or dinner, but they also do takeout. Recommend the Chile Relleno.",
    rating: 4,
  },
  {
    id: "bordo",
    name: "Bordo",
    category: "Eat & Drink",
    blurb: "Italian deli offering fresh pasta, wood-fired bread, and seasonal gelato—all made on-site with stone-milled heirloom flours. Founded by Chef Michael Serva, they also stock imported olive oils, specialty cheeses, and charcuterie. A sublime lunch stop with truly fresh, tasty bites.",
    rating: 5,
    mustDo: true,
  },
  {
    id: "aster-marfa",
    name: "Aster Marfa",
    category: "Eat & Drink",
    blurb: "Easy breakfast and sandwiches right across from the courthouse.",
    rating: 2,
  },
  {
    id: "marfa-burrito",
    name: "Marfa Burrito",
    category: "Eat & Drink",
    blurb:
      "Beloved breakfast burritos. A little Spanish goes a long way. Local lore says Matthew McConaughey is a fan.",
    tips: "Cash only",
    rating: 4,
  },
  {
    id: "para-llevar",
    name: "Para Llevar",
    category: "Eat & Drink",
    blurb: "Wood-fired pizza and bagels plus sandwiches. Small bodega with a nice beer and wine lineup.",
    rating: 4,
  },
  {
    id: "st-george",
    name: "Hotel Saint George",
    category: "Eat & Drink",
    blurb: "Decent menu and usually open. Shares a lobby with Marfa Book Company.",
    rating: 3,
  },
  {
    id: "bitter-sugar",
    name: "Bitter Sugar",
    category: "Eat & Drink",
    blurb: "Favorite coffee stop with flaky pastries.",
    rating: 4,
  },
  {
    id: "planet-marfa",
    name: "Planet Marfa",
    category: "Eat & Drink",
    blurb: "Laid-back beer garden with a teepee and ping pong. Local hangout with simple bar snacks.",
    rating: 3,
  },
  {
    id: "the-pony",
    name: "The Pony",
    category: "Eat & Drink",
    blurb:
      "Neighborhood bar with free pool tables and a friendly crowd. It's the diviest of dive bars in Marfa. Weird hours.",
    rating: 3,
    coords: [30.310248392792996, -104.01776478650659], // 306 E San Antonio St
  },
  {
    id: "cochineal",
    name: "Cochineal",
    category: "Eat & Drink",
    blurb: "Refined dining led by James Beard Award semifinalist Chef Alexandra Gates. Features a daily-changing prix fixe menu with locally sourced ingredients inspired by European and West Texan traditions. Intimate setting with a 30-seat dining room and 40-seat courtyard.",
    rating: 4,
  },
  {
    id: "marfa-spirit-company",
    name: "Marfa Spirit Company",
    category: "Eat & Drink",
    blurb: "Nice place to get a drink. Specialize in Sotal but have other liquors that they make on site. Recommend the margarita or a Marfa Mule.",
    rating: 4,
  },
  {
    id: "the-sentinel",
    name: "The Sentinel",
    category: "Eat & Drink",
    blurb: "Home to local newspaper and a super bougie coffee shop.",
    rating: 3,
  },
  {
    id: "larrys",
    name: "Larry's",
    category: "Eat & Drink",
    blurb: "Best hamburger in Far West Texas in my opinion. Open 11-4pm, Wednesday - Thursday. Real good.",
    rating: 5,
    mustDo: true,
  },
  {
    id: "margarets",
    name: "Margaret's in Marfa",
    category: "Eat & Drink",
    blurb: "Cozy eatery with favorites like cheese toast with burrata and spaghetti bolognese. Popular spot that gets busy with wait times during peak hours. First-come, first-served—no reservations accepted. Call ahead for takeout.",
    rating: 5,
  },
  {
    id: "waterstop",
    name: "The Waterstop",
    category: "Eat & Drink",
    blurb: "Family-owned comfort food spot with a shaded patio and cozy indoor dining. Known for their standout fried chicken sandwich with vinegar slaw and spicy mayo, plus jalapeño mac and cheese. The real draw? They're reliably open when you need a good meal, though busy times can mean longer waits.",
    tips: "Try the chicken and waffles or rotisserie chicken. Pet-friendly patio.",
    rating: 4,
  },

  // Shops & Things to Do
  {
    id: "ebike-marfa",
    name: "eBike Marfa",
    category: "Shops & Things to Do",
    blurb: "The best way to explore Marfa is by bike. Rent an electric bike and cruise town with ease, or venture out on Pinto Canyon Road—a scenic paved route that stretches miles into the high plains desert toward the Chinati Mountains with barely any traffic. Highly recommended if you have the time.",
    rating: 5,
  },
  {
    id: "presidio-courthouse",
    name: "Presidio County Courthouse",
    category: "Shops & Things to Do",
    blurb: "You can walk up to the top for a great view.",
    rating: 3,
  },
  {
    id: "cactus-liquors",
    name: "Cactus Liquors",
    category: "Shops & Things to Do",
    blurb: "Friendly folks offering mezcal samples. You will also find plants and gifts.",
    rating: 5,
    mustDo: true,
  },
  {
    id: "marfa-book-company",
    name: "Marfa Book Company",
    category: "Shops & Things to Do",
    blurb: "Artsy bookshop that is fun to browse. In the lobby of the St. George Hotel.",
    rating: 2,
  },
  {
    id: "stop-and-read-books",
    name: "Stop & Read Books",
    category: "Shops & Things to Do",
    blurb: "Thoughtfully curated bookstore with a carefully selected collection of books for all ages. Features a cozy reading nook, complimentary coffee, and unique gifts. The friendly staff creates an inviting atmosphere perfect for browsing, and they also carry wine and homewares. A must-visit for book lovers looking for quality selections beyond the mainstream.",
    tips: "Enjoy complimentary coffee",
    rating: 4,
  },
  {
    id: "get-go",
    name: "The Get-Go",
    category: "Shops & Things to Do",
    blurb: "Great for groceries if you want an alternative to Porter’s. Think mini-Whole Foods in the desert.",
    rating: 3,
  },

  // Short Trips & Art
  {
    id: "marfa-lights",
    name: "Marfa Lights Viewing Area",
    category: "Short Trips & Art",
    blurb: "About 15 minutes east on Hwy 90. A long-running local legend with a proper viewing stand. Are they really just car headlights far off into the distance? Who knows, just go with it.",
    rating: 3,
  },
  {
    id: "prada-marfa",
    name: "Prada Marfa",
    category: "Short Trips & Art",
    blurb: "Iconic roadside art. Beyoncé took photos here.",
    tips: "Nice scenic loop to Fort Davis and back to Marfa.",
    rating: 4,
  },
  {
    id: "irwin-untitled",
    name: "Robert Irwin “Untitled” (Former Army Hospital)",
    category: "Short Trips & Art",
    blurb:
      "Large-scale light-and-space work in a former hospital. Reserve to go inside or enjoy a walk around the grounds.",
    rating: 4,
  },
  {
    id: "ft-davis-park",
    name: "Fort Davis State Park",
    category: "Short Trips & Art",
    blurb:
      "Drive up to the highest peak for big views. Home to the WPA-era Indian Lodge, which you can pop into and explore.",
    rating: 4,
  },
  {
    id: "mcdonald-observatory",
    name: "McDonald Observatory",
    category: "Short Trips & Art",
    blurb: "Pairs perfectly with a Fort Davis visit. Check the star party times before you go.",
    rating: 5,
  },
  {
    id: "chinati-foundation",
    name: "Chinati Foundation",
    category: "Short Trips & Art",
    blurb:
      "Established in 1986 by minimalist artist Donald Judd on 340 acres of a former military base. Features permanent large-scale installations including Judd's 100 aluminum pieces, Dan Flavin's fluorescent light works, and John Chamberlain's sculptures. Reservations required for guided tours. The grounds showcase how art, architecture, and the desert landscape integrate into a cohesive experience.",
    rating: 5,
    mustDo: true,
  },
  {
    id: "judd-foundation",
    name: "Judd Foundation and Installations",
    category: "Short Trips & Art",
    blurb: "There is Donald Judd work all over town. The Judd Block is especially cool.",
    rating: 4,
  },
];

const CATEGORIES = [
  { key: "All", icon: Compass },
  { key: "Eat & Drink", icon: Utensils },
  { key: "Shops & Things to Do", icon: Store },
  { key: "Short Trips & Art", icon: Compass },
];

// ---------------------------
// Helpers
// ---------------------------

function toMapQuery(name) {
  const q = encodeURIComponent(`${name} Marfa TX`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function toWebQuery(name) {
  const q = encodeURIComponent(`${name} Marfa TX`);
  return `https://www.google.com/search?q=${q}`;
}

function stars(rating) {
  const n = Math.max(0, Math.min(5, Math.round(rating ?? 3)));
  return "♥".repeat(n) + "♡".repeat(5 - n);
}

// Time-based sky themes for the header
function getPeriod(hour) {
  // Night: 20-5, Morning: 6-11, Midday: 11-17, Sunset: 17-20
  if (hour >= 20 || hour < 6) return "night";
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "midday";
  return "sunset";
}

function getSkyStyle(period) {
  const base = {
    backgroundSize: "200% 200%",
    backgroundPosition: "0% 50%",
    animation: "sky-pan 28s ease-in-out infinite alternate",
  };
  switch (period) {
    case "night":
      // Milky Way feel - deep blues with starry specks via layered radial-gradients
      return {
        ...base,
        animation: "sky-pan 120s ease-in-out infinite alternate",
        backgroundImage:
          // Small stars (1px) - 40 total
          "radial-gradient(1px 1px at 2% 8%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 3% 12%, rgba(255,255,255,0.9), transparent 2px)," +
          "radial-gradient(1px 1px at 5% 32%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 8% 45%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 11% 62%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 12% 78%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 14% 92%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 18% 23%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 21% 55%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 22% 88%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 26% 18%, rgba(255,255,255,0.9), transparent 2px)," +
          "radial-gradient(1px 1px at 28% 34%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 31% 48%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 32% 67%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 35% 85%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 38% 15%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 41% 38%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 42% 52%, rgba(255,255,255,0.9), transparent 2px)," +
          "radial-gradient(1px 1px at 45% 72%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 48% 82%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 51% 12%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 52% 28%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 55% 48%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 58% 64%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 61% 22%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 62% 42%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 65% 78%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 68% 18%, rgba(255,255,255,0.9), transparent 2px)," +
          "radial-gradient(1px 1px at 71% 52%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 72% 75%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 75% 28%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 78% 38%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 81% 62%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 82% 58%, rgba(255,255,255,0.8), transparent 2px)," +
          "radial-gradient(1px 1px at 85% 12%, rgba(255,255,255,0.9), transparent 2px)," +
          "radial-gradient(1px 1px at 88% 25%, rgba(255,255,255,0.6), transparent 2px)," +
          "radial-gradient(1px 1px at 91% 45%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 92% 85%, rgba(255,255,255,0.7), transparent 2px)," +
          "radial-gradient(1px 1px at 95% 68%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 97% 48%, rgba(255,255,255,0.5), transparent 2px)," +
          // Medium stars (1.5px) - 12 total
          "radial-gradient(1.5px 1.5px at 7% 22%, rgba(255,255,255,0.5), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 10% 60%, rgba(255,255,255,0.4), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 17% 42%, rgba(255,255,255,0.3), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 25% 30%, rgba(255,255,255,0.5), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 33% 58%, rgba(255,255,255,0.4), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.3), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 47% 25%, rgba(255,255,255,0.5), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 55% 20%, rgba(255,255,255,0.4), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 63% 68%, rgba(255,255,255,0.3), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 70% 55%, rgba(255,255,255,0.5), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 77% 18%, rgba(255,255,255,0.4), transparent 3px)," +
          "radial-gradient(1.5px 1.5px at 85% 40%, rgba(255,255,255,0.3), transparent 3px)," +
          // Brighter larger stars (2px) - 24 total
          "radial-gradient(2px 2px at 5% 50%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 9% 75%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 13% 35%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 15% 50%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 19% 8%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 23% 65%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 29% 42%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 35% 15%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 39% 80%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 43% 28%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 50% 75%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 54% 55%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 59% 8%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 65% 35%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 69% 88%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 73% 48%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 76% 68%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 80% 65%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 83% 32%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 87% 78%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 90% 20%, rgba(255,255,255,0.3), transparent 4px)," +
          "radial-gradient(2px 2px at 93% 52%, rgba(255,255,255,0.5), transparent 4px)," +
          "radial-gradient(2px 2px at 96% 15%, rgba(255,255,255,0.4), transparent 4px)," +
          "radial-gradient(2px 2px at 98% 82%, rgba(255,255,255,0.3), transparent 4px)," +
          "linear-gradient(120deg, #0a0f2c 0%, #2a1f5a 40%, #3a2f6a 60%, #0a0f2c 100%)",
        color: "#fff",
      };
    case "sunset":
      // West Texas sunset - warm oranges to magenta with a hint of deep blue
      return {
        ...base,
        backgroundImage:
          "linear-gradient(135deg, #ff934f 0%, #ff6a88 35%, #c850c0 65%, #4158d0 100%)",
        color: "#fff",
      };
    case "morning":
      // Dawn - peach to soft sky blue
      return {
        ...base,
        backgroundImage:
          "linear-gradient(135deg, #ffd6a5 0%, #fcd1ff 40%, #a0c4ff 100%)",
        color: "#1f2937",
      };
    case "midday":
    default:
      // Bright blue midday sky
      return {
        ...base,
        backgroundImage:
          "linear-gradient(135deg, #67e8f9 0%, #38bdf8 40%, #1d4ed8 100%)",
        color: "#ffffff",
      };
  }
}

function isDark(period) {
  return period === "night" || period === "sunset" || period === "midday";
}

// ---------------------------
// Component
// ---------------------------
export default function App() {
  // Search, tabs, sorting
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [previousCategory, setPreviousCategory] = useState("All"); // Track category before search
  const [sort, setSort] = useState("name");
  const [mustDoOnly, setMustDoOnly] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const [showFilterFlyout, setShowFilterFlyout] = useState(false);
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  // Time & theme
  const [now, setNow] = useState(new Date());

  // Data state
  const [items, setItems] = useState(DATA);

  // Clock for header theme
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);



  const period = useMemo(() => getPeriod(now.getHours()), [now]);
  const skyStyle = useMemo(() => getSkyStyle(period), [period]);
  const dark = useMemo(() => isDark(period), [period]);

  // Focus search input when opening search
  useEffect(() => {
    if (showSearch && inputRef.current) {
      try { inputRef.current.focus(); } catch {}
    }
  }, [showSearch]);

  // Close flyout on outside click or Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setShowFilterFlyout(false); }
    function onClick(e) { 
      if (filterRef.current && !filterRef.current.contains(e.target) && 
          filterButtonRef.current && !filterButtonRef.current.contains(e.target)) {
        setShowFilterFlyout(false);
      }
    }
    if (showFilterFlyout) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [showFilterFlyout]);

  const results = useMemo(() => {
    let arr = clone(items);

    if (category !== "All") {
      arr = arr.filter((d) => d.category === category);
    }

    if (mustDoOnly) {
      arr = arr.filter((d) => d.mustDo === true);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        (d.blurb && d.blurb.toLowerCase().includes(q)) ||
        (d.tips && d.tips.toLowerCase().includes(q))
      );
    }

    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "rating") arr.sort((a, b) => (b.rating ?? 3) - (a.rating ?? 3));
    return arr;
  }, [query, category, sort, mustDoOnly, items]);

  // Group search results by category when searching
  const groupedResults = useMemo(() => {
    if (!query.trim() || category !== "All") {
      return null; // Don't group when not searching or when on specific category
    }

    const grouped = {};
    results.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [results, query, category]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* subtle animated gradient keyframes with reduced-motion fallback */}
      <style>{`
        @keyframes sky-pan { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        
        /* Chrome-specific button focus fix */
        button:focus-visible { outline: none !important; box-shadow: none !important; }
        button:focus { outline: none !important; box-shadow: none !important; }
        button:active { outline: none !important; box-shadow: none !important; }
      `}</style>

      <header className="sticky top-0 z-40" style={skyStyle} aria-label={`Header theme: ${period}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <h1 className={`font-extrabold ${dark ? "text-white" : "text-neutral-900"}`} style={{ fontSize: "calc(1.25rem * 1.2)" }}>
            Marfa Time
          </h1>
          <span className={`ml-auto text-sm ${dark ? "text-white/80" : "text-neutral-600"}`}>
            Friendly local picks for your Marfa trip
          </span>
        </div>
      </header>

      {/* Category controls with mobile dropdown, plus filter and search icons */}
      <div className={`sticky top-[64px] z-30 border-b bg-neutral-50 ${dark ? "border-white/20" : "border-neutral-200"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 relative">
            <div className="flex-1 min-w-0">
              {showSearch ? (
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white h-10">
                  <Search className="w-4 h-4 text-neutral-500" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      const v = e.target.value;
                      setQuery(v);
                      
                      if (v.trim() === "") {
                        // Clear search - restore previous category
                        setCategory(previousCategory);
                        setShowSearch(false);
                      } else if (query === "") {
                        // Starting search - save current category and show all
                        setPreviousCategory(category);
                        setCategory("All");
                      }
                    }}
                    onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setCategory(previousCategory); setShowSearch(false); } }}
                    placeholder="Search Marfa spots (type to filter)"
                    className="w-full outline-none placeholder:text-neutral-400"
                    aria-label="Search Marfa spots"
                  />
                  <button onClick={() => { setQuery(""); setCategory(previousCategory); setShowSearch(false); }} className="p-1 rounded hover:bg-neutral-100" aria-label="Close search" title="Close search">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile dropdown */}
                  <div className="md:hidden">
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-xl pl-3 pr-8 py-2 text-sm h-10 appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
                        aria-label="Select category"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.key} value={c.key}>{c.key}</option>
                        ))}
                      </select>
                      {/* Custom chevron */}
                      <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"><path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.15l3.71-2.92a.75.75 0 1 1 .92 1.18l-4.2 3.3a.75.75 0 0 1-.92 0l-4.2-3.3a.75.75 0 0 1-.02-1.06z"/></svg>
                    </div>
                  </div>
                  {/* Desktop tabs */}
                  <nav className="hidden md:flex gap-2 overflow-x-auto" role="tablist" aria-label="Categories">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        role="tab"
                        aria-selected={category === c.key}
                        onClick={() => setCategory(c.key)}
                        className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap h-10 flex items-center focus:outline-none ${
                          category === c.key ? "bg-neutral-900 text-white" : "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400"
                        }`}
                      >
                        {c.key}
                      </button>
                    ))}
                  </nav>
                </>
              )}
            </div>

            {!showSearch && (
              <div className="flex items-center gap-2">
                <button
                  ref={filterButtonRef}
                  onClick={() => setShowFilterFlyout((v) => !v)}
                  className="p-2 rounded-xl border bg-white hover:bg-neutral-50"
                  aria-haspopup="dialog"
                  aria-expanded={showFilterFlyout}
                  aria-controls="filter-flyout"
                  title="Filter & sort"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                <button onClick={() => setShowSearch(true)} className="p-2 rounded-xl border bg-white hover:bg-neutral-50" aria-label="Open search" title="Search">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            )}

            {showFilterFlyout && (
              <div ref={filterRef} id="filter-flyout" role="dialog" aria-label="Filter and sort options" className="absolute right-4 top-full mt-2 w-72 bg-white shadow-xl rounded-2xl border p-4 z-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Filter and sort</h3>
                  <button onClick={() => setShowFilterFlyout(false)} className="p-1 rounded hover:bg-neutral-100" aria-label="Close filters" title="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Sort */}
                <div className="mb-3">
                  <label className="text-sm font-medium">Sort</label>
                  <div className="mt-2 relative">
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border rounded-xl pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-300">
                      <option value="name">Name A to Z</option>
                      <option value="rating">Rating (high first)</option>
                    </select>
                    {/* Custom chevron */}
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"><path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.15l3.71-2.92a.75.75 0 1 1 .92 1.18l-4.2 3.3a.75.75 0 0 1-.92 0l-4.2-3.3a.75.75 0 0 1-.02-1.06z"/></svg>
                  </div>
                </div>
                {/* Filter */}
                <div className="mb-3">
                  <label className="text-sm font-medium">Filter</label>
                  <div className="mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mustDoOnly}
                        onChange={(e) => setMustDoOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-2 focus:ring-neutral-400 accent-black"
                      />
                      <span className="text-sm">Must do only</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* Results */}
        <section>
          {groupedResults ? (
            // Grouped search results - no main header
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-neutral-500">{results.length} results found</span>
              </div>
              <div className="space-y-6">
              {Object.entries(groupedResults).map(([categoryName, categoryItems]) => (
                <div key={categoryName}>
                  <h3 className="text-md font-semibold text-neutral-700 mb-3">{categoryName}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {categoryItems.map((item) => (
                      <article key={item.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-10 h-10 rounded-xl bg-neutral-100 grid place-items-center">
                            {item.category === "Eat & Drink" ? (
                              <Utensils className="w-5 h-5" />
                            ) : item.category === "Shops & Things to Do" ? (
                              <Store className="w-5 h-5" />
                            ) : (
                              <Compass className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold leading-tight">{item.name}</h4>

                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{item.category}</span>
                              {item.mustDo && <span className="px-2 py-0.5 rounded-full bg-black text-white font-medium">Must do</span>}
                            </div>

                            <div className="mt-1 text-sm" aria-label={`Rating ${item.rating ?? 3} out of 5`}>
                              <span className="font-medium text-magenta-600">{stars(item.rating ?? 3)}</span>
                            </div>
                          </div>
                        </div>

                        {item.blurb && <p className="mt-3 text-sm text-neutral-700">{item.blurb}</p>}

                        {item.tips && (
                          <div className="mt-2 p-3 bg-neutral-100 rounded-lg">
                            <p className="text-sm text-neutral-700"><span className="font-medium">Tip:</span> {item.tips}</p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-2">
                          <a href={toMapQuery(item.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50" title="Open in Maps">
                            <MapPin className="w-4 h-4" />
                            Maps
                          </a>
                          <a href={toWebQuery(item.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50" title="Search the web">
                            <LinkIcon className="w-4 h-4" />
                            Search
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </div>
          ) : (
            // Regular category results
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{category}</h2>
                <span className="text-sm text-neutral-500">{results.length} results</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
              {results.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-neutral-100 grid place-items-center">
                      {item.category === "Eat & Drink" ? (
                        <Utensils className="w-5 h-5" />
                      ) : item.category === "Shops & Things to Do" ? (
                        <Store className="w-5 h-5" />
                      ) : (
                        <Compass className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold leading-tight">{item.name}</h3>

                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{item.category}</span>
                        {item.mustDo && <span className="px-2 py-0.5 rounded-full bg-black text-white font-medium">Must do</span>}
                      </div>

                      <div className="mt-1 text-sm" aria-label={`Rating ${item.rating ?? 3} out of 5`}>
                        <span className="font-medium text-magenta-600">{stars(item.rating ?? 3)}</span>
                      </div>
                    </div>
                  </div>

                  {item.blurb && <p className="mt-3 text-sm text-neutral-700">{item.blurb}</p>}

                  {item.tips && (
                    <div className="mt-2 p-3 bg-neutral-100 rounded-lg">
                      <p className="text-sm text-neutral-700"><span className="font-medium">Tip:</span> {item.tips}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <a href={toMapQuery(item.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50" title="Open in Maps">
                      <MapPin className="w-4 h-4" />
                      Maps
                    </a>
                    <a href={toWebQuery(item.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50" title="Search the web">
                      <LinkIcon className="w-4 h-4" />
                      Search
                    </a>
                  </div>
                </article>
              ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-8 pt-4 text-sm text-neutral-500">
        <div className="flex items-center">
          <span>Made for easy Marfa trip planning. Double-check hours and availability since small-town schedules can shift.</span>
        </div>
      </footer>

    </div>
  );
}

// ---------------------------
// Dev Tests (console only)
// ---------------------------
function runTests() {
  try {
    console.group("Marfa Time - tests");
    // getPeriod boundaries
    console.assert(getPeriod(0) === "night", "0 should be night");
    console.assert(getPeriod(5) === "night", "5 should be night");
    console.assert(getPeriod(6) === "morning", "6 should be morning");
    console.assert(getPeriod(10) === "morning", "10 should be morning");
    console.assert(getPeriod(11) === "midday", "11 should be midday");
    console.assert(getPeriod(17) === "sunset", "17 should be sunset");
    console.assert(getPeriod(20) === "night", "20 should be night");

    // isDark mapping
    console.assert(isDark("night") === true, "night is dark");
    console.assert(isDark("sunset") === true, "sunset is dark");
    console.assert(isDark("midday") === true, "midday uses light text over blue");
    console.assert(isDark("morning") === false, "morning is light");

    // style existence
    ["night", "sunset", "morning", "midday"].forEach((mode) => {
      const style = getSkyStyle(mode);
      console.assert(typeof style.backgroundImage === "string", `${mode} has backgroundImage`);
      console.assert(typeof style.animation === "string" && style.animation.includes("sky-pan"), `${mode} animated`);
    });

    // stars helper
    console.assert(stars(3) === "★★★☆☆", "3-star render ok");
    console.assert(stars(5) === "★★★★★", "5-star render ok");
    console.assert(stars(7) === "★★★★★", "clamps above 5");
    console.assert(stars(-1) === "☆☆☆☆☆", "clamps below 0");

    // data checks
    console.assert(Array.isArray(DATA) && DATA.length > 0, "DATA has items");
    console.assert(DATA.every(d => !("status" in d)), "No item contains status key");
    const cactus = DATA.find(d => d.id === "cactus-liquors");
    console.assert(cactus && cactus.rating === 5, "Cactus Liquors should be 5 stars");
    const bordo = DATA.find(d => d.id === "bordo");
    console.assert(bordo && bordo.rating === 5, "Bordo should be 5 stars");
    const aster = DATA.find(d => d.id === "aster-marfa");
    console.assert(aster && aster.rating === 2, "Aster Marfa should be 2 stars");

    const keys = new Set(CATEGORIES.map(c => c.key));
    console.assert(keys.size === CATEGORIES.length, "Category keys unique");

    // map and web query helpers
    console.assert(/maps\/search/.test(toMapQuery("Test")), "toMapQuery format ok");
    console.assert(/google\.com\/search\?q=/.test(toWebQuery("Test")), "toWebQuery format ok");


    console.log("All tests passed");
  } catch (e) {
    console.error("Test failure", e);
  } finally {
    console.groupEnd();
  }
}

if (typeof window !== "undefined") {
  runTests();
}
