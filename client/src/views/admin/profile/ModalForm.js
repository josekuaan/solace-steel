/* eslint-disable react/prop-types */
import React from 'react'

export default function ModalForm({ username, email, setUserName, setEmail, setPassword }) {
  return (
    <>
      <div className="row">
        <div className="col-sm-4">
          Email:
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
            <span className="input-group-addon"></span>
          </div>
        </div>
        <div className="col-sm-4">
          User Name:
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUserName(e.target.value.toLowerCase())}
              required
            />
            <span className="input-group-addon"></span>
          </div>
        </div>
        <div className="col-sm-4">
          Password:
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="input-group-addon"></span>
          </div>
        </div>
      </div>
    </>
  )
}
