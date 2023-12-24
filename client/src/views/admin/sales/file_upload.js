import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { WalletContext } from '../../../pageContext'
import '../../style.css'

import BASE_URL from 'src/base_url'
import { CSpinner } from '@coreui/react'

export default function FileUpload() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')

  const { setUsers, users } = useContext(WalletContext)

  const [loading, setloading] = useState(false)

  const [file, setFile] = useState()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Authorization: `Bearer ${token}`,
    },
  }
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    setloading(true)

    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
      }
    })
  }
  const fileUpload = () => {
    console.log('got here', file.name)
    const formData = new FormData()
    formData.append('file', file)
    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/upload`,
      formData,

      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        Authorization: `Bearer ${token}`,
      },
    }).then(function (response) {})
  }

  if (isLoggedIn === null) {
    return navigate('/')
  }
  console.log(file)
  return (
    <div className="row">
      <div className="col-md-12">
        <div
          className="card"
          style={{
            height: '400px',
          }}
        >
          <div className="card-head-content upload-card">
            {/* <h3 className="card-title">Sales</h3> */}
            <div>
              <div className="parent">
                <div className="file-upload">
                  {/* <img src={uploadImg} alt="upload" /> */}
                  {file !== undefined ? <h3>Click box to upload</h3> : <h3>{file.name}</h3>}

                  <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>
              </div>
              <br />
              {file ? (
                <div className="__edit-btn-container">
                  <input
                    className={`update fill `}
                    style={{
                      borderRadius: 2,
                      border: 'none',
                      color: '#fff',

                      cursor: 'pointer',
                    }}
                    type="submit"
                    onClick={() => fileUpload()}
                    value={'Upload'}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  )
}
