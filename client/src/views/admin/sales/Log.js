import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { WalletContext } from '../../../pageContext'
import '../../style.css'
import Items from './Items'

import BASE_URL from 'src/base_url'
import { CSpinner } from '@coreui/react'

export default function Log() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')

  const { setUsers, users, sale, setSale } = useContext(WalletContext)

  const [loading, setloading] = useState(false)
  const [saleCopy, setSaleCopy] = useState([])
  const [numberOfPages, setNumberOfPages] = useState()
  const [agent, setAgent] = useState('')
  const [active, setActive] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

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

    Axios.get(`${BASE_URL}/api/inventory/get-sales?page=${currentPage}`, config).then(function (
      response,
    ) {
      if (response.data.success) {
        setSale(response.data.sale)
        setSaleCopy(response.data.sale)
        setNumberOfPages(response.data.numberOfPages)
        setloading(false)
      }
    })
  }

  const onValueChange = (e) => {
    const { value } = e.target
    setAgent(value)
    if (value === 'alluser') {
      setSaleCopy()
      setSaleCopy(sale)
    } else {
      let saleId = sale.slice().filter((sal) => sal.userId === value)
      setActive(saleId)
      setSaleCopy(saleId)
    }
  }

  if (isLoggedIn === null) {
    return navigate('/')
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-head-content">
              <h3 className="card-title">Sales</h3>
              <select className="form-control choose-user" onChange={onValueChange}>
                <option value="alluser">All users</option>
                {users.map((user, index) => {
                  return (
                    <option key={index} value={user._id}>
                      {user.fullName}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <br />

          <div style={{ padding: ' 1.25rem' }}>
            <div className="row hide">
              <div className="col-sm-8"></div>
              <div className="col-sm-4">
                <input value="Delete" className="delete-btn" />
                <Link className="edit-btn" to="/dashboard/admin/credit-user">
                  <i className="fas fa-plus"></i> Edit Product
                </Link>
              </div>
            </div>

            {loading ? (
              <center>
                <br />
                <CSpinner color="dark" />
              </center>
            ) : sale === undefined || sale.length === 0 ? (
              // <div className=" table-responsive">
              <center>
                <p style={{ textAlign: 'center' }}>You Do not have any Transaction yet</p>
                <Link to="/dashboard/user/sale">Add to cart</Link>
              </center>
            ) : (
              <Items
                sale={saleCopy}
                numberOfPages={numberOfPages}
                setCurrentPage={setCurrentPage}
                setSaleCopy={setSaleCopy}
                setNumberOfPages={setNumberOfPages}
              />
            )}
          </div>
        </div>
      </div>
      {/* /.col */}
    </div>
  )
}
