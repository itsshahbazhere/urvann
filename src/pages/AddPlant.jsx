import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const categoriesList = [
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AddPlant = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      categories: [],
      availability: true,
    },
  });

  const selectedCategories = watch("categories", []);
  const [inputFile, setInputFile] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASEURL;
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    if (selectedCategories.includes(cat.name)) {
      setValue(
        "categories",
        selectedCategories.filter((c) => c !== cat.name),
        { shouldValidate: true }
      );
    } else {
      setValue("categories", [...selectedCategories, cat.name], {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveCategory = (catName) => {
    setValue(
      "categories",
      selectedCategories.filter((c) => c !== catName),
      { shouldValidate: true }
    );
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const onSubmit = async (data) => {
    if (!data.image?.[0]) {
      toast.error("Please select an image.");
      return;
    }

    // Get the admin token from localStorage
    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast.error("You are not authenticated. Please login as admin.");
      return;
    }

    // Prepare FormData for backend
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("availability", data.availability);
    data.categories.forEach((cat) => formData.append("categories[]", cat));
    formData.append("image", data.image[0]);

    try {
      // API call to backend with token in Authorization header
      const response = await fetch(`${BASE_URL}/plant`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add plant.");
        return;
      }

      reset();
      toast.success("Plant added successfully!");
      
      setInputFile(null);
    } catch (error) {
      toast.error("Failed to add plant. Please try again.");
    }
  };

  // For image preview
  const imageFile = watch("image");
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      setPreview(URL.createObjectURL(imageFile[0]));
    } else {
      setPreview(null);
    }
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line
  }, [imageFile]);

  return (
    <div>
      {/* Professional Header */}
      <div className="w-full bg-gradient-to-r from-green-700 via-green-500 to-green-300 py-6 px-4 flex flex-col items-center justify-center shadow relative">
        <div className="flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="4" fill="#2ecc40" />
            <path
              d="M12 6v12M6 12h12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 drop-shadow">
            Hello, Admin
          </h1>
          <p className="text-white/80 font-medium text-lg mt-1">
            Add a new plant to your catalog below
          </p>
        </div>
        {/* Top action buttons (responsive) */}
        <div className="absolute top-4 right-4 flex gap-2 sm:top-6 sm:right-10">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-green-900 font-semibold border border-green-200 shadow text-sm sm:text-base transition-all"
            title="Back to Home"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                d="M13 16l-5-5 5-5"
                stroke="#15803d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-green-900/90 hover:bg-green-900 text-white font-semibold border border-green-200 shadow text-sm sm:text-base transition-all"
            title="Logout"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M16 17l5-5-5-5M21 12H9"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4v16"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Form Section */}
      <div
        className="min-h-screen min-w-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg,#f0fdf4 0%,#e0f7e9 100%)",
          padding: 0,
          margin: 0,
        }}
      >
        <form
          className="w-full max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-lg border border-green-200"
          style={{
            minHeight: "85vh",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Form Title (moved to header above) */}

          {/* Form Body */}
          <div className="flex-1 px-8 py-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Plant Name */}
              <div className="w-full md:w-1/2">
                <label
                  className="block text-green-900 font-semibold mb-2"
                  htmlFor="name"
                >
                  Plant Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Plant name is required" })}
                  className="w-full px-4 py-3 rounded-md bg-green-50 border border-green-100 focus:border-green-400 focus:outline-none text-green-900 font-medium text-lg "
                  placeholder="e.g., Monstera Deliciosa"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <div className="text-red-600 font-medium text-sm mt-1">
                    {errors.name.message}
                  </div>
                )}
              </div>
              {/* Price */}
              <div className="w-full md:w-1/2">
                <label
                  className="block text-green-900 font-semibold mb-2"
                  htmlFor="price"
                >
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    validate: (v) =>
                      (!isNaN(parseFloat(v)) && parseFloat(v) > 0) ||
                      "Enter a valid price",
                  })}
                  className="w-full px-4 py-3 rounded-md bg-green-50 border border-green-100 focus:border-green-400 focus:outline-none text-green-900 font-medium text-lg "
                  placeholder="e.g., 1299"
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <div className="text-red-600 font-medium text-sm mt-1">
                    {errors.price.message}
                  </div>
                )}
              </div>
            </div>
            {/* Description */}
            <div>
              <label
                className="block text-green-900 font-semibold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full px-4 py-3 rounded-md bg-green-50 border border-green-100 focus:border-green-400 focus:outline-none text-green-900 font-medium text-lg  resize-none"
                placeholder="Describe the plant..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <div className="text-red-600 font-medium text-sm mt-1">
                  {errors.description.message}
                </div>
              )}
            </div>
            {/* Categories */}
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2 min-h-[2.5rem]">
                {selectedCategories.map((catName) => (
                  <span
                    key={catName}
                    className="flex items-center bg-green-100 text-green-800 font-semibold rounded-full px-4 py-1 gap-1 text-base shadow-sm mr-1 transition"
                    style={{ cursor: "pointer" }}
                  >
                    {catName}
                    <button
                      type="button"
                      className="ml-1 text-green-600 hover:text-red-600 rounded-full focus:outline-none"
                      onClick={() => handleRemoveCategory(catName)}
                      tabIndex={-1}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={classNames(
                      "px-5 py-2 rounded-md border border-green-400 font-semibold shadow-sm transition focus:outline-none",
                      selectedCategories.includes(cat.name)
                        ? "bg-green-100 text-green-700 border-green-600"
                        : "bg-white text-green-900 hover:bg-green-50"
                    )}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick(cat)}
                    tabIndex={0}
                    disabled={isSubmitting}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <div className="text-red-600 font-medium text-sm mt-1">
                  {errors.categories.message}
                </div>
              )}
            </div>
            {/* Availability toggle */}
            <div className="flex items-center gap-4 mt-2 mb-2">
              <Controller
                name="availability"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <button
                    type="button"
                    className={classNames(
                      "w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200",
                      value ? "bg-green-500" : "bg-gray-300"
                    )}
                    onClick={() => onChange(!value)}
                    aria-pressed={value}
                    style={{ cursor: "pointer" }}
                    disabled={isSubmitting}
                  >
                    <span
                      className={classNames(
                        "w-6 h-6 bg-white rounded-full shadow transition-transform duration-200",
                        value ? "translate-x-0.2" : "translate-x-0"
                      )}
                      style={{
                        transform: value ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </button>
                )}
              />
              <span className="font-semibold text-green-900 text-lg">
                In Stock
              </span>
            </div>
            {/* Image upload */}
            <div>
              <label
                className="block text-green-900 font-semibold mb-2"
                htmlFor="image"
              >
                Plant Image <span className="text-red-500">*</span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                className="w-full px-4 py-2 rounded-md border border-green-200 bg-green-50 text-green-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ cursor: "pointer" }}
                disabled={isSubmitting}
                onChange={(e) => setInputFile(e.target.value)}
              />
              {preview && (
                <div className="mt-2 flex justify-start">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-xl border-2 border-green-200 h-32 object-cover shadow"
                    style={{ maxWidth: "180px" }}
                  />
                </div>
              )}
              {errors.image && (
                <div className="text-red-600 font-medium text-sm mt-1">
                  {errors.image.message}
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="px-8 pb-8">
            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-2 rounded-lg text-lg font-bold tracking-wide shadow transition-all focus:outline-none focus:ring-4 focus:ring-green-600/40 flex items-center justify-center gap-2
      ${
        isSubmitting
          ? "opacity-70 cursor-not-allowed pointer-events-none"
          : "hover:bg-green-700 cursor-pointer"
      }`}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Adding..." : "Add Plant to Catalog"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddPlant;
