const Category = require("../models/Category");

// Create a new category
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = await Category.create({ name });

    res
      .status(200)
      .json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a category by ID
exports.read = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category",
      error: error.message,
    });
  }
};

// Update a category
exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Get all categories
exports.list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve category list",
      error: error.message,
    });
  }
};

// Delete a category
exports.delete = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
