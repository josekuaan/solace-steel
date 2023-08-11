import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed="false" style={{ justifyContent: 'center', fontSize: '15px' }}>
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Solace Steel
        </a>
        <span className="ml-1">&copy; 2023 solace steel.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
