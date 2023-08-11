import React from 'react'
import CIcon from '@coreui/icons-react'

import { CNavItem } from '@coreui/react'
import { cilCalendarCheck, cilHome, cilSpreadsheet, cilChartLine } from '@coreui/icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin',
    icon: <CIcon icon={cilHome} style={{ fontSize: '100px', margin: '0 20px 0 0' }} size="xl" />,
  },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  {
    component: CNavItem,
    name: 'Create Product',
    to: '/admin/create-product',
    icon: (
      <CIcon
        icon={cilCalendarCheck}
        style={{ fontSize: '100px', margin: '0 20px 0 0' }}
        size="xl"
      />
    ),
  },
  {
    component: CNavItem,
    name: 'Product Grid',
    to: '/admin/product-catlog',
    icon: (
      <CIcon icon={cilSpreadsheet} style={{ fontSize: '100px', margin: '0 20px 0 0' }} size="xl" />
    ),
  },
  {
    component: CNavItem,
    name: 'All Sales',
    to: '/admin/sales-log',
    icon: (
      <CIcon icon={cilChartLine} style={{ fontSize: '100px', margin: '0 20px 0 0' }} size="xl" />
    ),
  },
  {
    component: CNavItem,
    name: ' Returned Items',
    to: '/admin/return-item',
    icon: (
      <i
        className="fas fa-undo c-sidebar-nav-icon"
        style={{ fontSize: '20px', margin: '0 20px 0 0' }}
      ></i>
    ),
  },
  {
    component: CNavItem,
    name: 'Restock Items',
    to: '/admin/restock',
    icon: (
      <i
        className="fa fa-indent c-sidebar-nav-icon"
        style={{ fontSize: '20px', margin: '0 20px 0 0px' }}
      ></i>
    ),
  },
]

export default _nav
