import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import '../../style.css'
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
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import BASE_URL from 'src/base_url'

const Login = () => {
  const navigate = useNavigate()

  const [err, setError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const resettoken = navigate.location.pathname.split('/')[2]

  const submitUser = async (userInfo) => {
    const data = {
      email: userInfo.email,
      password: userInfo.password,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    }

    axios
      .put(`${BASE_URL}/api/user/auth/reset-password/${resettoken}`, data, config)
      .then(function (response) {
        if (response.data.success) {
          return navigate('/')
        }
        if (isLoading) {
          setTimeout(() => {
            setLoading(!isLoading)
          }, 2000)
        }
      })
      .catch(function (error) {
        if (error.response === undefined) {
          setLoading(false)
          return setError('Could not connect to the server, check your network')
        } else {
          setError(error.response.data.msg)
        }
        setLoading(false)
      })
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center mt-4">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                {err.length > 1 ? (
                  <div className={err.length > 1 ? 'login-message error ' : 'hide'}>{err}</div>
                ) : (
                  ''
                )}
                <CCardBody>
                  <Formik
                    initialValues={{
                      password: '',
                      confirmPassword: '',
                    }}
                    validationSchema={Yup.object().shape({
                      password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                      confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required'),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let dataToSubmit = {
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
                        {/* <h1>Login</h1> */}
                        <p className="text-muted">Change Your password</p>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>

                          <CFormInput
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            id="password"
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
                          {errors.password && touched.password && (
                            <div className="input-feedback" style={{ color: 'red' }}>
                              {errors.password}
                            </div>
                          )}
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>

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
                          {errors.confirmPassword && touched.confirmPassword && (
                            <div className="input-feedback" style={{ color: 'red' }}>
                              {errors.confirmPassword}
                            </div>
                          )}
                        </CInputGroup>
                        <CRow>
                          <CCol xs="6">
                            <CButton
                              color="primary"
                              className="px-4"
                              type="submit"
                              onClick={() => setLoading(!isLoading)}
                            >
                              {isLoading ? 'Submiting' : 'Submit'}
                            </CButton>
                            <br />
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: '44%' }}
              ></CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
