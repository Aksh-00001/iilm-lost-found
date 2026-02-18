import React from 'react';

export const ItemCardSkeleton = () => (
  <div className="card">
    <div className="skeleton h-44 w-full rounded-none"></div>
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4"></div>
      <div className="skeleton h-3 w-1/4"></div>
      <div className="skeleton h-3 w-full"></div>
      <div className="skeleton h-3 w-4/5"></div>
      <div className="flex justify-between pt-2">
        <div className="skeleton h-3 w-1/3"></div>
        <div className="skeleton h-3 w-1/4"></div>
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <div className="skeleton w-16 h-16 rounded-full"></div>
      <div className="space-y-2">
        <div className="skeleton h-5 w-32"></div>
        <div className="skeleton h-3 w-48"></div>
      </div>
    </div>
    <div className="skeleton h-10 w-full"></div>
    <div className="skeleton h-10 w-full"></div>
    <div className="skeleton h-10 w-full"></div>
  </div>
);
