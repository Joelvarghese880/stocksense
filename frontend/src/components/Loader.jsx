export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{
        width: '36px', height: '36px', border: '3px solid #334155',
        borderTop: '3px solid #38bdf8', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}