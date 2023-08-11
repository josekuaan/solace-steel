import React from 'react'
import {
  AdminAppContent,
  AdminAppSidebar,
  AppFooter,
  AdminAppHeader,
} from '../components/admin_index'

const AdminLayout = () => {
  return (
    <div>
      <AdminAppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminAppHeader />
        <div className="body flex-grow-1 px-3">
          <AdminAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default AdminLayout
