import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/icons/logo.png'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AdminAppSidebarNav } from './AdminAppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './style.css'

// sidebar nav config
import navigation from '../_admin_nav'

const AdminAppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand
        className="d-md-down"
        to="/admin"
        style={{ padding: '20px 0 50px 20px', justifyContent: 'left' }}
      >
        <img src={logo} alt="logo" className="c-sidebar-brand-full" height={25} width={100} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AdminAppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AdminAppSidebar)
