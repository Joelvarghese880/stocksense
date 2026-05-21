import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Warehouses from './pages/Warehouses'
import Stock from './pages/Stock'
import Alerts from './pages/Alerts'
import Forecast from './pages/Forecast'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', color: '#f1f5f9', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
          <Route path="/warehouses" element={<ProtectedRoute><Layout><Warehouses /></Layout></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><Layout><Stock /></Layout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>} />
          <Route path="/forecast" element={<ProtectedRoute><Layout><Forecast /></Layout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}