import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Stock() {
  const [stock, setStock] = useState([])
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [tab, setTab] = useState('levels')
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', note: '' })

  const fetchAll = async () => {
    const [s, m, p, w] = await Promise.all([
      api.get('/stock'), api.get('/stock/movements'),
      api.get('/products'), api.get('/warehouses')
    ])
    setStock(s.data); setMovements(m.data)
    setProducts(p.data); setWarehouses(w.data)
  }

  useEffect(() => { fetchAll() }, [])

  const handleStockAction = async (type) => {
    await api.post(`/stock/${type}`, {
      ...form,
      product_id: parseInt(form.product_id),
      warehouse_id: parseInt(form.warehouse_id),
      quantity: parseInt(form.quantity)
    })
    setForm({ product_id: '', warehouse_id: '', quantity: '', note: '' })
    fetchAll()
  }

  const tabStyle = (t) => ({
    padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 600, fontSize: '14px',
    background: tab === t ? '#0284c7' : '#1e293b',
    color: tab === t ? 'white' : '#94a3b8'
  })

  const selectStyle = {
    padding: '10px 12px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', width: '100%'
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Stock Management</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['levels', 'in', 'out', 'movements'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'levels' ? 'Stock Levels' : t === 'in' ? 'Stock In' : t === 'out' ? 'Stock Out' : 'Movements'}
          </button>
        ))}
      </div>

      {/* Stock Levels */}
      {tab === 'levels' && (
        <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Product', 'Warehouse', 'Quantity', 'Status'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stock.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '14px 20px', color: '#f1f5f9' }}>{s.product.name}</td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{s.warehouse.name}</td>
                  <td style={{ padding: '14px 20px', color: '#f1f5f9', fontWeight: 600 }}>{s.quantity}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: s.quantity === 0 ? '#450a0a' : s.quantity <= s.product.low_stock_threshold ? '#451a03' : '#052e16',
                      color: s.quantity === 0 ? '#fca5a5' : s.quantity <= s.product.low_stock_threshold ? '#fcd34d' : '#86efac'
                    }}>
                      {s.quantity === 0 ? 'Out of Stock' : s.quantity <= s.product.low_stock_threshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock In / Out Form */}
      {(tab === 'in' || tab === 'out') && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', maxWidth: '480px' }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
            {tab === 'in' ? '📥 Add Stock' : '📤 Remove Stock'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <select value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} style={selectStyle}>
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={form.warehouse_id} onChange={e => setForm({ ...form, warehouse_id: e.target.value })} style={selectStyle}>
              <option value="">Select Warehouse</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <input type="number" placeholder="Quantity" value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              style={selectStyle} />
            <input type="text" placeholder="Note (optional)" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              style={selectStyle} />
            <button onClick={() => handleStockAction(tab)} style={{
              background: tab === 'in' ? '#0284c7' : '#dc2626', color: 'white',
              border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600
            }}>
              {tab === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </div>
        </div>
      )}

      {/* Movements Log */}
      {tab === 'movements' && (
        <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Product', 'Warehouse', 'Type', 'Quantity', 'Note', 'Date'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '14px 20px', color: '#f1f5f9' }}>{m.product.name}</td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{m.warehouse.name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: m.movement_type === 'IN' ? '#052e16' : m.movement_type === 'OUT' ? '#450a0a' : '#1e1b4b',
                      color: m.movement_type === 'IN' ? '#86efac' : m.movement_type === 'OUT' ? '#fca5a5' : '#a5b4fc'
                    }}>
                      {m.movement_type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#f1f5f9', fontWeight: 600 }}>{m.quantity}</td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{m.note || '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#475569', fontSize: '13px' }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}