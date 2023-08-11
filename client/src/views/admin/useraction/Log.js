import React, { useEffect, useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Axios from 'axios'

import { WalletContext } from '../../../pageContext'

import '../../style.css'
import Items from './Items'
// import Pagination from './Pagination'
import BASE_URL from 'src/base_url'
import { CSpinner } from '@coreui/react'

export default function Log() {
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const { inventory, setInventory, users, setUsers } = useContext(WalletContext)

  const [agent, setAgent] = useState('')
  const [active, setActive] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState()
  const [currentInvent, setCurrentInvent] = useState([])
  const [loading, setloading] = useState(false)

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  useEffect(() => {
    fetchData()
  }, [currentPage])
  const fetchData = () => {
    setloading(true)
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
      }
    })
    Axios.get(`${BASE_URL}/api/inventory/get-inventories?page=${currentPage}`, config).then(
      function (response) {
        if (response.data.success) {
          setNumberOfPages(response.data.numberOfPages)
          setInventory(response.data.inventory)
          setCurrentInvent(response.data.inventory)
          setloading(false)
        }
      },
    )
  }
  const onValueChange = (e) => {
    const { value } = e.target
    setAgent(value)
    if (value === 'alluser') {
      setCurrentInvent()
      setCurrentInvent(inventory)
    } else {
      let inventoryId = inventory.slice().filter((invent) => invent.shop === value)
      setActive(inventoryId)
      setCurrentInvent(inventoryId)
    }
  }

  if (isLoggedIn === null) {
    return <Navigate to="/" />
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-head-content">
              <h3 className="card-title">History</h3>

              <select className="form-control choose-user" onChange={onValueChange}>
                <option value="alluser">All users</option>
                {users.map((user, index) => {
                  return (
                    <option key={index} value={user.shop}>
                      {user.shop}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <br />
          <br />

          <div style={{ padding: ' 1.25rem' }}>
            {loading ? (
              <center>
                <CSpinner color="dark" />
              </center>
            ) : inventory === undefined || inventory.length === 0 ? (
              // <div className=" table-responsive">
              <table className="table table-bordered" style={{ marginBottom: '0rem' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <p style={{ textAlign: 'center' }}>You do not have any Transaction yet</p>
                      <Link to="/dashboard/admin/create-product">Create product</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <Items
                inventory={currentInvent}
                numberOfPages={numberOfPages}
                setCurrentPage={setCurrentPage}
                setCurrentInvent={setCurrentInvent}
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
