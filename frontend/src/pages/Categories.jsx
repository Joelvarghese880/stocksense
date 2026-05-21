import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const { isAdmin } = useAuth()

  const fetchCategories = () => api.get('/categories').then(res => setCategories(res.data))
  useEffect(() => { fetchCategories() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/categories', form)
    setForm({ name: '', description: '' })
    setShowForm(false)
    fetchCategories()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this category?')) {
      await api.delete(`/categories/${id}`)
      fetchCategories()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Categories</h2>
        {isAdmin() && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#0284c7', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600
          }}>+ Add Category</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#1e293b', borderRadius: '12px', padding: '24px',
          marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap'
        }}>
          {[{ f: 'name', r: true }, { f: 'description', r: false }].map(({ f, r }) => (
            <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
              required={r} style={{
                flex: 1, padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', minWidth: '200px'
              }} />
          ))}
          <button type="submit" style={{
            background: '#0284c7', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer'
          }}>Save</button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['ID', 'Name', 'Description', isAdmin() ? 'Actions' : ''].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '14px 20px', color: '#475569' }}>{c.id}</td>
                <td style={{ padding: '14px 20px', color: '#f1f5f9', fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{c.description || '—'}</td>
                {isAdmin() && (
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => handleDelete(c.id)} style={{
                      background: '#450a0a', color: '#fca5a5', border: 'none',
                      borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px'
                    }}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}