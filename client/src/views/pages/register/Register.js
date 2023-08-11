import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import BASE_URL from 'src/base_url'

const Register = () => {
  const navigate = useNavigate()

  const [err, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  const submitUser = (userInfo) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    }
    const data = {
      fullName: userInfo.fullName,
      email: userInfo.email,
      shop: userInfo.shop,
      password: userInfo.password,
    }

    Axios.post(`${BASE_URL}/api/user/auth/register`, data, config)
      .then(function (response) {
        if (response.data.success) {
          return navigate('/')
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
          return setError('Could not connect to the server, check your network')
        } else {
          setError(error.response.data.msg)
        }
        setLoading(false)
      })
    if (isLoading) {
      setTimeout(() => {
        setLoading(!isLoading)
      }, 1000)
    }
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center mt-4">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              {err.length > 1 ? (
                <div className={err.length > 1 ? 'login-message error ' : 'hide'}>{err}</div>
              ) : (
                ''
              )}
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
                    shop: Yup.string().required('Shop is required'),

                    email: Yup.string().email('Email is invalid').required('Email is required'),

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
                      <h1>Register</h1>
                      <p className="text-muted">Create your account</p>
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>

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
                        <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                          {errors.fullName}
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>@</CInputGroupText>

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
                            errors.email && touched.email ? 'form-control error' : 'form-control'
                          }
                        />
                      </CInputGroup>
                      {errors.email && touched.email && (
                        <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                          {errors.email}
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>

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
                        <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                          {errors.password}
                        </div>
                      )}
                      <CInputGroup className="mt-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
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
                      </CInputGroup>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="input-feedback" style={{ color: 'red', display: 'flex' }}>
                          {errors.confirmPassword}
                        </div>
                      )}
                      <CButton
                        className="mt-4"
                        color="primary"
                        type="submit"
                        block
                        onClick={() => setLoading(!isLoading)}
                      >
                        {isLoading ? 'Creating' : 'Create Account'}
                      </CButton>
                    </CForm>
                  )}
                </Formik>
              </CCardBody>
              <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    Already have an account?<Link to="/">login</Link>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
