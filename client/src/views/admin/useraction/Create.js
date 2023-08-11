import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react'
import Swal from 'sweetalert'
import '../../style.css'
import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import Modal from './modal'

export default function Credit() {
  const navigate = useNavigate()
  const { categories, users, setCategory, setUsers } = useContext(WalletContext)
  const token = localStorage.getItem('token')

  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const [activeKey, setActiveKey] = useState(1)
  const [prize, setPrize] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('')
  const [category, setCat] = useState('')
  const [otherLevel, setOtherlevel] = useState('')
  const [shop, setShop] = useState('')
  const [catId, setCatId] = useState('')
  const [correction, setCorrection] = useState('')
  const [sub_categories, setSubCategory] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

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
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
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
          Swal({
            title: 'Good job!',
            text: 'You have successfully created this product.',
            icon: 'success',
            button: <But />,
          })
        } else {
        }
      })
      .catch((e) => {
        setLoading(false)
        Swal({ text: e.response.data.msg, icon: 'error' })
      })
  }
  const handleEditCategory = async () => {
    setLoading(true)
    let data = { category, correction }
    Axios({
      method: 'put',
      url: `${BASE_URL}/api/inventory/update-category/${catId}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setLoading(false)
          Swal({
            title: 'Good job!',
            text: 'Successfully edited this category.',
            icon: 'success',
            button: <But />,
          })
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        Swal({ text: error.response.data.msg, icon: 'failed' })
      })
  }
  const handleEditType = async (event) => {
    event.preventDefault()
    setLoading(true)
    Axios({
      method: 'put',
      url: `${BASE_URL}/api/inventory/update-category-type?category=${category}&&type=${type}&&correction=${correction}`,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          Swal({
            title: 'Good job!',
            text: 'Successfully edited this accessories type.',
            icon: 'success',
            button: <But />,
          })

          setInterval(() => {
            window.location.reload()
          }, 3000)
        } else {
          setLoading(false)
          Swal({ text: response.data.msg, icon: 'failed' })
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        Swal({ text: error.response.data.msg, icon: 'failed' })
      })
  }
  const handleDeleteCategory = async () => {
    Swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Axios({
          method: 'delete',
          url: `${BASE_URL}/api/inventory/delete-category/${catId}`,
          headers: config.headers,
        })
          .then((response) => {
            if (response.data.success) {
              Swal(' Your record has been deleted!', {
                icon: 'success',
              })
              window.location.reload()
            } else {
              setLoading(false)
              Swal('Something went wrong!')
            }
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)
            Swal({ text: error.response.data.msg, icon: 'failed' })
          })
      }
    })
  }
  const handleDeleteCategoryType = async () => {
    setLoading(true)
    Swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Axios({
          method: 'delete',
          url: `${BASE_URL}/api/inventory/delete-category-type?category=${category}&&type=${type}`,
          headers: config.headers,
        })
          .then((response) => {
            if (response.data.success) {
              Swal(' Your record has been deleted!', {
                icon: 'success',
              })
              setInterval(() => {
                window.location.reload()
              }, 3000)
            } else {
              setLoading(false)
              Swal('Something went wrong!')
            }
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)
            Swal({ text: error.response.data.msg, icon: 'failed' })
          })
      }
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
                  Inventory
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                  Category
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>
                  Type
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane visible={activeKey === 1}>
                <div className="card-header">
                  <div className="card-head-content">
                    <h3 className="card-title">History</h3>

                    <span className="create-btn" onClick={() => setVisible(!visible)}>
                      Add Category
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="row" style={{ padding: '40px 0' }}>
                        {/* <div style={{marginBottom:"10px"}}>Front View</div> */}
                        <div className="col-sm-4">
                          <div style={{ marginBottom: '10px' }}>Category</div>
                          <div className="input-group">
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
                          <div className="input-group">
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
                          <div className="input-group">
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
                          <div className="input-group">
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
                          <div className="input-group">
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
                          <div className="input-group">
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
                <div className="card-content">
                  <form className="form-horizontal">
                    <div className="form-group">
                      <center
                        // className="center"
                        style={{
                          padding: '40px 0',
                          justifyContent: 'right',
                        }}
                      >
                        {/* <div style={{marginBottom:"10px"}}>Front View</div> */}
                        <div className="col-sm-6">
                          <div style={{ marginTop: '10px', display: 'flex' }}>Category</div>
                          <div className="input-group">
                            <select className="form-control" required onChange={onValueChange}>
                              <option value="">Please select</option>
                              {categories.map((cate, index) => {
                                return (
                                  <option key={index} value={`${cate.category}/${cate._id}`}>
                                    {cate.category}
                                  </option>
                                )
                              })}
                            </select>
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div style={{ marginTop: '10px', display: 'flex' }}>Correction:</div>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              onChange={(e) => setCorrection(e.target.value.toLowerCase())}
                              placeholder="category"
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                      </center>
                    </div>

                    <div className="__edit-btn-container">
                      <span
                        onClick={handleEditCategory}
                        className={`update fill `}
                        style={{
                          borderRadius: 2,
                          border: 'none',
                          color: '#fff',

                          cursor: 'pointer',
                        }}
                      >
                        {isLoading ? 'Updating...' : 'Update'}
                      </span>

                      <span
                        onClick={handleDeleteCategory}
                        className={`update fill`}
                        style={{
                          borderRadius: 2,
                          border: 'none',
                          backgroundColor: 'red',
                          color: '#fff',

                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  </form>
                </div>
              </CTabPane>
              <CTabPane visible={activeKey === 3}>
                <div className="card-content">
                  <form className="form-horizontal">
                    <div className="form-group">
                      <center
                        // className="row"
                        style={{
                          padding: '40px 0',
                          justifyContent: 'center',
                        }}
                      >
                        {/* <div style={{marginBottom:"10px"}}>Front View</div> */}
                        <div className="col-sm-6">
                          <div style={{ marginTop: '10px', display: 'flex' }}>Category</div>
                          <div className="input-group">
                            <select className="form-control" required onChange={onValueChange}>
                              <option value="">Please select</option>
                              {categories.map((cate, index) => {
                                return (
                                  <option key={index} value={`${cate.category}/${cate._id}`}>
                                    {cate.category}
                                  </option>
                                )
                              })}
                            </select>
                            <span className="input-group-addon"></span>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div style={{ marginTop: '10px', display: 'flex' }}>Type</div>
                          <div className="input-group">
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
                        <div className="col-sm-6">
                          <span style={{ marginTop: '10px', display: 'flex' }}>Correction:</span>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              onChange={(e) => setCorrection(e.target.value.toLowerCase())}
                              placeholder="type"
                              required
                            />
                            <span className="input-group-addon"></span>
                          </div>
                        </div>
                      </center>
                    </div>

                    <div className="__edit-btn-container">
                      <span
                        onClick={handleEditType}
                        className={`update fill `}
                        style={{
                          borderRadius: 2,
                          border: 'none',
                          color: '#fff',

                          cursor: 'pointer',
                        }}
                      >
                        {isLoading ? 'Updating...' : 'Update'}
                      </span>

                      <span
                        onClick={handleDeleteCategoryType}
                        className={`update fill `}
                        style={{
                          borderRadius: 2,
                          border: 'none',
                          backgroundColor: 'red',
                          color: '#fff',

                          cursor: 'pointer',
                        }}
                      >
                        {isLoading ? 'Deleting' : 'Delete'}
                      </span>
                    </div>
                  </form>
                </div>
              </CTabPane>
            </CTabContent>
            {/* </CTabs> */}
            <Modal modal={visible} setModal={setVisible} setCategory={setCategory} />

            {/* end card */}
          </div>
        </div>
      </div>
    </div>
  )
}

function But() {
  ;<Link onClick={() => window.location.reload()}>OK</Link>
}
