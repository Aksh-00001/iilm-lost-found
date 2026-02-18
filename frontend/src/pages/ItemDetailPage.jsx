import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModal, setClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data.item);
      } catch {
        toast.error('Item not found');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) return toast.error('Please describe your claim');
    setClaimLoading(true);
    try {
      const { data } = await api.post(`/items/${id}/claim`, { message: claimMessage });
      setItem(data.item);
      setClaimModal(false);
      setClaimMessage('');
      toast.success('Claim request submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete item');
      setDeleteLoading(false);
    }
  };

  const isOwner = user && item && item.owner._id === user._id;
  const hasClaimed = user && item?.claimRequests?.some(c => c.claimant._id === user._id || c.claimant === user._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="skeleton h-8 w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 skeleton h-80 rounded-2xl"></div>
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-8 w-3/4"></div>
              <div className="skeleton h-4 w-1/4"></div>
              <div className="skeleton h-24"></div>
              <div className="skeleton h-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/browse" className="hover:text-navy-700 transition-colors">Browse Items</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="text-slate-700 truncate max-w-xs">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Image */}
          <div className="lg:col-span-3">
            <div className="card overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-80 sm:h-96 bg-slate-100 flex flex-col items-center justify-center text-slate-300">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <span className="mt-3 text-sm font-medium">No photo provided</span>
                </div>
              )}
            </div>

            {/* Claim Requests (owner view) */}
            {isOwner && item.claimRequests?.length > 0 && (
              <div className="card p-6 mt-4">
                <h3 className="font-display font-semibold text-navy-900 mb-4">
                  Claim Requests ({item.claimRequests.length})
                </h3>
                <div className="space-y-4">
                  {item.claimRequests.map(claim => (
                    <ClaimRow key={claim._id} claim={claim} itemId={item._id} onUpdate={setItem} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>{item.type}</span>
                <span className={
                  item.status === 'active' ? 'badge-active' :
                  item.status === 'claimed' ? 'badge-claimed' : 'badge-resolved'
                }>{item.status}</span>
              </div>

              <h1 className="font-display text-2xl font-bold text-navy-900 mb-1">{item.title}</h1>
              <p className="text-slate-500 text-sm mb-5">{item.category}</p>

              <div className="space-y-3 border-t border-slate-100 pt-5">
                <DetailRow icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                } label="Location" value={item.location} />
                <DetailRow icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                } label="Date" value={format(new Date(item.date), 'MMMM d, yyyy')} />
                <DetailRow icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                } label="Reported by" value={item.owner?.name || 'Anonymous'} />
                {item.owner?.department && (
                  <DetailRow icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 9V7H2v5l10 5 10-5V9z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  } label="Department" value={item.owner.department} />
                )}
              </div>

              {/* Description */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Description</p>
                <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Actions */}
            {user ? (
              isOwner ? (
                <div className="card p-5 space-y-3">
                  <p className="text-sm font-medium text-slate-600 text-center">This is your listing</p>
                  <Link to={`/items/${item._id}/edit`} className="btn-secondary w-full text-center block text-sm py-2.5">
                    Edit Item
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-60"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Item'}
                  </button>
                </div>
              ) : item.status !== 'active' ? (
                <div className="card p-5 text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-navy-900 mb-1">Item {item.status}</p>
                  <p className="text-slate-500 text-sm">This item has already been {item.status}.</p>
                </div>
              ) : (
                <div className="card p-5 space-y-3">
                  {hasClaimed ? (
                    <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-amber-700 font-medium text-sm">Claim request submitted ✓</p>
                      <p className="text-amber-600 text-xs mt-0.5">Waiting for owner's response</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setClaimModal(true)}
                      className="btn-primary w-full text-sm py-3"
                    >
                      Submit Claim Request
                    </button>
                  )}
                  {item.owner?.email && (
                    <a
                      href={`mailto:${item.owner.email}?subject=Regarding: ${item.title} on IILM Lost & Found`}
                      className="btn-secondary w-full text-center block text-sm py-2.5"
                    >
                      Contact Owner
                    </a>
                  )}
                </div>
              )
            ) : (
              <div className="card p-5 text-center">
                <p className="text-slate-600 text-sm mb-4">Login to claim this item or contact the owner</p>
                <Link to="/login" className="btn-primary w-full text-center block text-sm py-2.5">
                  Login to Claim
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <Modal isOpen={claimModal} onClose={() => setClaimModal(false)} title="Submit Claim Request">
        <p className="text-slate-600 text-sm mb-5">
          Describe why this item belongs to you. Include specific details that prove ownership — the owner will review your request.
        </p>
        <form onSubmit={handleClaim} className="space-y-4">
          <textarea
            value={claimMessage}
            onChange={e => setClaimMessage(e.target.value)}
            rows={5}
            placeholder="e.g., This is my laptop. It has a sticker of a mountain on the lid, and my initials RS are written inside the cover. I lost it on Monday near the library..."
            className="input-field resize-none"
            required
          />
          <div className="flex gap-3">
            <button type="button" onClick={() => setClaimModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button
              type="submit"
              disabled={claimLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {claimLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {claimLoading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm text-slate-800 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

const ClaimRow = ({ claim, itemId, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/items/${itemId}/claim/${claim._id}`, { status });
      onUpdate(data.item);
      toast.success(`Claim ${status}`);
    } catch {
      toast.error('Failed to update claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-navy-900">{claim.claimant?.name}</p>
          <p className="text-xs text-slate-400">{claim.claimant?.email}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          claim.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          claim.status === 'approved' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {claim.status}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-3">{claim.message}</p>
      {claim.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('approved')}
            disabled={loading}
            className="flex-1 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction('rejected')}
            disabled={loading}
            className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
