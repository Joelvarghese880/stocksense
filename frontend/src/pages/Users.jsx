import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchUsers = () => api.get('/auth/users').then(res => setUsers(res.data))
  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await api.post('/auth/register', form)
      setSuccess(`Account created for ${form.name}`)
      setForm({ name: '', email: '', password: '', role: 'staff' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user')
    }
  }

  const handleDeactivate = async (id) => {
    if (confirm('Deactivate this user?')) {
      await api.delete(`/auth/users/${id}`)
      fetchUsers()
    }
  }

  const inputStyle = {
    padding: '10px 12px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px',
    color: '#f1f5f9', width: '100%', boxSizing: 'border-box'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>User Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Only admins can create and manage user accounts
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }} style={{
          background: '#0284c7', color: 'white', border: 'none',
          borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600
        }}>
          + Add User
        </button>
      </div>

      {success && (
        <div style={{
          background: '#052e16', color: '#86efac', padding: '12px 16px',
          borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
        }}>
          ✅ {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#1e293b', borderRadius: '12px', padding: '24px',
          marginBottom: '24px', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: '16px'
        }}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required style={inputStyle}
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            style={inputStyle}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          {error && (
            <div style={{
              gridColumn: 'span 2', background: '#450a0a', color: '#fca5a5',
              padding: '10px 16px', borderRadius: '8px', fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          <button type="submit" style={{
            gridColumn: 'span 2', background: '#0284c7', color: 'white',
            border: 'none', borderRadius: '8px', padding: '12px',
            cursor: 'pointer', fontWeight: 600, fontSize: '15px'
          }}>
            Create User
          </button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '14px 20px', textAlign: 'left',
                  color: '#94a3b8', fontSize: '13px'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '14px 20px', color: '#f1f5f9', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{u.email}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: u.role === 'admin' ? '#052e16' : '#1e1b4b',
                    color: u.role === 'admin' ? '#86efac' : '#a5b4fc'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: u.is_active ? '#052e16' : '#450a0a',
                    color: u.is_active ? '#86efac' : '#fca5a5'
                  }}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {u.is_active && (
                    <button onClick={() => handleDeactivate(u.id)} style={{
                      background: '#450a0a', color: '#fca5a5', border: 'none',
                      borderRadius: '6px', padding: '6px 12px',
                      cursor: 'pointer', fontSize: '13px'
                    }}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}