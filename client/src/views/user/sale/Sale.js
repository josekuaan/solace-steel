import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Axios from 'axios'
import Swal from 'sweetalert'
import '../../style.css'

import { WalletContext } from '../../../pageContext'

import BASE_URL from 'src/base_url'

const Sale = () => {
  const navigate = useNavigate()
  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const { categories, setCategory } = useContext(WalletContext)
  const [prize, setPrize] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('')
  const [payment, setPament] = useState('')
  const [detail, setDetails] = useState('')

  const [category, setCat] = useState('')

  const [setErr] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [sub_categories, setSubCategory] = useState([])

  const token = localStorage.getItem('token')

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
    Axios.get(`${BASE_URL}/api/inventory/get-categories`, config).then((response) => {
      if (response.data.success) {
        setCategory(response.data.categories)
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = { category, qty, type, prize, payment, detail }

    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/checkout`,
      data,
      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          Swal({
            title: 'Good job!',
            text: 'Congrats! Your sales was successful.',
            icon: 'success',
            button: 'Ok',
          })
          navigate('/user/log')
        } else {
          setErr(response.data.msg)
          setTimeout(() => {
            setErr('')
            setLoading(false)
          }, 6000)
        }
      })
      .catch((e) => {
        console.log(e.response)
        Swal({
          title: 'Sorry!',
          text: e.response.data.msg,
          icon: 'error',
        })
        setLoading(false)
      })
    if (isLoading) {
      setTimeout(() => {
        setLoading(!isLoading)
      }, 1000)
    }
  }
  if (isLoggedIn === null) {
    return navigate('/')
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p>Make A Sale</p>
                </div>
              </div>

              <div className="card-content">
                <form className="form-horizontal">
                  <div className="form-group">
                    <div className="row" style={{ padding: '40px 0' }}>
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
                            className="form-control"
                            onChange={(e) => setQty(e.target.value)}
                            placeholder="56"
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
                            className="form-control"
                            onChange={(e) => setPrize(e.target.value)}
                            placeholder="10$"
                            required
                          />
                          <span className="input-group-addon"></span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div style={{ marginBottom: '10px' }}>Payment Type</div>
                        <div className="input-group">
                          <select
                            className="form-control"
                            required
                            onChange={(e) => setPament(e.target.value)}
                          >
                            <option value="">Please select</option>
                            <option value="cash">Cash</option>
                            <option value="transfer">Transfer</option>
                            <option value="credit">Credit</option>
                          </select>
                          <span className="input-group-addon"></span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div style={{ marginBottom: '10px' }}>Remzrks </div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="remarks"
                          />
                          <span className="input-group-addon"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="__edit-btn-container">
                    <span
                      onClick={handleSubmit}
                      className={`update fill `}
                      style={{
                        borderRadius: 2,
                        border: 'none',
                        color: '#fff',

                        cursor: 'pointer',
                      }}
                    >
                      {isLoading ? 'Selling...' : 'Check out'}
                    </span>
                  </div>
                </form>
              </div>
            </div>{' '}
            {/* end card */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sale
