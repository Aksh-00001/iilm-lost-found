import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Campus-Wide Coverage',
    desc: 'Report items from any location across the IILM campus — library, hostels, cafeteria, and beyond.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Secure & Verified',
    desc: 'Only verified IILM community members can access the portal, ensuring a trusted environment.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
      </svg>
    ),
    title: 'Instant Claim Requests',
    desc: 'Submit and manage claims directly through the portal and get notified when your request is accepted.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
    ),
    title: 'Photo Evidence',
    desc: 'Upload photos of found items to help owners identify their belongings with confidence.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Smart Search & Filter',
    desc: 'Quickly browse items by category, location, date, or search keywords to find what matters.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Personal Dashboard',
    desc: 'Track all your reported and claimed items in one organized place with full history.'
  }
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up with your IILM email to get instant access.' },
  { num: '02', title: 'Report the Item', desc: 'Fill in details, location, and upload a photo of the lost or found item.' },
  { num: '03', title: 'Get Matched', desc: 'The community browses listings and submits claim requests.' },
  { num: '04', title: 'Reunite', desc: 'Verify and approve the claim — item returned, case closed.' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-100"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950/60 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600/50 rounded-full px-4 py-2 text-sm text-navy-200 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></span>
              IILM University Campus Portal
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Lost Something?
              <span className="block text-navy-300 mt-1">We've Got You.</span>
            </h1>

            <p className="text-navy-200 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl font-body">
              The official IILM campus portal to report lost items, post found belongings, and help your community reclaim what's theirs.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link to="/report" className="bg-white text-navy-900 px-7 py-3.5 rounded-xl font-semibold hover:bg-navy-50 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Report Item
                  </Link>
                  <Link to="/browse" className="border border-navy-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-navy-800 transition-all active:scale-95">
                    Browse Items
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-navy-900 px-7 py-3.5 rounded-xl font-semibold hover:bg-navy-50 transition-all shadow-lg hover:shadow-xl active:scale-95">
                    Get Started Free
                  </Link>
                  <Link to="/browse" className="border border-navy-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-navy-800 transition-all active:scale-95">
                    Browse Items
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap gap-8">
            {[
              { label: 'Items Reported', value: '500+' },
              { label: 'Items Recovered', value: '300+' },
              { label: 'Active Users', value: '1,000+' },
              { label: 'Recovery Rate', value: '60%' },
            ].map(({ label, value }) => (
              <div key={label} className="border-l-2 border-navy-600 pl-4">
                <div className="font-display text-2xl font-bold text-white">{value}</div>
                <div className="text-navy-400 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-navy-500 font-semibold text-sm uppercase tracking-widest mb-3">Why Use Our Portal</p>
            <h2 className="font-display text-4xl font-bold text-navy-900">Everything You Need</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              A complete system designed for the IILM community to report, find, and reclaim items efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:bg-navy-50 hover:border-navy-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 bg-navy-100 text-navy-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy-800 group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-navy-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-navy-500 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-display text-4xl font-bold text-navy-900">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-navy-100 z-0" style={{width: 'calc(100% - 3rem)', left: '3rem'}}></div>
                )}
                <div className="relative z-10 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="font-display text-4xl font-bold text-navy-100 mb-4">{step.num}</div>
                  <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to Find What's Lost?
          </h2>
          <p className="text-navy-300 text-lg mb-8">
            Join hundreds of IILM students and faculty already using the portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <>
                <Link to="/report" className="bg-white text-navy-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-navy-50 transition-all shadow-lg active:scale-95">
                  Report an Item
                </Link>
                <Link to="/browse" className="border border-navy-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-navy-800 transition-all active:scale-95">
                  Browse Listings
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-white text-navy-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-navy-50 transition-all shadow-lg active:scale-95">
                  Create Free Account
                </Link>
                <Link to="/login" className="border border-navy-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-navy-800 transition-all active:scale-95">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
