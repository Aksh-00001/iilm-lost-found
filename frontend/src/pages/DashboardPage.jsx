import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import { ItemCardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`card p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <p className="font-display text-3xl font-bold text-navy-900 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          api.get('/items/user/my-items'),
          api.get('/items/stats')
        ]);
        setMyItems(itemsRes.data.items);
        setStats(statsRes.data.stats);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
    setDeletingId(itemId);
    try {
      await api.delete(`/items/${itemId}`);
      setMyItems(prev => prev.filter(i => i._id !== itemId));
      toast.success('Item deleted successfully');
    } catch {
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = myItems.filter(item => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'claimed') return item.status === 'claimed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : '—'}
            </p>
          </div>
          <Link to="/report" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Report New Item
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Reported"
              value={stats?.totalReported ?? 0}
              color="border-blue-500"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            />
            <StatCard
              label="Lost Items"
              value={stats?.lostReported ?? 0}
              color="border-red-400"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
            />
            <StatCard
              label="Found Items"
              value={stats?.foundReported ?? 0}
              color="border-green-400"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            />
            <StatCard
              label="Resolved"
              value={stats?.resolved ?? 0}
              color="border-amber-400"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
            />
          </div>
        )}

        {/* Items */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="section-title">My Reported Items</h2>
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'lost', 'found', 'active', 'claimed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-navy-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <ItemCardSkeleton key={i} />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">No items found</h3>
              <p className="text-slate-500 text-sm mb-6">
                {activeTab === 'all'
                  ? "You haven't reported any items yet."
                  : `No ${activeTab} items to show.`}
              </p>
              <Link to="/report" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                Report Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <div key={item._id} className="relative">
                  <ItemCard item={item} />
                  <div className="flex gap-2 mt-2 px-1">
                    <Link
                      to={`/items/${item._id}/edit`}
                      className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="flex-1 text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                      {deletingId === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Requests Section */}
        {!loading && myItems.some(i => i.claimRequests?.length > 0) && (
          <div className="card p-6 mt-6">
            <h2 className="section-title mb-6">Pending Claim Requests</h2>
            <div className="space-y-4">
              {myItems
                .filter(item => item.claimRequests?.some(c => c.status === 'pending'))
                .map(item => (
                  <div key={item._id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.type === 'lost' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                      <div>
                        <Link to={`/items/${item._id}`} className="font-semibold text-navy-900 hover:text-navy-700">
                          {item.title}
                        </Link>
                        <p className="text-sm text-slate-500">{item.location}</p>
                      </div>
                    </div>
                    {item.claimRequests
                      .filter(c => c.status === 'pending')
                      .map(claim => (
                        <ClaimRequestRow key={claim._id} claim={claim} itemId={item._id} onUpdate={(updatedItem) => {
                          setMyItems(prev => prev.map(i => i._id === updatedItem._id ? updatedItem : i));
                        }} />
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClaimRequestRow = ({ claim, itemId, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/items/${itemId}/claim/${claim._id}`, { status });
      onUpdate(data.item);
      toast.success(`Claim ${status} successfully`);
    } catch {
      toast.error('Failed to update claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-5 p-3 bg-slate-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-navy-800">{claim.claimant?.name || 'Unknown User'}</p>
        <p className="text-xs text-slate-500 mt-0.5">{claim.message}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('approved')}
          disabled={loading}
          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction('rejected')}
          disabled={loading}
          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
