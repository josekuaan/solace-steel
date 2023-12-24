import React, { useEffect, useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Axios from 'axios'

import { WalletContext } from '../../../pageContext'

import '../../style.css'
import Customers from './customers'
// import Pagination from './Pagination'
import BASE_URL from 'src/base_url'
import { CSpinner } from '@coreui/react'

export default function CustomerPage() {
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const { users, setUsers } = useContext(WalletContext)

  const [agent, setAgent] = useState('')
  const [active, setActive] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState()
  const [customers, setCustomers] = useState([])
  const [currentCustomers, setCurrentCustomers] = useState([])
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
    try {
      setloading(true)
      Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
        if (response.data.success) {
          setUsers(response.data.msg)
        }
      })

      Axios.get(`${BASE_URL}/api/customers/get-customers?page=${currentPage}`, config).then(
        function (response) {
          if (response.data.success) {
            setNumberOfPages(response.data.numberOfPages)
            setCustomers(response.data.customers)
            setCurrentCustomers(response.data.customers)
            setloading(false)
          } else {
            console.log('====================')
            setloading(false)
          }
        },
      )
    } catch (e) {
      console.log(e)
    }
  }
  const onValueChange = (e) => {
    const { value } = e.target
    setAgent(value)
    if (value === 'alluser') {
      setCurrentCustomers()
      setCurrentCustomers(customers)
    } else {
      let customerId = customers.slice().filter((customer) => customer.userId === value)
      setActive(customerId)
      setCurrentCustomers(customerId)
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
            ) : customers === undefined || customers.length === 0 ? (
              // <div className=" table-responsive">
              <table className="table table-bordered" style={{ marginBottom: '0rem' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <p style={{ textAlign: 'center' }}>You do not have any customer record yet</p>
                      {/* <Link to="/dashboard/admin/create-product">Create product</Link> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <Customers
                customers={currentCustomers}
                numberOfPages={numberOfPages}
                setCurrentPage={setCurrentPage}
                setCurrentCustomers={setCurrentCustomers}
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
