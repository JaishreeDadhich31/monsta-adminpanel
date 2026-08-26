import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { HiPencilAlt } from 'react-icons/hi'

const readAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('admin_data') || '{}')
  } catch {
    return {}
  }
}

const normalizeAdmin = (admin) => ({
  name: admin.name || admin.full_name || admin.username || 'Administrator',
  email: admin.email || '',
  mobile_number: admin.mobile_number || admin.mobile || admin.phone || '',
  image: admin.image || admin.profile_image || admin.profileImage || '',
  role: admin.role || 'Admin',
})

export default function MyProfile() {
  const [admin, setAdmin] = useState(() => normalizeAdmin(readAdmin()))
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const syncProfile = () => setAdmin(normalizeAdmin(readAdmin()))
    window.addEventListener('storage', syncProfile)
    return () => window.removeEventListener('storage', syncProfile)
  }, [])

  const initials = useMemo(() => admin.name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'A', [admin.name])

  const saveProfile = (event) => {
    event.preventDefault()
    const existing = readAdmin()
    const updated = { ...existing, ...admin }
    localStorage.setItem('admin_data', JSON.stringify(updated))
    setAdmin(normalizeAdmin(updated))
    setMessage('Profile details saved successfully.')
    setIsEditing(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 ml-64 p-5 pt-20">
      <nav className="flex mb-5 text-sm" aria-label="Breadcrumb">
        <Link to="/dash-board" className="font-medium text-gray-700 hover:text-blue-600">Home</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">My Profile</span>
      </nav>

      <div className="bg-white shadow-sm ring-1 ring-gray-200" style={{ maxWidth: '960px', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ minHeight: '142px', padding: '24px', background: 'linear-gradient(115deg, #1d4ed8, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: '3px solid rgba(255,255,255,.75)', background: 'rgba(255,255,255,.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '26px', fontWeight: 700, flex: '0 0 74px' }}>
              {admin.image ? <img src={admin.image} alt={admin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '26px', fontWeight: 700, lineHeight: 1.2 }}>{admin.name}</h1>
              <p style={{ margin: '7px 0 0', color: '#e0e7ff', fontSize: '15px', fontWeight: 500 }}>{admin.role}</p>
            </div>
          </div>
          <button onClick={() => { setIsEditing((value) => !value); setMessage('') }} className="hover:bg-gray-100" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 0, borderRadius: '8px', padding: '11px 16px', color: '#3730a3', background: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <HiPencilAlt /> {isEditing ? 'Cancel editing' : 'Edit profile'}
          </button>
        </div>
        <div className="px-6 pb-7">

          {message && <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}

          {isEditing ? (
            <form onSubmit={saveProfile} className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">Full name
                <input required value={admin.name} onChange={(event) => setAdmin({ ...admin, name: event.target.value })} className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="text-sm font-medium text-gray-700">Email address
                <input type="email" required value={admin.email} onChange={(event) => setAdmin({ ...admin, email: event.target.value })} className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="text-sm font-medium text-gray-700">Mobile number
                <input value={admin.mobile_number} onChange={(event) => setAdmin({ ...admin, mobile_number: event.target.value })} className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="text-sm font-medium text-gray-700">Profile image URL
                <input type="url" value={admin.image} onChange={(event) => setAdmin({ ...admin, image: event.target.value })} className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="https://..." />
              </label>
              <div className="sm:col-span-2"><button className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">Save changes</button></div>
            </form>
          ) : (
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"><FaEnvelope className="text-indigo-600" /><div><p className="text-xs text-gray-500">Email address</p><p className="font-medium text-gray-800">{admin.email || 'Not available'}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"><FaPhoneAlt className="text-indigo-600" /><div><p className="text-xs text-gray-500">Mobile number</p><p className="font-medium text-gray-800">{admin.mobile_number || 'Not available'}</p></div></div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
