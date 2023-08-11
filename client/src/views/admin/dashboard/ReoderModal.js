/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import { WalletContext } from '../../../pageContext'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'

export default function ReoderModal({ level }) {
  const { setLevel } = useContext(WalletContext)
  const [modalReoder, setModalReoder] = useState(false)

  useEffect(() => {
    if (level.length >= 0) {
      setModalReoder(true)
    }
  })

  return (
    <CModal
      visible={modalReoder}
      onClose={() => {
        setLevel([])
        setModalReoder(false)
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>Notification</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {level.map((invent, index) => {
          let shop = invent.shop.split(' ').join('')
          return (
            <div
              className="panel-group accordion"
              id="accordionId"
              style={{ width: '80%' }}
              key={index}
            >
              <div className="panel panel-default">
                <div className="panel-heading" id="headingTwo">
                  <h4 className="panel-title">
                    <a
                      className="collapsed"
                      data-toggle="collapse"
                      data-target={`#${shop}`}
                      aria-expanded="false"
                      aria-controls="collapse2"
                      style={{
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          color: 'red',
                        }}
                      >
                        {invent.shop}
                      </div>
                    </a>
                  </h4>
                </div>
                <div
                  id={shop}
                  className="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordionId"
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div className="panel-body">{invent.category}</div>
                      <div className="panel-body">{invent.type}</div>
                      <div
                        className="panel-body"
                        style={{
                          color: 'red',
                        }}
                      >
                        {invent.qty} Qty
                      </div>
                      <div className="panel-body"> remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CModalBody>
    </CModal>
  )
}
