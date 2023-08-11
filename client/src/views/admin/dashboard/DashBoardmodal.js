/* eslint-disable react/prop-types */
import React, { useContext } from 'react'

import { WalletContext } from '../../../pageContext'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'

export default function DashBoardmodal({ modal, setModal }) {
  const { others } = useContext(WalletContext)

  return (
    <div>
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Quantity Remaining</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row" style={{ marginBottom: '10px' }}>
            <ul className="__subcat__">
              {others.map((item, index) => {
                let shop = item._id.split(' ').join('')
                return (
                  <div key={index}>
                    <li className="page-item">
                      <div
                        className="panel-group accordion"
                        id="accordionId"
                        style={{ width: '80%' }}
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
                                {item._id}
                              </a>
                            </h4>
                          </div>
                          <div
                            id={shop}
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordionId"
                          >
                            {item.result.map((i, index) => {
                              return (
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                  key={index}
                                >
                                  <div className="panel-body">{i.type}</div>
                                  <div className="panel-body">{i.qty} Qty</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </li>
                    <hr />
                  </div>
                )
              })}
            </ul>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}
