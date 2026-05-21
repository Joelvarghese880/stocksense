import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', description: '', price: '', low_stock_threshold: 10, category_id: '' })
  const { isAdmin } = useAuth()

  const fetchAll = async () => {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')])
    setProducts(p.data)
    setCategories(c.data)
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/products', { ...form, price: parseFloat(form.price), category_id: parseInt(form.category_id) })
    setForm({ name: '', sku: '', description: '', price: '', low_stock_threshold: 10, category_id: '' })
    setShowForm(false)
    fetchAll()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await api.delete(`/products/${id}`)
      fetchAll()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Products</h2>
        {isAdmin() && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#0284c7', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600
          }}>+ Add Product</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#1e293b', borderRadius: '12px', padding: '24px',
          marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
        }}>
          {[
            { f: 'name', p: 'Product Name', t: 'text', r: true },
            { f: 'sku', p: 'SKU', t: 'text', r: true },
            { f: 'price', p: 'Price', t: 'number', r: true },
            { f: 'low_stock_threshold', p: 'Low Stock Threshold', t: 'number', r: false },
            { f: 'description', p: 'Description', t: 'text', r: false },
          ].map(({ f, p, t, r }) => (
            <input key={f} type={t} placeholder={p} value={form[f]}
              onChange={e => setForm({ ...form, [f]: e.target.value })}
              required={r} style={{
                padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9'
              }} />
          ))}
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
            required style={{
              padding: '10px 12px', background: '#0f172a',
              border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9'
            }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit" style={{
            gridColumn: 'span 2', background: '#0284c7', color: 'white',
            border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600
          }}>Save Product</button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Name', 'SKU', 'Category', 'Price', 'Threshold', isAdmin() ? 'Actions' : ''].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '14px 20px', color: '#f1f5f9', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{p.sku}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{p.category.name}</td>
                <td style={{ padding: '14px 20px', color: '#34d399' }}>₹{p.price.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', color: '#f59e0b' }}>{p.low_stock_threshold}</td>
                {isAdmin() && (
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => handleDelete(p.id)} style={{
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