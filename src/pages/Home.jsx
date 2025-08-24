import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Leaf, LogIn, LogOut, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Footer from "../components/Footer";

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("admin_token"));
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASEURL;

  const categories = [
    { id: 1, name: "Indoor" },
    { id: 2, name: "Outdoor" },
    { id: 3, name: "Succulent" },
    { id: 4, name: "Air Purifying" },
    { id: 5, name: "Home Decor" },
    { id: 6, name: "Low Light" },
    { id: 7, name: "Pet Safe" },
    { id: 8, name: "Flowering" },
    { id: 9, name: "Large" },
    { id: 10, name: "Small" },
  ];

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/plants`);
        setPlants(response.data?.data || []);
      } catch (err) {
        toast.error("Failed to load plants");
      }
      setLoading(false);
    };
    fetchPlants();
  }, [BASE_URL]);

  // Filtering + Searching
  useEffect(() => {
    let result = [...plants];

    if (selectedCategory !== "all") {
      result = result.filter((plant) =>
        (plant.categories || []).some((cat) =>
          typeof cat === "object"
            ? cat.name === selectedCategory
            : cat === selectedCategory
        )
      );
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((plant) => {
        const nameMatch = plant.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const descMatch = plant.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const catMatch = (plant.categories || [])
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return nameMatch || descMatch || catMatch;
      });
    }

    setFilteredPlants(result);
  }, [plants, searchTerm, selectedCategory]);

  // Listen to storage (multi-tab logout)
  useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(!!localStorage.getItem("admin_token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-lime-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-green-700/90 via-green-500/90 to-green-300/90 shadow-lg rounded-b-3xl">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <Leaf className="h-9 w-9 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                Urvann Plant Store
              </h1>
              <p className="text-white/80 font-medium text-sm">
                Bringing nature closer to you 🌿
              </p>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <div className="bg-white/40 text-green-900 px-4 py-1.5 text-lg rounded-full font-semibold shadow-md">
              {filteredPlants.length} plants found
            </div>
            {isAdmin && (
              <NavLink
                to="/plant"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-green-800 font-bold shadow hover:scale-105 hover:bg-green-50 transition
                text-xs sm:text-base
                "
              >
                <Plus className="h-5 w-5" />
                <span className="hidden xs:inline">Add Plant</span>
              </NavLink>
            )}
            {!isAdmin ? (
              <NavLink
                to="/admin"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-900 font-bold shadow hover:bg-green-200 transition
                text-xs sm:text-base"
              >
                <LogIn className="h-5 w-5 inline mr-1" />
                <span className="hidden xs:inline">Login</span>
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-100 text-red-800 font-bold shadow hover:bg-red-200 transition
                text-xs sm:text-base cursor-pointer"
              >
                <LogOut className="h-5 w-5 inline mr-1" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 min-h-screen">
          <span className="text-green-700 text-xl font-bold animate-pulse">
            Loading plants...
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Search & Filter Bar */}
          <div className="bg-white md:rounded-full rounded-lg p-2 px-3 shadow-lg  mx-auto mb-10 md:w-8/12 w-11/12 mt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search plants by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2 w-full rounded-full border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none bg-green-50 text-green-900 font-medium shadow-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>

              {/* Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-2 cursor-pointer border-green-200 outline-none rounded-full py-2 px-4 focus:ring-2 focus:ring-green-300 bg-green-50 text-green-900 font-semibold shadow-sm appearance-none pr-10 text-xs sm:text-base"
                style={{
                  WebkitAppearance: "none",
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="%2323ad53" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M5.516 7.548a.75.75 0 0 1 1.06.048L10 11.086l3.424-3.49a.75.75 0 1 1 1.08 1.04l-3.954 4.026a.75.75 0 0 1-1.08 0L5.468 8.636a.75.75 0 0 1 .048-1.088z"/></svg>\')',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25em 1.25em",
                }}
              >
                <option value="all" className="cursor-pointer">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.name}
                    className="cursor-pointer"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Clear Button */}
              <button
                onClick={handleClearFilters}
                disabled={searchTerm === "" && selectedCategory === "all"}
                className="px-5 py-2 font-bold cursor-pointer rounded-full bg-gradient-to-r from-green-400 to-lime-400 text-green-900 shadow hover:scale-105 disabled:opacity-50 transition
                text-xs sm:text-base"
              >
                <span className="hidden xs:inline">Clear</span>
                <span className="xs:hidden">✕</span>
              </button>
            </div>
          </div>

          {/* Plant Cards */}
          <div
            className="grid gap-8 px-4 pb-16 
                          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                          max-w-7xl mx-auto flex-1"
          >
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <div
                  key={plant._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden relative"
                >
                  {/* Image with 'No Stock' badge if unavailable */}
                  <div className="relative">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className={
                        ("w-full h-52 object-cover transition-transform duration-300",
                        plant.availability !== false && "hover:scale-105")
                      }
                      style={{
                        filter:
                          plant.availability === false
                            ? "grayscale(0.7) brightness(0.93)"
                            : undefined,
                      }}
                    />
                    {plant.availability === false && (
                      <div
                        className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-10 select-none"
                        style={{
                          letterSpacing: "0.06em",
                          boxShadow: "0 2px 8px rgba(220,38,38,0.14)",
                        }}
                      >
                        NO STOCK
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="font-bold text-lg text-green-800">
                      {plant.name}
                    </h2>
                    <p className="text-green-600 text-sm line-clamp-2">
                      {plant.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plant.categories?.map((cat, i) => (
                        <span
                          key={i}
                          className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                        >
                          {typeof cat === "object" ? cat.name : cat}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-bold text-green-700">
                        ₹{plant.price}
                      </span>
                      <button
                        className={`
                          flex items-center justify-center gap-2
                          px-4 py-2 rounded-full font-semibold text-xs sm:text-sm
                          transition-all duration-300 shadow-md
                          ${
                            plant.availability === false
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
                              : "bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 active:scale-95"
                          }
                        `}
                        style={{
                          minWidth: "100px",
                        }}
                        disabled={plant.availability === false}
                      >
                        {plant.availability === false ? (
                          <span className="truncate">Out of Stock</span>
                        ) : (
                          <div onClick={() => toast.info("This function is not implemented yet.")} className="flex items-center gap-2">
                            {/* Cart Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
                              />
                            </svg>
                            <span className="truncate">Add to Cart</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-green-700 font-semibold py-10">
                🌱 No plants found. Try adjusting filters!
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Home;