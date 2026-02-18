import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Books & Stationery', 'Clothing & Accessories', 'ID & Cards', 'Bags', 'Keys', 'Jewelry', 'Sports Equipment', 'Other'];
const LOCATIONS = ['Library', 'Cafeteria', 'Main Block', 'Hostel Block A', 'Hostel Block B', 'Sports Complex', 'Parking Area', 'Lecture Hall Complex', 'Admin Block', 'Labs & Workshop', 'Other'];

const ReportItemPage = ({ editItem = null }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: editItem?.title || '',
    category: editItem?.category || CATEGORIES[0],
    type: editItem?.type || 'lost',
    description: editItem?.description || '',
    location: editItem?.location || LOCATIONS[0],
    date: editItem?.date ? editItem.date.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(editItem?.image || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image must be less than 5MB');
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) {
      return toast.error('Please fill in all required fields');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);

      if (editItem) {
        await api.put(`/items/${editItem._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Item updated successfully!');
        navigate(`/items/${editItem._id}`);
      } else {
        const { data } = await api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Item reported successfully!');
        navigate(`/items/${data.item._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title">{editItem ? 'Edit Item' : 'Report an Item'}</h1>
          <p className="text-slate-500 mt-1">
            {editItem ? 'Update the details below' : 'Fill in the details to help others find or return your item.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Type selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Item Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {['lost', 'found'].map(type => (
                <label
                  key={type}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.type === type
                      ? type === 'lost' ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={form.type === type}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    form.type === type
                      ? type === 'lost' ? 'border-red-400 bg-red-400' : 'border-green-400 bg-green-400'
                      : 'border-slate-300'
                  }`}></div>
                  <div>
                    <span className="font-semibold text-navy-900 capitalize">{type}</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {type === 'lost' ? 'I lost this item' : 'I found this item'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Name *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Blue Noise-Cancelling Headphones"
              className="input-field"
              required
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date {form.type === 'lost' ? 'Lost' : 'Found'} *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Campus Location *</label>
            <select name="location" value={form.location} onChange={handleChange} className="input-field">
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the item in detail — color, size, brand, any distinguishing marks..."
              className="input-field resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo (optional)</label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover rounded-xl border border-slate-200" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 shadow-sm transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-navy-400 hover:bg-navy-50 transition-all">
                <svg width="28" height="28" className="text-slate-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className="text-sm text-slate-500">Click to upload or drag an image</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG, GIF, WEBP up to 5MB</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {loading ? 'Saving...' : editItem ? 'Update Item' : 'Report Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItemPage;
