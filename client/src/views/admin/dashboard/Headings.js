/* eslint-disable no-undef */
import React from 'react'

export default function Dashboard() {
  return (
    <div className="panel-group accordion" id="accordionId" style={{ width: '80%' }}>
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
              href="#"
            >
              {item._id}
            </a>
          </h4>
        </div>
        <div id={shop} className="collapse" aria-labelledby="headingTwo" data-parent="#accordionId">
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
  )
}
