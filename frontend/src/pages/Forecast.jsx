import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import api from '../api/axios'

export default function Forecast() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [forecast, setForecast] = useState(null)
  const [allForecasts, setAllForecasts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data))
    api.get('/forecast/').then(res => setAllForecasts(res.data))
  }, [])

  const handleForecast = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      const res = await api.get(`/forecast/${selectedProduct}?days=30`)
      setForecast(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Only show every 5th date label on chart
  const chartData = forecast?.predictions.map((p, i) => ({
    ...p,
    label: i % 5 === 0 ? p.date.slice(5) : ''
  }))

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        🤖 AI Demand Forecasting
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
        Predicts stock demand for the next 30 days based on historical movement data.
      </p>

      {/* All products summary table */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '16px' }}>
          📊 Forecast Summary — All Products
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Product', 'SKU', 'Predicted Demand (30d)', 'Avg Daily', 'Method'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allForecasts.map(f => (
              <tr key={f.product_id} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 16px', color: '#f1f5f9' }}>{f.product_name}</td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>{f.sku}</td>
                <td style={{ padding: '12px 16px', color: '#38bdf8', fontWeight: 700 }}>
                  {f.total_predicted_demand} units
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{f.avg_daily_demand}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                    background: f.method === 'linear_regression' ? '#052e16' : '#1e1b4b',
                    color: f.method === 'linear_regression' ? '#86efac' : '#a5b4fc'
                  }}>
                    {f.method === 'linear_regression' ? 'ML Model' : 'Avg Fallback'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Per-product forecast chart */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '20px' }}>
          📈 30-Day Demand Forecast Chart
        </h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            style={{
              flex: 1, padding: '10px 12px', background: '#0f172a',
              border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9'
            }}
          >
            <option value="">Select a product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={handleForecast}
            disabled={!selectedProduct || loading}
            style={{
              padding: '10px 24px', background: '#0284c7', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
            }}
          >
            {loading ? 'Forecasting...' : 'Run Forecast'}
          </button>
        </div>

        {forecast && (
          <>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Predicted (30d)', value: `${forecast.total_predicted_demand} units`, color: '#38bdf8' },
                { label: 'Avg Daily Demand', value: `${forecast.avg_daily_demand} units/day`, color: '#34d399' },
                { label: 'Data Points Used', value: forecast.data_points_used, color: '#a78bfa' },
              ].map(card => (
                <div key={card.label} style={{
                  background: '#0f172a', borderRadius: '10px', padding: '16px',
                  borderLeft: `3px solid ${card.color}`
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>{card.label}</div>
                  <div style={{ color: card.color, fontWeight: 700, fontSize: '18px' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Line chart */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  interval={0}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value) => [`${value} units`, 'Predicted Demand']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''}
                />
                <ReferenceLine
                  y={forecast.avg_daily_demand}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'Avg', fill: '#f59e0b', fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted_demand"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <p style={{ color: '#475569', fontSize: '12px', marginTop: '12px', textAlign: 'right' }}>
              Method: {forecast.method === 'linear_regression' ? '📐 Linear Regression (ML)' : '📊 Average Fallback'}
            </p>
          </>
        )}

        {!forecast && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            Select a product and click Run Forecast to see predictions
          </div>
        )}
      </div>
    </div>
  )
}