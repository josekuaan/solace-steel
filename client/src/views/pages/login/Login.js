import React, { useContext, useState } from 'react'
import { Formik } from 'formik'

import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import '../../style.css'

import { WalletContext } from '../../../pageContext'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
} from '@coreui/react'
import BASE_URL from 'src/base_url'
import Axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(WalletContext)
  const rememberMeChecked = localStorage.getItem('rememberMe') ? true : false
  const [rememberMe] = useState(rememberMeChecked)
  const [err, setError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [buttonAction, setButton] = useState(false)

  const submitUser = async (userInfo) => {
    const data = {
      email: userInfo.email.toLowerCase(),
      password: userInfo.password.toLowerCase(),
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    }
    const header = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

    Axios.post(`${BASE_URL}/api/user/auth/login`, data, config)
      .then(function (response) {
        if (response.data.success) {
          setCurrentUser([response.data.user])
          window.localStorage.setItem('userId', response.data.user._id)
          window.localStorage.setItem('loggedIn', true)
          window.localStorage.setItem('token', response.data.token)

          setButton(true)

          if (response.data.user.role === 'admin') {
            return navigate('/admin')
          } else if (response.data.user.role === 'user') {
            return navigate('/user')
          }
        } else if (!response.data.success) {
          console.log(response.data)
          setError(response.data.msg)
        } else if (rememberMe === true) {
          window.localStorage.setItem('rememberMe', response.data.user._id)
        } else {
          localStorage.removeItem('rememberMe')
        }
        // 3894
        if (isLoading) {
          setTimeout(() => {
            setLoading(!isLoading)
          }, 1000)
        }
      })
      .catch(function (error) {
        console.log(error)
        if (error.response === undefined) {
          setLoading(false)
          return setError('Could not connect to the server, check your network')
        } else {
          setError(error.response.data.msg)
        }
        setLoading(false)
      })
  }

  // if (isLoggedIn) {
  //   return <Redirect to="" />;
  // }

  return (
    <div className="c-app c-default-layout flex-row align-items-center mt-4">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Email is invalid').required('Email is required'),
                password: Yup.string()
                  .min(6, 'Password must be at least 6 characters')
                  .required('Password is required'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  let dataToSubmit = {
                    email: values.email,
                    password: values.password,
                  }
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
                  {err === undefined ? (
                    <div className={err > 1 ? 'login-message error ' : 'hide'}>{err}</div>
                  ) : err.length > 1 ? (
                    <div className={err.length > 1 ? 'login-message error ' : 'hide'}>{err}</div>
                  ) : (
                    ''
                  )}
                  <p className="text-muted text-center" style={{ fontSize: '20px', lineHeight: 3 }}>
                    Sign In to your account
                  </p>
                  <CInputGroup className="mt-3">
                    {/* <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText> */}

                    <CFormInput
                      type="email"
                      placeholder="email"
                      autoComplete="email"
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onReset={handleReset}
                      className={
                        errors.email && touched.email ? 'form-control error' : 'form-control'
                      }
                    />
                  </CInputGroup>
                  {errors.email && touched.email && (
                    <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                      {errors.email}
                    </div>
                  )}
                  <CInputGroup className="mt-4">
                    {/* <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText> */}

                    <CFormInput
                      type={values.showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="current-password"
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onReset={handleReset}
                      className="form-control rounded-0"
                    />
                  </CInputGroup>
                  {errors.password && touched.password && (
                    <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                      {errors.password}
                    </div>
                  )}
                  <CRow>
                    <CCol xs="12">
                      <CButton
                        color="primary"
                        className="px-4, mt-4"
                        type="submit"
                        style={{
                          width: '100% ',
                          fontSize: '18px ',
                          letterSpacing: '1px',
                        }}
                        onClick={() => setLoading(!isLoading)}
                        disabled={buttonAction}
                      >
                        {isLoading ? 'Loading' : 'Login'}
                      </CButton>
                      <br />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to="/forgot-password" className="px-0">
                          Forgot password?
                        </Link>
                        <Link to="/register" className="px-0">
                          Create account?
                        </Link>
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              )}
            </Formik>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
