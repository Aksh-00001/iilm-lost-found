import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-navy-900 text-white mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg">IILM Lost &amp; Found</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Helping IILM campus community reconnect with lost belongings. A trusted platform for students and faculty.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/browse', label: 'Browse Items' },
              { to: '/report', label: 'Report Item' },
              { to: '/dashboard', label: 'My Dashboard' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Campus Locations</h4>
          <ul className="space-y-1 text-slate-400 text-sm">
            {['Library', 'Cafeteria', 'Main Block', 'Hostels', 'Sports Complex', 'Parking Area'].map(loc => (
              <li key={loc} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-navy-400 rounded-full flex-shrink-0"></span>
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} IILM University Lost &amp; Found Portal. All rights reserved.
        </p>
        <p className="text-slate-500 text-sm">
          Made with ❤️ for the IILM community
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
