import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, Tag, Warehouse,
  ArrowLeftRight, AlertTriangle, LogOut
} from 'lucide-react'
import { TrendingUp } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { to: '/stock', label: 'Stock', icon: ArrowLeftRight },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/forecast', label: 'Forecast', icon: TrendingUp },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{
      width: '240px', minHeight: '100vh', background: '#1e293b',
      display: 'flex', flexDirection: 'column', padding: '24px 0'
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 32px', color: '#38bdf8', fontSize: '22px', fontWeight: 700 }}>
        📦 StockSense
      </div>

      {/* User info */}
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{user?.name}</div>
        <div style={{
          color: user?.role === 'admin' ? '#34d399' : '#94a3b8',
          fontSize: '12px', textTransform: 'uppercase', marginTop: '4px'
        }}>
          {user?.role}
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              background: isActive ? '#0f172a' : 'transparent',
              color: isActive ? '#38bdf8' : '#94a3b8',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 24px' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', color: '#94a3b8',
          cursor: 'pointer', fontSize: '14px', padding: '8px 0'
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}