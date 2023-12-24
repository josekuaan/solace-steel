/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import * as moment from 'moment'
import Axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import MUIDataTable from 'mui-datatables'
import { cilTrash, cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import BASE_URL from 'src/base_url'
import CustomeFooter from 'src/views/widgets/CustomeFooter'
function useQuery() {
  return new URLSearchParams(useLocation().search)
}
const formatter = new Intl.NumberFormat({
  style: 'currency',
  currency: 'NGN',
})
export default function Items({ restock, numberOfPages, setNumberOfPages, setRestock }) {
  const token = localStorage.getItem('token')
  const query = useQuery()
  const currentPage = query.get('page') || 1
  const [qty, setQty] = useState(10)
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [shop, setShop] = useState('')
  const [createdAt, setDate] = useState('')
  const [id, setId] = useState(0)
  const [modal, setModal] = useState(false)
  const [responsive] = useState('standard')
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Authorization: `Bearer ${token}`,
    },
  }
  useEffect(() => {
    fetchRestock()
  }, [currentPage])
  const fetchRestock = async () => {
    Axios.get(`${BASE_URL}/api/inventory/get-restock?page=${currentPage}`, config).then(function (
      response,
    ) {
      if (response.data.success) {
        setRestock(response.data.restock)
        setNumberOfPages(response.data.numberOfPages)
      }
    })
  }
  const fetchData = async (id) => {
    console.log('just', id)
    Axios.get(`${BASE_URL}/api/inventory/get-single-restock/${id}`, config).then((response) => {
      if (response.data.success) {
        setType(response.data.restock.type)
        setQty(response.data.restock.qty)
        setDate(response.data.restock.createdAt)
        setCategory(response.data.restock.category)
        setShop(response.data.restock.shop)
        setId(response.data.restock._id)
      }
    })
  }
  const handleDelete = (id) => async () => {
    console.log(id)

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
          url: `${BASE_URL}/api/inventory/delete-user-restock/${id}`,
          headers: config.headers,
        })
          .then((response) => {
            if (response.data.success) {
              Swal(' Your record has been deleted!', {
                icon: 'success',
              })
              window.location.reload()
            } else {
              Swal('Something went wrong!')
            }
          })
          .catch((e) => {
            Swal({ text: e.response.data.msg, icon: 'error' })
          })
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setModal(false)
    const data = { category, type, qty, createdAt }

    Axios({
      method: 'put',
      url: `${BASE_URL}/api/inventory/update-restock/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        console.log(response.data)
        if (response.data.success) {
          Swal({
            title: 'Good job!',
            text: 'You have successfully updated this item.',
            icon: 'success',
            button: 'Ok',
          })
          setInterval(() => {
            window.location.reload()
          }, 3000)
        }
      })
      .catch((e) => {
        console.log(e.response.data)
        Swal({ text: e.response.data.msg, icon: 'error' })
      })
  }
  const columns = [
    // {
    //   name: 'S/N',
    //   label: 'S/N',
    //   options: {
    //     sort: true,
    //   },
    // },
    {
      name: 'qty',
      label: 'QTY',
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: 'category',
      label: 'CATEGORY',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'type',
      label: 'TYPE',
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: 'price',
      label: 'PRICE',
      options: {
        filter: true,

        sort: true,
      },
    },
    {
      name: 'shop',
      label: 'SHOP',
      options: {
        filter: true,

        sort: true,
      },
    },

    {
      name: 'date',
      label: 'DATE',
      options: {
        filter: true,

        sort: true,
      },
    },
    {
      name: 'action',
      label: 'ACTION  ',
      options: {
        filter: false,

        sort: false,
      },
    },
  ]
  const options = {
    filterType: 'none',
    responsive,
    selectableRows: 'none',
    print: 'false',
    download: 'false',
    // filter:'false'
  }
  const rows = restock?.map((item, index) => {
    return {
      // id: index + 1,
      qty: item.qty,
      category: item.category,
      type: item.type,
      price: `₦${formatter.format(item.prize)}`,
      shop: item.shop,
      date: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
      action: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            rel="tooltip"
            title="edit item"
            onClick={() => {
              console.log(item._id)
              console.log(item)
              fetchData(item._id)
              setModal(!modal)
            }}
            // className="edit-btn"
          >
            <CIcon icon={cilPencil} style={{ fontSize: '100px', color: 'green' }} size="xl" />
          </span>

          <span
            to="#"
            rel="tooltip"
            title="delete item"
            // className="del-btn"
            onClick={handleDelete(item._id)}
          >
            <CIcon icon={cilTrash} style={{ fontSize: '100px', color: 'red' }} size="xl" />
          </span>
        </div>
      ),
    }
  })
  if (restock.length === 0) {
    return <center>No Product Found</center>
  }
  return (
    <>
      <MUIDataTable
        title="Your Restocked Products"
        data={rows}
        columns={columns}
        options={options}
        components={{
          TableFooter: CustomeFooter,
        }}
      />
      <div
        style={{
          padding: '20px 0',
        }}
      >
        <Pagination
          // classes={{ ul: classes.ul }}
          count={numberOfPages}
          page={Number(currentPage) || 1}
          variant="outlined"
          color="primary"
          renderItem={(item) => (
            <PaginationItem component={Link} to={`/admin/restock?page=${item.page}`} {...item} />
          )}
        />
      </div>
      <CModal visible={modal} onClose={() => setModal()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-sm-6">
              Category:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Type:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              Qty:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Shop:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={shop}
                  onChange={(e) => setShop(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              Date:
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setDate(new Date(e.target.value))}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSubmit}>
            Edit
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
