// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import logo from '../assets/icons/logo.png'
// import {
//   CHeader,
//   CHeaderToggler,
//   CHeaderBrand,
//   CHeaderNav,
//   CNavItem,
//   CContainer,
//   CNavLink,
//   CHeaderDivider,
//   AppBreadcrumb,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'

// import './style.css'
// // routes config
// import routes from '../routes'
// import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

// import { TheHeaderDropdown } from './index'

// const TheHeader = () => {
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   const toggleSidebar = () => {
//     const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
//     dispatch({ type: 'set', sidebarShow: val })
//   }

//   const toggleSidebarMobile = () => {
//     const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
//     dispatch({ type: 'set', sidebarShow: val })
//   }

//   return (
//     <CHeader withSubheader>
//       {/* <div className="c-header" style={{ backgroundColor: '#1d2330', width: '100%' }}> */}
//       <CContainer fluid style={{ backgroundColor: '#1d2330', width: '100%' }}>
//         <CHeaderToggler
//           inHeader
//           className="ml-md-3 d-lg-none first"
//           style={{
//             minWidth: '30px',
//             height: '30px',
//             marginTop: '12px',
//             marginLeft: '12px',
//             backgroundColor: 'white',
//           }}
//           onClick={toggleSidebarMobile}
//         />
//         <CHeaderToggler
//           inHeader
//           className="ml-3 d-md-down-none second"
//           style={{
//             minWidth: '30px',
//             height: '30px',
//             marginTop: '12px',
//             backgroundColor: 'white',
//           }}
//           onClick={toggleSidebar}
//         />
//         <CHeaderBrand className="mx-auto d-lg-none" to="#">
//           {/* <CIcon name="logo" height="48" alt="Logo" /> */}
//           <img src={logo} alt="logo" className="c-sidebar-brand-full" height={35} />
//         </CHeaderBrand>

//         <CHeaderNav className="px-3">
//           <TheHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>
//       {/* </div> */}
//       <CHeaderDivider />
//       <CContainer fluid>
//         {/* <CSubheader className="px-3 justify-content-between"> */}
//         {/* <AppBreadcrumb /> */}
//         {/* <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} /> */}
//       </CContainer>
//     </CHeader>
//   )
// }

// export default TheHeader

import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AdminBreadcrumb } from './index'
import { AdminHeaderDropdown } from './header/index'
// import { logo } from 'src/assets/brand/logo'
import logo from '../assets/icons/logo.png'

const AdminAppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/admin" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AdminHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AdminBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AdminAppHeader
