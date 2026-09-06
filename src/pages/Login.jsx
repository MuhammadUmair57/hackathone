import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, LogIn, UserPlus, CheckCircle, Shield } from 'lucide-react';

export default function Login() {
  const { users, login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [selectedEmail, setSelectedEmail] = useState(users[0]?.email || '');
  const [error, setError] = useState('');

  // Signup form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [title, setTitle] = useState('Product Engineer');

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(selectedEmail);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to sign in');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const res = signup({ name: name.trim(), email: email.trim(), role, title });
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl p-8 z-10 text-card-foreground animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-primary/20">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Workspace OS</h1>
          <p className="text-muted-foreground mt-1 text-xs text-center">
            Modern Notion & Jira hybrid for high-velocity teams.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-muted/60 p-1 rounded-xl mb-6 border border-border/60">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In (Demo Profiles)
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs font-medium text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Quick Profile Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Select a Team Member
              </label>
              <div className="space-y-2">
                {users.map((u) => {
                  const isSelected = selectedEmail === u.email;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedEmail(u.email)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                          : 'border-border/60 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground">{u.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-muted text-muted-foreground">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle size={16} className="text-primary mr-1 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full shadow-md shadow-primary/20"
            >
              <LogIn size={15} className="mr-2" />
              Sign In to Workspace
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Usman Tariq"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usman@workspace.pk"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background font-medium"
                >
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. QA Specialist"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full shadow-md shadow-primary/20 mt-2"
            >
              <UserPlus size={15} className="mr-2" />
              Create Profile & Launch
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
