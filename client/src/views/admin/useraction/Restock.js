import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CSpinner } from '@coreui/react'
import Swal from 'sweetalert'
// import { CSpinner } from '@coreui/react'
import '../../style.css'
import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import RestockItem from './RestockItem'

export default function Credit() {
  const navigate = useNavigate()
  const { users, setUsers } = useContext(WalletContext)
  const token = localStorage.getItem('token')

  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const [activeKey, setActiveKey] = useState(1)
  const [prize, setPrize] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('')
  const [category, setCat] = useState('')
  const [otherLevel, setOtherlevel] = useState('')
  const [shop, setShop] = useState('')
  const [id, setCatId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState()

  const [restock, setRestock] = useState([])
  const [sub_categories, setSubCategory] = useState([])
  const [categories, setCategory] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [loading, setloading] = useState(false)

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
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
      }
    })
    Axios.get(`${BASE_URL}/api/inventory/get-restock?page=${currentPage}`, config).then(function (
      response,
    ) {
      if (response.data.success) {
        setRestock(response.data.restock)
        console.log(response.data.restock)
        setNumberOfPages(response.data.numberOfPages)
        setloading(false)
      }
    })
    Axios.get(`${BASE_URL}/api/inventory/get-categories`, config).then((response) => {
      if (response.data.success) {
        setCategory(response.data.categories)
      }
    })
  }
  const onValueChange = (e) => {
    const { value } = e.target

    const data = { category: value.split('/')[0] }

    setCatId(value.split('/')[1])
    setCat(value.split('/')[0].toLowerCase())

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

    const data = { category, qty, type, prize, shop, otherLevel }

    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/create-inventory`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setLoading(false)
          setRestock(response.data.restock)
          Swal({
            title: 'Good job!',
            text: 'You have successfully restocked this product.',
            icon: 'success',
            button: <But />,
          })
          setInterval(() => {
            window.location.reload()
          }, 3000)
        } else {
        }
      })
      .catch((e) => {
        setLoading(false)
        Swal({ text: e.response.data.msg, icon: 'error' })
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
                  Restock
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                  Restock Items
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane visible={activeKey === 1}>
                <div className="card-header">
                  <div className="card-head-content">
                    <h3 className="card-title">Re-Stock</h3>
                  </div>
                </div>
                <div className="card-content">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="row" style={{ padding: '40px 0' }}>
                        {/* <div style={{marginBottom:"10px"}}>Front View</div> */}
                        <div className="col-sm-4">
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

                        <div className="col-sm-4">
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
                        <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Quantity</div>
                          <div className="">
                            <input
                              type="number"
                              step="any"
                              placeholder="quantity"
                              className="form-control"
                              onChange={(e) => setQty(e.target.value)}
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Prize </div>
                          <div className="">
                            <input
                              type="number"
                              placeholder="price"
                              className="form-control"
                              onChange={(e) => setPrize(e.target.value)}
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Shop </div>
                          <div className="">
                            <select
                              type="text"
                              className="form-control"
                              onChange={(e) => setShop(e.target.value.toLowerCase())}
                              required
                            >
                              <option>select shop</option>

                              {users.map((user, index) => {
                                return (
                                  <option value={user.shop} key={index}>
                                    {user.shop}
                                  </option>
                                )
                              })}
                            </select>
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Re-order Limit</div>
                          <div className="">
                            <input
                              type="number"
                              placeholder="re-order"
                              className="form-control"
                              onChange={(e) => setOtherlevel(e.target.value)}
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
                        value={isLoading ? 'Creating...' : 'Create'}
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
                ) : restock === undefined || restock.length === 0 ? (
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
                  <RestockItem
                    restock={restock}
                    setRestock={setRestock}
                    numberOfPages={numberOfPages}
                    setCurrentPage={setCurrentPage}
                    setNumberOfPages={setNumberOfPages}
                  />
                )}
              </CTabPane>
            </CTabContent>
            {/* </CTabs> */}
          </div>
        </div>
      </div>
    </div>
  )
}

function But() {
  ;<Link onClick={() => window.location.reload()}>OK</Link>
}
