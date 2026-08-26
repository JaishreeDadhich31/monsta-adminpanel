import { Link, useNavigate } from 'react-router'
import { FiLogOut } from 'react-icons/fi'

export default function Logout() {
  const navigate = useNavigate()

  const confirmLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_data')
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-screen bg-gray-50 ml-64 p-5 pt-20">
      <div className="bg-white text-center shadow-sm ring-1 ring-gray-200" style={{ maxWidth: '500px', margin: '48px auto', padding: '34px', borderRadius: '16px' }}>
        <div style={{ width: '66px', height: '66px', margin: '0 auto', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLogOut size="30" /></div>
        <h1 style={{ margin: '20px 0 0', color: '#111827', fontSize: '24px', fontWeight: 700 }}>Log out of Admin Panel?</h1>
        <p style={{ margin: '10px 0 0', color: '#6b7280' }}>You will need to sign in again to access the dashboard.</p>
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <Link to="/dash-board" style={{ display: 'inline-block', border: '1px solid #d1d5db', borderRadius: '8px', padding: '11px 20px', color: '#374151', fontWeight: 600, textDecoration: 'none' }}>Cancel</Link>
          <button onClick={confirmLogout} style={{ display: 'inline-block', border: 0, borderRadius: '8px', padding: '11px 20px', background: '#dc2626', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>Yes, log out</button>
        </div>
      </div>
    </main>
  )
}
