import React from 'react'
import CIcon from '@coreui/icons-react'

import { CNavItem } from '@coreui/react'
import { cilCalendarCheck, cilHome } from '@coreui/icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Shop',
    to: '/user',
    icon: <CIcon icon={cilHome} style={{ fontSize: '100px', margin: '0 20px 0 0' }} size="xl" />,

    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  {
    component: CNavItem,
    name: 'History',
    to: '/user/log',
    icon: (
      <CIcon
        icon={cilCalendarCheck}
        style={{ fontSize: '100px', margin: '0 20px 0 0' }}
        size="xl"
      />
    ),
  },
]

export default _nav
