import React, { useMemo, useState, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal, MapPin, Link as LinkIcon, Utensils, Store, Compass } from "lucide-react";

// Marfa Time - single file React site
// Friendly, sophisticated knowledge base for visitors. Client-only, no external fetches.

// ---------------------------
// Data & persistence helpers
// ---------------------------
function clone(o) { return JSON.parse(JSON.stringify(o)); }

const DATA = [
  // Eat & Drink
  {
    id: "hotel-paisano",
    name: "Hotel Paisano / Jett’s Grill",
    category: "Eat & Drink",
    blurb:
      "Lovely 1930s hotel with charm. Free coffee or lemonade depending on the hour. Jett’s bar and grill is on site. A reliable pick when other spots are closed.",
    tips:
      "Lunch starts at 2 pm. Sip something in the courtyard. Check out the Giant film photos. The pool is a classic hang.",
    rating: 4,
  },
  {
    id: "angels",
    name: "Angel’s",
    category: "Eat & Drink",
    blurb: "Cozy Tex-Mex spot by Dollar General with friendly vibes.",
    rating: 3,
  },
  {
    id: "bordo",
    name: "Bordo",
    category: "Eat & Drink",
    blurb: "Solid lunch stop with fresh, tasty bites.",
    rating: 5,
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
    tips: "You can even spot his photos on the wall.",
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
    blurb: "Tasty menu and usually open. Shares a lobby with Marfa Book Company.",
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
      "Neighborhood bar with free pool tables and a friendly crowd. No liquor license, but there is food.",
    rating: 3,
  },
  {
    id: "cochineal",
    name: "Cochineal",
    category: "Eat & Drink",
    blurb: "Thoughtful, high-end dining. Supposed to reopen in summer. Keep an eye on it.",
    rating: 3,
  },
  {
    id: "el-cosmico",
    name: "El Cosmico",
    category: "Eat & Drink",
    blurb:
      "Camp-style hotel with a fun shop and bar. Sometimes live bands or karaoke. The shop leans bohemian.",
    rating: 3,
  },

  // Shops & Things to Do
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
  },
  {
    id: "marfa-book-store",
    name: "Marfa Book Store",
    category: "Shops & Things to Do",
    blurb: "Tiny artsy bookshop that is fun to browse.",
    rating: 3,
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
    blurb: "About 15 minutes east on Hwy 90. A long-running local legend with a proper viewing stand.",
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
    rating: 4,
  },
  {
    id: "chinati-foundation",
    name: "Chinati Foundation",
    category: "Short Trips & Art",
    blurb:
      "Reservations are required to go inside, but the grounds are open. The newer Robert Irwin installation plays beautifully with light.",
    rating: 4,
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
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// Time-based sky themes for the header
function getPeriod(hour) {
  // Night: 20-5, Sunrise: 6-8, Morning: 8-11, Midday: 11-17, Sunset: 17-20
  if (hour >= 20 || hour < 6) return "night";
  if (hour >= 6 && hour < 8) return "sunrise";
  if (hour >= 8 && hour < 11) return "morning";
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
        animation: "sky-pan 36s ease-in-out infinite alternate",
        backgroundImage:
          "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.65), transparent 2px)," +
          "radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.5), transparent 2px)," +
          "radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.55), transparent 2px)," +
          "radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.4), transparent 2px)," +
          "linear-gradient(120deg, #070b34 0%, #0b1e6b 45%, #1b2f8a 70%, #0a0f2c 100%)",
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
  const [sort, setSort] = useState("name");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const [showFilterFlyout, setShowFilterFlyout] = useState(false);
  const filterRef = useRef(null);

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
    function onClick(e) { if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterFlyout(false); }
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
  }, [query, category, sort, items]);

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

      <header className="sticky top-0 z-40 border-b" style={skyStyle} aria-label={`Header theme: ${period}`}>
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
      <div className={`border-b ${dark ? "border-white/20" : "border-neutral-200"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 relative">
            <div className="flex-1 min-w-0">
              {showSearch ? (
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-neutral-500" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      const v = e.target.value; setQuery(v);
                      if (v.trim() === "") setShowSearch(false);
                    }}
                    onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setShowSearch(false); } }}
                    placeholder="Search Marfa spots (type to filter)"
                    className="w-full outline-none placeholder:text-neutral-400"
                    aria-label="Search Marfa spots"
                  />
                  <button onClick={() => { setQuery(""); setShowSearch(false); }} className="p-1 rounded hover:bg-neutral-100" aria-label="Close search" title="Close search">
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
                        className="w-full border rounded-xl pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
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
                        className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap focus:outline-none ${
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
                <div className="text-xs text-neutral-500">More filters coming soon. Tabs control category.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Places and experiences</h2>
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
                    </div>

                    <div className="mt-1 text-sm" aria-label={`Rating ${item.rating ?? 3} out of 5`}>
                      <span className="font-medium text-amber-700">{stars(item.rating ?? 3)}</span>
                    </div>
                  </div>
                </div>

                {item.blurb && <p className="mt-3 text-sm text-neutral-700">{item.blurb}</p>}

                {item.tips && (
                  <p className="mt-2 text-sm text-neutral-600"><span className="font-medium">Tip:</span> {item.tips}</p>
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
    console.assert(getPeriod(6) === "sunrise", "6 should be sunrise");
    console.assert(getPeriod(8) === "morning", "8 should be morning");
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
