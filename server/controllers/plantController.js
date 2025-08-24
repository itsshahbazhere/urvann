const Plant = require("../models/Plant");
const { uploadFileToCloudinary } = require("../config/cloudinary");
require("dotenv").config();

// Create Plant
exports.createPlant = async (req, res) => {
  try {
    const { name, price, description, availability } = req.body;
    const categories = req.body["categories[]"];
    const image = req.files.image;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    console.log("categories:", categories);
    if (!categories || categories.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one category is required" });
    }

    //upload image to cloudinary
    const imageUrl = await uploadFileToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    console.log("imageUrl:", imageUrl.secure_url);

    const plant = new Plant({
      name,
      price,
      description,
      categories,
      availability,
      image: imageUrl.secure_url,
    });

    await plant.save();
    res.status(201).json({ message: "Plant created successfully", plant });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating plant", error: error.message });
  }
};

// Get All Plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json({
      success: true,
      data: plants,
      message: "Plants fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching plants", error: error.message });
  }
};

// Get Single Plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching plant", error: error.message });
  }
};

// Update Plant
exports.updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant updated successfully", plant });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating plant", error: error.message });
  }
};

// Delete Plant
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting plant", error: error.message });
  }
};
