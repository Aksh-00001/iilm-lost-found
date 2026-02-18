import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ItemCard = ({ item }) => {
  const imageUrl = item.image ? item.image : null;

  return (
    <Link to={`/items/${item._id}`} className="block group">
      <div className="card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        {/* Image */}
        <div className="relative h-44 bg-slate-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="text-xs mt-2 font-medium">No Image</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
              {item.type}
            </span>
            {item.status !== 'active' && (
              <span className={item.status === 'claimed' ? 'badge-claimed' : 'badge-resolved'}>
                {item.status}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display font-semibold text-navy-900 text-base leading-snug line-clamp-1 group-hover:text-navy-700 transition-colors">
              {item.title}
            </h3>
          </div>

          <p className="text-slate-400 text-xs font-medium mb-2">{item.category}</p>

          <p className="text-slate-600 text-sm line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate max-w-[100px]">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
