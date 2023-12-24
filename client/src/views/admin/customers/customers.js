/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react'
import * as moment from 'moment'
import Axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import Swal from 'sweetalert'

import { WalletContext } from '../../../pageContext'
import BASE_URL from 'src/base_url'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilTrash, cilPencil } from '@coreui/icons'
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
export default function Customers({
  customers,
  numberOfPages,
  setCurrentCustomers,
  setNumberOfPages,
}) {
  const { setCustomers } = useContext(WalletContext)
  const query = useQuery()
  const currentPage = query.get('page') || 1
  const token = localStorage.getItem('token')
  const [prize, setPrize] = useState(0)
  const [qty, setQty] = useState(10)

  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [id, setId] = useState(0)
  const [visible, setVisible] = useState(false)
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
    Axios.get(`${BASE_URL}/api/customers/get-customers?page=${currentPage}`, config).then(function (
      response,
    ) {
      if (response.data.success) {
        setNumberOfPages(response.data.numberOfPages)

        setCustomers(response.data.customers)
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
          url: `${BASE_URL}/api/customers/delete-customer/${id}`,
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

  const fetchData = async (item) => {
    console.log(item)
    setQty(item.quantity)
    setCreatedAt(item.createdAt)
    setUpdatedAt(item.updatedAt)
    setId(item._id)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setVisible(false)
    const updatedAt = moment().format()

    const data = { prize, createdAt, updatedAt }

    Axios({
      method: 'put',
      url: `${BASE_URL}/api/customers/update-customer/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data)
          setCustomers(response.data.customers)
          Swal({
            title: 'Good job!',
            text: 'You have successfully updated this item.',
            icon: 'success',
            button: <But />,
          })
          window.location.reload()
        }
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: 'error' })
      })
  }
  const columns = [
    {
      name: 'customerName',
      label: 'Customer Name',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'customerNumber',
      label: 'Customer Number',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'quantity',
      label: 'Quantity',
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
      name: 'payment',
      label: 'PAYMENT TYPE',
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: 'amountPaid',
      label: 'Amount Paid',
      options: {
        filter: true,

        sort: true,
      },
    },

    {
      name: 'bill',
      label: 'BILLING(NGN)',
      options: {
        filter: false,

        sort: false,
      },
    },
    {
      name: 'outStandings',
      label: 'OUTSTANDINGS(NGN)',
      options: {
        filter: false,

        sort: false,
      },
    },
    {
      name: 'createdAt',
      label: 'created DATE',
      options: {
        filter: true,

        sort: true,
      },
    },
    {
      name: 'lastupdated',
      label: 'Last Updated',
      options: {
        filter: true,

        sort: true,
      },
    },

    {
      name: 'action',
      label: 'ACTION',
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
    print: 'true',
    download: 'false',

    // filter:'false'
  }
  const rows = customers?.map((item, index) => {
    return {
      // id: index + 1,
      customerName: item.customerName,
      customerNumber: item.customerNumber,
      quantity: item.quantity,
      category: `${item.category}\n ${item.type}`,
      payment: item.paymentType,
      amountPaid: `₦${formatter.format(item.amountPaid)}`,
      bill: `₦${formatter.format(item.bills)}`,
      outStandings: `₦${formatter.format(item.outStandings)}`,
      createdAt: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
      lastupdated: `${moment(item.updatedAt).format('DD/MM/YYYY')}`,
      action: (
        <>
          <span
            rel="tooltip"
            title="edit item"
            onClick={() => {
              fetchData(item)
              setVisible(!visible)
            }}
            // className="edit-btn"
          >
            <CIcon
              icon={cilPencil}
              style={{ fontSize: '100px', margin: '0 20px 0 0', color: 'green' }}
              size="xl"
            />
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
        </>
      ),
    }
  })
  if (customers.length === 0) {
    return <center>No Product Found</center>
  }
  return (
    <>
      <MUIDataTable
        title="Customer Lists"
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
          pagination={false}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/admin/customer-page?page=${item.page}`}
              {...item}
            />
          )}
        />
      </div>

      <CModal visible={visible} onClose={() => setVisible()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <div className="row">
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
          </div> */}

          <div className="row">
            <div className="col-sm-12">
              Quantity:
              <div className="">
                <input
                  type="number"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-sm-12">
              Price:
              <div className="">
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
          <br />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSubmit}>
            Update
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setVisible(false)}>
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
