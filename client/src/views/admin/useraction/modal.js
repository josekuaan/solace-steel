/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import Swal from 'sweetalert'
import { Link } from 'react-router-dom'
import BASE_URL from 'src/base_url'
import { WalletContext } from '../../../pageContext'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

export default function Modal({ modal, setModal }) {
  const { categories, setCategory } = useContext(WalletContext)

  const [type, setSubCategory] = useState('')

  const [category, setCate] = useState('')
  const token = localStorage.getItem('token')
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
  }, [])
  const fetchData = async () => {
    Axios.get(`${BASE_URL}/api/inventory/get-categories`, config).then((response) => {
      if (response.data.success) {
        setCategory(response.data.categories)
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setModal(false)

    const data = { category, type }
    console.log(data)
    return

    Axios({
      method: 'post',
      url: `${BASE_URL}/api/inventory/create-category`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setCategory([...categories, response.data.category])
          Swal({
            title: 'Good job!',
            text: 'Category,sub-category set.',
            icon: 'success',
            button: <But />,
          })
        }
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: 'error' })
      })
  }
  return (
    <div>
      <CModal visible={modal} onClose={() => setModal()}>
        <CModalHeader closeButton>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col-sm-12">
              Category:
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setCate(e.target.value.toLowerCase().trim())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              Sub Category:
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  required
                  onChange={(e) => setSubCategory(e.target.value.toLowerCase().trim())}
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSubmit}>
            Add
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

function But() {
  ;<Link onClick={() => window.location.reload()}>OK</Link>
}
