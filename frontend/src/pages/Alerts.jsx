import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    api.get('/stock/alerts').then(res => setAlerts(res.data))
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
        🚨 Low Stock Alerts
      </h2>
      {alerts.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#475569' }}>
          ✅ All stock levels are healthy
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              background: '#1e293b', borderRadius: '12px', padding: '20px',
              borderLeft: `4px solid ${a.status === 'OUT OF STOCK' ? '#ef4444' : '#f59e0b'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{a.product_name}</div>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                  SKU: {a.sku} · Warehouse: {a.warehouse_name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: a.status === 'OUT OF STOCK' ? '#ef4444' : '#f59e0b',
                  fontWeight: 700, fontSize: '13px'
                }}>
                  {a.status}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                  {a.current_quantity} / {a.threshold} units
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}