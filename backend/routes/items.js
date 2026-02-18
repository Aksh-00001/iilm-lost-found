const express = require('express');
const router = express.Router();
const {
  createItem, getItems, getItemById, updateItem, deleteItem,
  getMyItems, claimItem, updateClaimStatus, getDashboardStats
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', protect, getDashboardStats);
router.get('/user/my-items', protect, getMyItems);
router.get('/', getItems);
router.post('/', protect, upload.single('image'), createItem);
router.get('/:id', getItemById);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/:id/claim', protect, claimItem);
router.put('/:id/claim/:claimId', protect, updateClaimStatus);

module.exports = router;
