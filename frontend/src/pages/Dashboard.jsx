import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../api/axios'
import Loader from '../components/Loader'

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#1e293b', borderRadius: '12px', padding: '24px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, w, a, s] = await Promise.all([
          api.get('/products'),
          api.get('/warehouses'),
          api.get('/stock/alerts'),
          api.get('/stock'),
        ])
        setProducts(p.data)
        setWarehouses(w.data)
        setAlerts(a.data)
        setStock(s.data)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const chartData = stock.slice(0, 6).map(s => ({
    name: s.product.name.split(' ').slice(0, 2).join(' '),
    quantity: s.quantity
  }))

  if (loading) return <Loader />

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Products" value={products.length} color="#38bdf8" />
        <StatCard label="Warehouses" value={warehouses.length} color="#34d399" />
        <StatCard label="Low Stock Alerts" value={alerts.length} color="#f59e0b" />
        <StatCard label="Stock Entries" value={stock.length} color="#a78bfa" />
      </div>
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Stock Levels by Product</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="quantity" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>
            No stock data yet.
          </p>
        )}
      </div>
    </div>
  )
}