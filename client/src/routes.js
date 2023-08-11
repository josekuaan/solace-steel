import React from 'react'

import Admin from './views/admin/dashboard/Dashboard'

import Sales from './views/user/sale/Sale'

import Log from './views/user/sale/Log'

// import MePage from "./views/user/me/Content";
import SalesLog from './views/admin/sales/Log'
import ProductsCatlog from './views/admin/useraction/Log'
import Credit from './views/admin/useraction/Create'
import ReturnItem from './views/admin/useraction/Return'
import Retstock from './views/admin/useraction/Restock'
import AdminProfile from './views/admin/profile/Content'

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Admin', element: Admin, exact: true },
  // { path: '/admin', name: 'Base', element: Credit, exact: true },
  {
    path: '/create-product',
    name: 'Create Product',
    element: Credit,
    // exact: true,
  },
  {
    path: '/sales-log',
    name: 'Sales Log',
    element: SalesLog,
    // exact: true,
  },
  {
    path: '/return-item',
    name: 'Returned Item',
    element: ReturnItem,
    // exact: true,
  },
  {
    path: '/restock',
    name: 'Returned',
    element: Retstock,
    // exact: true,
  },
  {
    path: '/product-catlog',
    name: 'Products Catlog',
    element: ProductsCatlog,
    // exact: true,
  },

  {
    path: '/admin-profile',
    name: 'Admin Profile',
    element: AdminProfile,
    // exact: true,
  },

  {
    path: '/shop',
    name: 'Sales',
    element: Sales,
    exact: true,
  },

  {
    path: '/log',
    name: 'Log',
    element: Log,
    exact: true,
  },
]

export default routes
