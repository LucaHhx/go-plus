import { useState } from 'react';
import { useAuth } from '../../context/AppContext';
import { authApi } from '../../api/client';
import Icon from '../ui/Icon';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      login(res.username || username, res.token);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <div className="logo-icon">G</div>
        </div>
        <h1 className="login-title">GO PLUS Admin</h1>
        <p className="login-subtitle">Sign in to continue</p>
        <div className="login-divider" />
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Username</label>
          <div className="login-input-wrap">
            <Icon name="user" size={16} />
            <input
              className={`form-input ${error ? 'error' : ''}`}
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 8 }}>
          <label className="form-label">Password</label>
          <div className="login-input-wrap">
            <Icon name="lock" size={16} />
            <input
              className={`form-input ${error ? 'error' : ''}`}
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
        </div>
        {error && <span className="form-error" style={{ marginBottom: 8, display: 'block' }}>{error}</span>}
        <button type="submit" className="btn-primary" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
