import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.access_token)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1e293b', borderRadius: '12px',
        padding: '40px', width: '100%', maxWidth: '400px'
      }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '24px' }}>📦 StockSense</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Sign in to your account</p>

        {error && (
          <div style={{
            background: '#450a0a', color: '#fca5a5', padding: '12px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: '100%', padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px',
                color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%', padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px',
                color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', background: '#0284c7',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}