import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { WalletContext } from '../../../pageContext'
import { CSpinner } from '@coreui/react'

import '../../style.css'
import Items from './Items'
import BASE_URL from 'src/base_url'

export default function Log() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const { sale, setSale } = useContext(WalletContext)

  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState()

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
    Axios.get(`${BASE_URL}/api/inventory/get-sales-by-user/?page=${currentPage}`, config).then(
      function (response) {
        if (response.data.success) {
          console.log(response.data.sale)
          setSale(response.data.sale)
          setNumberOfPages(response.data.numberOfPages)
          setloading(false)
        }
      },
    )
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
              <h3 className="card-title">History</h3>
              <Link className="create-btn" to="/user">
                <i className="fas fa-shopping-cart "></i> Add to cart
              </Link>
            </div>
          </div>
          <br />
          <br />

          <div style={{ padding: ' 1.25rem' }}>
            {loading ? (
              <center>
                <CSpinner color="dark" />
              </center>
            ) : sale === undefined || sale.length === 0 ? (
              <table className="table table-bordered" style={{ marginBottom: '0rem' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <p style={{ textAlign: 'center' }}>You Do not have any Transaction yet</p>
                      <Link to="/user">Add to cart</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <Items
                numberOfPages={numberOfPages}
                setCurrentPage={setCurrentPage}
                setNumberOfPages={setNumberOfPages}
                setSale={setSale}
                sale={sale}
              />
            )}
          </div>
        </div>
      </div>
      {/* /.col */}
    </div>
  )
}
