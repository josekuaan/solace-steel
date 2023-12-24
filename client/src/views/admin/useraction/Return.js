import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'

import Swal from 'sweetalert'
import '../../style.css'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CSpinner } from '@coreui/react'
import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import ReturnItem from './ReturnItem'

export default function Credit() {
  const navigate = useNavigate()
  const { categories, setCategory, setUsers, users, Returned, setReturn } =
    useContext(WalletContext)
  const token = localStorage.getItem('token')

  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const [activeKey, setActiveKey] = useState(1)
  const [prize, setPrize] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('')
  const [category, setCat] = useState('')
  const [shop, setShop] = useState('')
  const [sub_categories, setSubCategory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState()
  const [loading, setloading] = useState(false)
  const [isLoading, setLoading] = useState(false)
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
  }, [currentPage])
  const fetchData = async () => {
    setloading(true)
    Axios.get(`${BASE_URL}/api/inventory/get-categories`, config).then((response) => {
      if (response.data.success) {
        setCategory(response.data.categories)
      }
    })
    Axios.get(`${BASE_URL}/api/inventory/get-returns?page=${currentPage}`, config).then(
      (response) => {
        if (response.data.success) {
          setReturn(response.data.returns)
          console.log(response.data.returns)
          setNumberOfPages(response.data.numberOfPages)
          setloading(false)
        }
      },
    )
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then((response) => {
      if (response.data.success) {
        setUsers(response.data.msg)
      }
    })
  }
  const onValueChange = (e) => {
    const { value } = e.target
    const data = { category: value }

    setCat(value.toLowerCase())

    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/get-sub-category`,
      data,
      headers: config.headers,
    }).then(function (response) {
      if (response.data.success) {
        setSubCategory(response.data.sub_categories)
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const data = { category, qty, type, prize, shop }

    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/return-inventory`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setLoading(false)
          setReturn(response.data.inventory)
          Swal({
            title: 'Good job!',
            text: 'This item has been returned.',
            icon: 'success',
            button: <But />,
          })
          setInterval(() => {
            window.location.reload()
          }, 3000)
        }
      })
      .catch((e) => {
        console.log(e)
        console.log(e.code)
        if (e.code == 'ERR_BAD_REQUEST') {
          return Swal({ text: 'Could Not Connect to Server or Server is down', icon: 'error' })
        }
        setLoading(false)

        Swal({ text: e.response.msg, icon: 'error' })
      })
  }
  if (isLoggedIn === null) {
    return navigate('/')
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            {/* <CTabs> */}

            <CNav variant="tabs">
              <CNavItem>
                <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                  {' '}
                  Return Item
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                  Display
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane className="p-3 preview" visible={activeKey === 1}>
                <div className="card-content">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="row" style={{ padding: '40px 0' }}>
                        <div className="col-sm-6">
                          <div style={{ marginBottom: '10px' }}>Category</div>
                          <div className="">
                            <select className="form-control" required onChange={onValueChange}>
                              <option value="">Please select</option>
                              {categories.map((cate, index) => {
                                return (
                                  <option key={index} value={cate.category}>
                                    {cate.category}
                                  </option>
                                )
                              })}
                            </select>
                            <span className="input-group-addon"></span>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div style={{ marginBottom: '10px' }}>Type</div>
                          <div className="">
                            <select
                              className="form-control"
                              required
                              onChange={(e) => setType(e.target.value.toLowerCase())}
                            >
                              <option value="">Please select</option>
                              {sub_categories.map((category, index) => {
                                return category.type.map((item, index) => {
                                  return (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  )
                                })
                              })}
                            </select>
                            <span className="input-group-addon"></span>
                          </div>
                        </div>

                        {/* <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Price </div>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="price"
                              onChange={(e) => setPrize(e.target.value)}
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div> */}
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div style={{ marginBottom: '10px' }}>Shop</div>
                          <div className="">
                            <select
                              className="form-control"
                              required
                              onChange={(e) => setShop(e.target.value)}
                            >
                              <option value="">Please select</option>
                              {users.map((user, index) => {
                                return (
                                  <option key={index} value={user.shop}>
                                    {user.shop}
                                  </option>
                                )
                              })}
                            </select>

                            <span className="input-group-addon"></span>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div style={{ marginBottom: '10px' }}>Quantity</div>
                          <div className="">
                            <input
                              type="number"
                              step="any"
                              className="form-control"
                              placeholder="quantity"
                              onChange={(e) => setQty(e.target.value)}
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                      </div>
                    </div>

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
                        value={isLoading ? 'Returning Item' : 'Return Item'}
                      />
                    </div>
                  </form>
                </div>
              </CTabPane>
              <CTabPane visible={activeKey === 2}>
                {loading ? (
                  <center>
                    <CSpinner color="dark" />
                  </center>
                ) : Returned === undefined || Returned.length === 0 ? (
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
                  <ReturnItem
                    returned={Returned}
                    setReturn={setReturn}
                    numberOfPages={numberOfPages}
                    setCurrentPage={setCurrentPage}
                    setNumberOfPages={setNumberOfPages}
                  />
                )}
              </CTabPane>
            </CTabContent>
            {/* </CTabs> */}
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  )
}

function But() {
  ;<Link onClick={() => window.location.reload()}>OK</Link>
}
