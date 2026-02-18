import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="font-display text-9xl font-bold text-navy-100 leading-none mb-4">404</div>
      <h1 className="font-display text-3xl font-bold text-navy-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 max-w-sm mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/browse" className="btn-secondary">Browse Items</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
