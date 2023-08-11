import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

const AppHeaderDropdown = () => {
  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div className="profile-background">
          <i className="fa fa-user" style={{ padding: '12px', fontSize: '10px' }}></i>
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>

        <CDropdownItem href="#" onClick={handleLogout}>
          {/* <CIcon name="cil-lock-locked" className="mfe-2" /> */}
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
