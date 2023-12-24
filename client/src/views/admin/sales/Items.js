/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import * as moment from 'moment'
import Axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import Swal from 'sweetalert'
import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilTrash, cilPencil, cilFolderOpen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import MUIDataTable from 'mui-datatables'
import CustomeFooter from 'src/views/widgets/CustomeFooter'
function useQuery() {
  return new URLSearchParams(useLocation().search)
}
const formatter = new Intl.NumberFormat({
  style: 'currency',
  currency: 'NGN',
})
export default function Items({ sale, numberOfPages, setNumberOfPages, setSaleCopy }) {
  const { setSale } = useContext(WalletContext)
  const token = localStorage.getItem('token')
  const query = useQuery()
  const currentPage = query.get('page') || 1
  const [prize, setPrize] = useState(20)
  const [qty, setQty] = useState(10)
  const [type, setType] = useState('type')
  const [category, setCategory] = useState('welding')
  const [payment, setPayment] = useState('cash')
  const [detail, setDetails] = useState('')
  const [createdAt, setDate] = useState('')
  const [time, setTime] = useState('')
  const [shop, setShop] = useState('')
  const [id, setId] = useState(0)
  const [modal, setModal] = useState(false)
  const [modalView, setModalView] = useState(false)
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
    fetchPerPage()
  }, [currentPage])

  const fetchPerPage = () => {
    Axios.get(`${BASE_URL}/api/inventory/get-sales?page=${currentPage}`, config).then(function (
      response,
    ) {
      if (response.data.success) {
        setNumberOfPages(response.data.numberOfPages)

        setSaleCopy(response.data.sale)
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
          url: `${BASE_URL}/api/inventory/delete-user-sale/${id}`,
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

          .catch((e) => {
            Swal({ text: e.response.data.msg, icon: 'error' })
          })
      }
    })
  }

  const fetchData = async (id) => {
    Axios.get(`${BASE_URL}/api/inventory/get-sale-id/${id}`, config).then((response) => {
      if (response.data.success) {
        setType(response.data.sale.type)
        setQty(response.data.sale.qty)
        setPrize(response.data.sale.prize)
        setCategory(response.data.sale.category)
        setPayment(response.data.sale.payment)
        setId(response.data.sale._id)
        setDate(response.data.sale.createdAt)
        setTime(response.data.sale.createdAt)
        setShop(response.data.sale.shop)
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setModal(false)

    const data = { category, type, qty, prize, payment, createdAt }

    Axios({
      method: 'put',
      url: `${BASE_URL}/api/inventory/update-sale/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setSale(response.data.sale)
          Swal({
            title: 'Good job!',
            text: 'You have successfully updated this item.',
            icon: 'success',
            button: <But />,
          })
          setInterval(() => {
            window.location.reload()
          }, 3000)
        }
      })
      .catch((e) => {
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
      name: 'payment',
      label: 'PAYMENT',
      options: {
        filter: true,
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
      name: 'total',
      label: 'TOTAL(NGN)',
      options: {
        filter: false,

        sort: false,
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
  const rows = sale?.map((item, index) => {
    return {
      // id: index + 1,
      qty: item.qty,
      category: item.category,
      type: item.type,
      payment: item.payment,
      price: `₦${formatter.format(item.prize)}`,
      total: `₦${formatter.format(
        item.qty === 0.5 ? item.prize * parseInt(item.qty.toFixed()) : item.prize * item.qty,
      )}`,
      date: `${moment(item.date).format('DD/MM/YYYY')}`,
      action: (
        <div style={{ display: 'flex' }}>
          <span
            rel="tooltip"
            title="edit item"
            onClick={() => {
              fetchData(item.id)
              setModal(!modal)
            }}
            // className="edit-btn"
          >
            <CIcon icon={cilPencil} style={{ fontSize: '100px', color: 'green' }} size="xl" />
          </span>
          <span
            rel="tooltip"
            title="edit item"
            style={{ margin: '0 10px' }}
            onClick={() => {
              fetchData(item.id)
              setModalView(!modalView)
            }}
            // className="edit-btn"
          >
            <CIcon icon={cilFolderOpen} style={{ fontSize: '100px', color: 'blue' }} size="xl" />
          </span>
          <span
            to="#"
            rel="tooltip"
            title="delete item"
            // className="del-btn"
            onClick={handleDelete(item.id)}
          >
            <CIcon icon={cilTrash} style={{ fontSize: '100px', color: 'red' }} size="xl" />
          </span>
        </div>
      ),
    }
  })
  if (sale.length === 0) {
    return <center>No Product Found</center>
  }

  return (
    <>
      <MUIDataTable
        title="Your Sold Products"
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
        {' '}
        <Pagination
          // classes={{ ul: classes.ul }}
          count={numberOfPages}
          page={Number(currentPage) || 1}
          variant="outlined"
          color="primary"
          renderItem={(item) => (
            <PaginationItem component={Link} to={`/admin/sales-log?page=${item.page}`} {...item} />
          )}
        />
      </div>
      <CModal visible={modalView} onClose={() => setModalView()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-sm-6">
              <div>Qty: {qty}</div>
              <div>Category: {category.toUpperCase()}</div>
              <div>Type: {type.toUpperCase()}</div>
              <div>price: {prize}</div>
              <div>Date: {moment(time).format('MMMM Do YYYY, h:mm:ss a')}</div>
              <div>Payment: {payment.toUpperCase()}</div>
              <div>Shop: {shop}</div>
              <div>Details: {detail.toUpperCase()}</div>
            </div>
          </div>
        </CModalBody>
      </CModal>
      <CModal visible={modal} onClose={() => setModal()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-sm-6">
              Category:
              <div className="">
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
              <div className="">
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
              <div className="">
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
              Price:
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Payment Type:
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Update Date:
              <div className="">
                <input
                  type="date"
                  className="form-control"
                  required
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSubmit}>
            Update
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
function But() {
  ;<Link onClick={() => window.location.reload()}>OK</Link>
}
