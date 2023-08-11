import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Swal from 'sweetalert'
import {
  CButton,
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CForm,
  CFormInput,
  CInputGroup,
  CSpinner,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHttps, cilHome, cilUser } from '@coreui/icons'
import '../../style.css'
import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import ModalForm from './ModalForm'

export default function Content() {
  const token = localStorage.getItem('token')
  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const { setUsers, users } = useContext(WalletContext)
  const [activeKey, setActiveKey] = useState(1)
  const [email, setEmail] = useState('')
  const [fullName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('')
  const [err, setErr] = useState('')
  const [visible, setVisible] = useState(false)
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
  }, [])
  const fetchData = async () => {
    setloading(true)
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
        setloading(false)
      }
    })
  }

  const submitUser = async (userInfo) => {
    const data = {
      fullName: userInfo.fullName.toLowerCase(),
      email: userInfo.email.toLowerCase(),
      shop: userInfo.shop.toLowerCase(),
      password: userInfo.password.toLowerCase(),
    }

    Axios.post(`${BASE_URL}/api/user/auth/register`, data, config)
      .then(function (response) {
        if (response.data.success) {
          Swal({
            title: 'Good job!',
            text: 'User created successfully',
            icon: 'success',
            button: 'Ok',
          })
          setUsers([...users, response.data.user])
          setLoading(false)
        }
        if (isLoading) {
          setTimeout(() => {
            setLoading(!isLoading)
          }, 1000)
        }
      })
      .catch(function (error) {
        if (error.response === undefined) {
          setLoading(false)
          return setErr('Could not connect to the server, check your network')
        } else if (error.response.data === undefined) {
          return setErr('Could not connect to the server, check your network')
        } else {
          Swal({
            title: 'Sorry!',
            text: error.response.data.msg,
            icon: 'error',
          })
        }
        setLoading(false)
      })

    if (isLoading) {
      setTimeout(() => {
        setLoading(!isLoading)
      }, 1000)
    }
  }
  const fetchSingleUser = async (id) => {
    console.log('just', id)
    Axios.get(`${BASE_URL}/api/user/auth/get-user/${id}`, config).then((response) => {
      if (response.data.success) {
        setUserName(response.data.msg.fullName)
        setEmail(response.data.msg.email)
        setId(response.data.msg._id)
      }
    })
  }
  const handleDelete = (id) => async () => {
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
          url: `${BASE_URL}/api/user/auth/delete-user/${id}`,
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
              Swal('Something went wrong!')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
  }
  const handleSubmit = async (event) => {
    console.log(event)
    event.preventDefault()
    setVisible(false)
    const data = { email, fullName, password }

    Axios({
      method: 'put',
      url: `${BASE_URL}/api/user/auth/update-user/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          if (response.data.password) {
            return Swal({
              title: 'Good job!',
              text: response.data.msg,
              icon: 'success',
              button: 'Ok',
            })
          } else {
            Swal({
              title: 'Good job!',
              text: 'You have successfully updated this user.',
              icon: 'success',
              button: 'Ok',
            })
          }
        }
        setInterval(() => {
          window.location.reload()
        }, 3000)
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: 'error' })
      })
  }
  if (isLoggedIn === null) {
    return <Navigate to="/" />
  }
  return (
    <div className="body-content center">
      <center>
        <div className="row">
          <div className="col-md-12">
            <CCard className="mx-6">
              {/* <CTabs> */}
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                    Create User
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                    Users
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent>
                <CTabPane visible={activeKey === 1}>
                  {err.length > 1 ? (
                    <div className={err.length > 1 ? 'login-message error ' : 'hide'}>{err}</div>
                  ) : (
                    ''
                  )}
                  <div className="col-sm-6 col-md-6">
                    <CCardBody className="p-4">
                      <Formik
                        initialValues={{
                          email: '',
                          fullName: '',
                          shop: '',
                          password: '',
                          confirmPassword: '',
                        }}
                        validationSchema={Yup.object().shape({
                          fullName: Yup.string().required('Full Name is required'),
                          shop: Yup.string().required('Shop Name is required'),

                          email: Yup.string()
                            .email('Email is invalid')
                            .required('Email is required'),

                          password: Yup.string()
                            .min(6, 'Password must be at least 6 characters')
                            .required('Password is required'),
                          confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Passwords must match')
                            .required('Confirm Password is required'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                          setLoading(true)
                          setTimeout(() => {
                            let dataToSubmit = {
                              email: values.email,
                              password: values.password,
                              fullName: values.fullName,
                              shop: values.shop,
                            }
                            console.log(dataToSubmit)
                            submitUser(dataToSubmit)
                          }, 3000)
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          handleReset,
                          /* and other goodies */
                        }) => (
                          <CForm onSubmit={handleSubmit}>
                            <h1 className="form-title">Create user account</h1>

                            <CInputGroup className="mt-3">
                              {/* <CInputGroupPrepend> */}
                              <CInputGroupText>
                                <CIcon icon={cilUser} />
                                {/* <CIcon icon={cilList} /> */}
                              </CInputGroupText>
                              {/* </CInputGroupPrepend> */}
                              <CFormInput
                                type="text"
                                placeholder="Full Name"
                                autoComplete="fullName"
                                name="fullName"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onReset={handleReset}
                                className={
                                  errors.fullName && touched.fullName
                                    ? 'form-control error'
                                    : 'form-control'
                                }
                              />
                            </CInputGroup>
                            {errors.fullName && touched.fullName && (
                              <div
                                className="input-feedback "
                                style={{ color: 'red', display: 'flex' }}
                              >
                                {errors.fullName}
                              </div>
                            )}
                            <CInputGroup className="mt-3">
                              {/* <CInputGroupPrepend> */}
                              <CInputGroupText>
                                {/* <CIcon icon={cilList} /> */}
                                <CIcon icon={cilHome} />
                              </CInputGroupText>
                              {/* </CInputGroupPrepend> */}
                              <CFormInput
                                type="text"
                                placeholder="Shop Name"
                                autoComplete="shop"
                                name="shop"
                                value={values.shop}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onReset={handleReset}
                                className={
                                  errors.shop && touched.shop
                                    ? 'form-control error'
                                    : 'form-control'
                                }
                              />
                            </CInputGroup>
                            {errors.shop && touched.shop && (
                              <div
                                className="input-feedback"
                                style={{ color: 'red', display: 'flex' }}
                              >
                                {errors.shop}
                              </div>
                            )}
                            <CInputGroup className="mt-3">
                              {/* <CInputGroupPrepend> */}
                              <CInputGroupText>@</CInputGroupText>
                              {/* </CInputGroupPrepend> */}
                              <CFormInput
                                type="text"
                                placeholder="Email"
                                autoComplete="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onReset={handleReset}
                                className={
                                  errors.email && touched.email
                                    ? 'form-control error'
                                    : 'form-control'
                                }
                              />
                            </CInputGroup>
                            {errors.email && touched.email && (
                              <div
                                className="input-feedback"
                                style={{ color: 'red', display: 'flex' }}
                              >
                                {errors.email}
                              </div>
                            )}
                            <CInputGroup className="mt-3">
                              {/* <CInputGroupPrepend> */}
                              <CInputGroupText>
                                {/* <CIcon icon={cilList} /> */}
                                <CIcon icon={cilHttps} />
                              </CInputGroupText>
                              {/* </CInputGroupPrepend> */}
                              <CFormInput
                                type="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onReset={handleReset}
                                className={
                                  errors.password && touched.password
                                    ? 'form-control error'
                                    : 'form-control'
                                }
                              />
                            </CInputGroup>
                            {errors.password && touched.password && (
                              <div
                                className="input-feedback"
                                style={{ color: 'red', display: 'flex' }}
                              >
                                {errors.password}
                              </div>
                            )}
                            <CInputGroup className="mt-4">
                              {/* <CInputGroupPrepend> */}
                              <CInputGroupText>
                                <CIcon icon={cilHttps} />
                              </CInputGroupText>
                              {/* </CInputGroupPrepend> */}
                              <CFormInput
                                type="password"
                                placeholder="Repeat password"
                                autoComplete="new-password"
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onReset={handleReset}
                                className={
                                  errors.confirmPassword && touched.confirmPassword
                                    ? 'form-control error'
                                    : 'form-control'
                                }
                              />
                            </CInputGroup>
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div
                                className="input-feedback"
                                style={{ color: 'red', display: 'flex' }}
                              >
                                {errors.confirmPassword}
                              </div>
                            )}
                            <CButton
                              className="mt-4"
                              style={{
                                background: 'rgb(60, 75, 100)',
                                letterSpacing: '1px',
                                fontSize: '16px',
                                color: '#fff',
                              }}
                              type="submit"
                              block="true"
                            >
                              {isLoading ? 'Creating' : 'Create Account'}
                            </CButton>
                          </CForm>
                        )}
                      </Formik>
                    </CCardBody>
                  </div>
                </CTabPane>

                <CTabPane visible={activeKey === 2}>
                  {loading ? (
                    <center>
                      <CSpinner color="dark" />
                    </center>
                  ) : (
                    (users.reverse(),
                    users.length === 0 ? (
                      <div className="col-sm-8 col-md-8">
                        {' '}
                        <div>You do not have any user yet.</div>
                      </div>
                    ) : (
                      <div className="col-sm-8 col-md-8">
                        {users.map((user, index) => {
                          return (
                            <div key={index}>
                              <div className="work-progress">
                                <span>User Name</span>
                                <span style={{ textTransform: 'capitalize' }}>{user.fullName}</span>
                              </div>
                              <div className="work-progress">
                                <span>Shop Name</span>
                                <span style={{ textTransform: 'capitalize' }}>
                                  {user.shop ? user.shop : 'No shop assigned'}
                                </span>
                              </div>
                              <div className="work-progress">
                                <span>Email Address</span>
                                <Link to="..">{user.email}</Link>
                              </div>
                              <div
                                style={{
                                  textAlign: 'right',
                                  paddingRight: '1rem',
                                }}
                              >
                                <span
                                  style={{ padding: '4px 15px' }}
                                  rel="tooltip"
                                  title="edit item"
                                  onClick={() => {
                                    fetchSingleUser(user._id)
                                    setVisible(!visible)
                                  }}
                                  className="edit-btn"
                                >
                                  Edit
                                </span>
                                <span
                                  style={{ padding: '4px 12px' }}
                                  rel="tooltip"
                                  title="delete item"
                                  className="del-btn"
                                  onClick={handleDelete(user._id)}
                                >
                                  Delete
                                </span>
                              </div>
                              <hr />
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}
                </CTabPane>
              </CTabContent>
              {/* </CTabs> */}
              <CModal visible={visible} onClose={() => setVisible()}>
                <CModalHeader closeButton>
                  <CModalTitle>Edit User</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <ModalForm
                    username={fullName}
                    email={email}
                    setUserName={setUserName}
                    setEmail={setEmail}
                    setPassword={setPassword}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary" onClick={handleSubmit}>
                    Edit
                  </CButton>{' '}
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCard>
          </div>
        </div>
      </center>
    </div>
  )
}
