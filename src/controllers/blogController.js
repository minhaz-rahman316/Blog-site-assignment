const Blog = require("../models/blog");
const cloudinary = require("../utils/cloudinary");

// Create a new blog
exports.create = async (req, res) => {
  try {
    const { title, description, blog_images, author, content, date } = req.body;

    // Check if the blog already exists in the database
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog already exists" });
    }

    // Validate required request body fields
    if (
      !title ||
      !description ||
      !blog_images ||
      !author ||
      !content ||
      !date
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create a new Blog document
    const newBlog = new Blog({
      title,
      description,
      blog_images,
      author,
      content,
      date,
    });
    await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// Update an existing blog
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, options);

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// Retrieve a list of all blogs
exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs.length) {
      return res.status(404).json({
        success: false,
        message: "No blogs found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve blogs",
      error: error.message,
    });
  }
};

// Read a specific blog by ID
exports.read = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve blog",
      error: error.message,
    });
  }
};

// Delete a specific blog by ID
exports.delete = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// Delete all blogs
exports.deleteAll = async (req, res) => {
  try {
    const result = await Blog.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} blogs successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blogs",
      error: error.message,
    });
  }
};
