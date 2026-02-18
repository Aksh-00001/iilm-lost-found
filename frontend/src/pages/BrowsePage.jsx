import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import { ItemCardSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Electronics', 'Books & Stationery', 'Clothing & Accessories', 'ID & Cards', 'Bags', 'Keys', 'Jewelry', 'Sports Equipment', 'Other'];
const LOCATIONS = ['All', 'Library', 'Cafeteria', 'Main Block', 'Hostel Block A', 'Hostel Block B', 'Sports Complex', 'Parking Area', 'Lecture Hall Complex', 'Admin Block', 'Labs & Workshop', 'Other'];

const BrowsePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'All', type: 'All', status: 'All', location: 'All' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [sort, setSort] = useState('-createdAt');
  const [searchInput, setSearchInput] = useState('');

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort,
        ...(search && { search }),
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.type !== 'All' && { type: filters.type }),
        ...(filters.status !== 'All' && { status: filters.status }),
      });
      const { data } = await api.get(`/items?${params}`);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort]);

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: 'All', type: 'All', status: 'All', location: 'All' });
    setSearch('');
    setSearchInput('');
    setSort('-createdAt');
  };

  const hasActiveFilters = search || filters.category !== 'All' || filters.type !== 'All' || filters.status !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Browse Items</h1>
              <p className="text-slate-500 mt-1">
                {pagination.total > 0 ? `${pagination.total} items listed on campus` : 'Browse all reported items'}
              </p>
            </div>
            <Link to="/report" className="btn-primary self-start sm:self-auto flex items-center gap-2 text-sm px-5 py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Report Item
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by name, description, or location..."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-5 py-3 text-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-navy-900">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-navy-500 hover:text-navy-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>

              {/* Type */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Type</p>
                <div className="space-y-1">
                  {['All', 'lost', 'found'].map(t => (
                    <button
                      key={t}
                      onClick={() => handleFilterChange('type', t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                        filters.type === t ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t === 'All' ? 'All Types' : `${t.charAt(0).toUpperCase() + t.slice(1)} Items`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Status</p>
                <div className="space-y-1">
                  {['All', 'active', 'claimed', 'resolved'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleFilterChange('status', s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                        filters.status === s ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Category</p>
                <select
                  value={filters.category}
                  onChange={e => handleFilterChange('category', e.target.value)}
                  className="input-field py-2 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Sort By</p>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="input-field py-2 text-sm"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-date">Item Date (Desc)</option>
                  <option value="date">Item Date (Asc)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Items Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => <ItemCardSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-slate-300">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-2">No items found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  {hasActiveFilters ? 'Try adjusting your filters or search terms.' : 'Be the first to report an item on campus!'}
                </p>
                {hasActiveFilters ? (
                  <button onClick={clearFilters} className="btn-secondary text-sm px-5 py-2.5">Clear Filters</button>
                ) : (
                  <Link to="/report" className="btn-primary text-sm px-5 py-2.5">Report an Item</Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map(item => <ItemCard key={item._id} item={item} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => fetchItems(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => fetchItems(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                          pagination.page === i + 1
                            ? 'bg-navy-800 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => fetchItems(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
