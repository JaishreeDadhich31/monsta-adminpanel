import React, { useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'
import Sidebar from './Sidebar'


export default function CommonLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="admin-sidebar-overlay" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <Header onMenuClick={() => setSidebarOpen(true)} />

        <Outlet />

        <Footer />
    </div>
  )
}
