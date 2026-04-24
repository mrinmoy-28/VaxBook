import { useState } from 'react';
import { createAdmin } from '../../api/admin';

const empty = { name: '', email: '', password: '' };

export default function CreateAdmin() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await createAdmin(form);
      setSuccess('Admin account created successfully.');
      setForm(empty);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-4">
      <div>
        <span className="chip mb-2">Admin</span>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Create Admin</h2>
        <p className="mt-1 text-sm text-ink-500">Create a new admin account (admin-only).</p>
      </div>

      <div className="card mt-6 max-w-xl">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200/70 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              name="name"
              required
              placeholder="Admin Name"
              value={form.name}
              onChange={onChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              value={form.email}
              onChange={onChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Password (min 6)</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              className="input"
            />
          </div>

          <button disabled={saving} className="btn-primary w-full py-3 text-base">
            {saving ? 'Creating…' : 'Create admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

