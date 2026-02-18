const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');

// @desc    Create item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, category, type, description, location, date } = req.body;

    if (!title || !category || !type || !description || !location || !date) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const itemData = {
      title,
      category,
      type,
      description,
      location,
      date: new Date(date),
      owner: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const item = await Item.create(itemData);
    await item.populate('owner', 'name email department');

    res.status(201).json({ success: true, message: 'Item reported successfully', item });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Create item error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { search, category, type, status, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (status && status !== 'All') query.status = status;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('owner', 'name email department')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email department phone')
      .populate('claimRequests.claimant', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (owner only)
const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      // Delete old image
      if (item.image) {
        const oldPath = path.join(__dirname, '..', item.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('owner', 'name email department');

    res.json({ success: true, message: 'Item updated successfully', item });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    // Delete image if exists
    if (item.image) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await item.deleteOne();

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's items
// @route   GET /api/items/user/my-items
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit claim request
// @route   POST /api/items/:id/claim
// @access  Private
const claimItem = async (req, res) => {
  try {
    const { message } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot claim your own item' });
    }

    const alreadyClaimed = item.claimRequests.some(
      c => c.claimant.toString() === req.user._id.toString()
    );

    if (alreadyClaimed) {
      return res.status(400).json({ success: false, message: 'You have already submitted a claim for this item' });
    }

    item.claimRequests.push({ claimant: req.user._id, message });
    await item.save();
    await item.populate('claimRequests.claimant', 'name email');

    res.json({ success: true, message: 'Claim request submitted successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update claim status
// @route   PUT /api/items/:id/claim/:claimId
// @access  Private (owner only)
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const claim = item.claimRequests.id(req.params.claimId);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    claim.status = status;
    if (status === 'approved') {
      item.status = 'claimed';
    }
    await item.save();

    res.json({ success: true, message: `Claim ${status} successfully`, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/items/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const myItems = await Item.find({ owner: userId });
    const totalReported = myItems.length;
    const lostReported = myItems.filter(i => i.type === 'lost').length;
    const foundReported = myItems.filter(i => i.type === 'found').length;
    const resolved = myItems.filter(i => i.status === 'claimed' || i.status === 'resolved').length;
    const totalItems = await Item.countDocuments();
    const activeItems = await Item.countDocuments({ status: 'active' });

    res.json({
      success: true,
      stats: { totalReported, lostReported, foundReported, resolved, totalItems, activeItems }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createItem, getItems, getItemById, updateItem, deleteItem,
  getMyItems, claimItem, updateClaimStatus, getDashboardStats
};
