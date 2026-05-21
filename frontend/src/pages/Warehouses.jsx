import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([])
  const [form, setForm] = useState({ name: '', location: '' })
  const [showForm, setShowForm] = useState(false)
  const { isAdmin } = useAuth()

  const fetchWarehouses = () => api.get('/warehouses').then(res => setWarehouses(res.data))

  useEffect(() => { fetchWarehouses() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/warehouses', form)
    setForm({ name: '', location: '' })
    setShowForm(false)
    fetchWarehouses()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this warehouse?')) {
      await api.delete(`/warehouses/${id}`)
      fetchWarehouses()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Warehouses</h2>
        {isAdmin() && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#0284c7', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600
          }}>
            + Add Warehouse
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px',
          display: 'flex', gap: '16px', flexWrap: 'wrap'
        }}>
          {['name', 'location'].map(field => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={field === 'name'}
              style={{
                flex: 1, padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', minWidth: '200px'
              }}
            />
          ))}
          <button type="submit" style={{
            background: '#0284c7', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer'
          }}>Save</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {warehouses.map(w => (
          <div key={w.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '6px' }}>{w.name}</div>
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>📍 {w.location || 'No location set'}</div>
            {isAdmin() && (
              <button onClick={() => handleDelete(w.id)} style={{
                marginTop: '16px', background: '#450a0a', color: '#fca5a5',
                border: 'none', borderRadius: '6px', padding: '6px 12px',
                cursor: 'pointer', fontSize: '13px'
              }}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}