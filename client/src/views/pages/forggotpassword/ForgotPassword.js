import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import isLoggedIn from '../../../helper'
import '../../style.css'

import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import BASE_URL from 'src/base_url'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [err, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setLoading] = useState(false)

  const submitUser = async (userInfo) => {
    const data = {
      email: userInfo.email,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    }
    console.log(data)
    axios
      .post(`${BASE_URL}/api/user/auth/forgot-password`, data, config)
      .then(function (response) {
        if (response.data.success) {
          setMessage(response.data.success)
        }
      })
      .catch(function (error) {
        console.log(error)
        setError(error.response.data.data)
      })
  }

  if (isLoggedIn) {
    return navigate('/')
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center mt-4">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                {err.length > 1 ? (
                  <div className={err.length > 1 ? 'login-message error' : 'hide'}>{err}</div>
                ) : (
                  ''
                )}
                {message ? (
                  <div className={message ? ' success message' : 'hide'}>
                    Your request to change your password was granted, Kindly check your email and
                    fellow the link sent to your email.
                  </div>
                ) : (
                  ''
                )}

                <CCardBody>
                  <Formik
                    initialValues={{
                      email: '',
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email('Email is invalid').required('Email is required'),
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
                        <p className="text-muted">Enter your email</p>
                        <CInputGroup className="mb-3">
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

                          {errors.email && touched.email && (
                            <div className="input-feedback" style={{ color: 'red' }}>
                              <br />
                              {errors.email}
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
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
