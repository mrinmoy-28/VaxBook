import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

const items = [
  {
    to: '/admin/hospitals', label: 'Hospitals', desc: 'Add / update hospital details',
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/></svg>),
  },
  {
    to: '/admin/vaccines', label: 'Vaccines', desc: 'Define vaccines & cost per dose',
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4-10 10H8v-4L18 2z"/><path d="m15 5 4 4"/></svg>),
  },
  {
    to: '/admin/slots', label: 'Daily slots', desc: 'Set capacity per date',
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>),
  },
  {
    to: '/admin/bookings', label: 'Bookings', desc: 'View bookings for a given day',
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>),
  },
  {
    to: '/admin/create-admin', label: 'Create admin', desc: 'Invite / create new admin accounts',
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>),
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedToday: 0,
    availableSlots: 0,
    activeHospitals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pt-4">
      <div>
        <span className="chip mb-2">Admin</span>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Dashboard</h2>
        <p className="mt-1 text-sm text-ink-500">Manage hospitals, vaccines, capacity and daily bookings.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { k: stats.totalBookings, v: 'Total bookings' },
          { k: stats.confirmedToday, v: 'Confirmed today' },
          { k: stats.availableSlots, v: 'Available slots' },
          { k: stats.activeHospitals, v: 'Active hospitals' },
        ].map((s) => (
          <div key={s.v} className="card">
            <div className="text-xs uppercase tracking-wider text-ink-500">{s.v}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">{loading ? '—' : s.k}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(i => (
          <Link key={i.to} to={i.to} className="card card-hover flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">{i.icon}</div>
            <div>
              <div className="text-lg font-semibold text-ink-900">{i.label}</div>
              <div className="text-sm text-ink-600">{i.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
