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
export default function Items({ inventory, numberOfPages, setCurrentInvent, setNumberOfPages }) {
  const { setInventory } = useContext(WalletContext)
  const query = useQuery()
  const currentPage = query.get('page') || 1
  const token = localStorage.getItem('token')
  const [prize, setPrize] = useState(20)
  const [qty, setQty] = useState(10)
  const [type, setType] = useState('type')
  const [category, setCategory] = useState('welding')
  const [createdAt, setDate] = useState('')
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
    Axios.get(`${BASE_URL}/api/inventory/get-inventories?page=${currentPage}`, config).then(
      function (response) {
        if (response.data.success) {
          console.log(response.data)
          setNumberOfPages(response.data.numberOfPages)

          setCurrentInvent(response.data.inventory)
        }
      },
    )
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
          url: `${BASE_URL}/api/inventory/delete-user-inventory/${id}`,
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

  const fetchData = async (id) => {
    Axios.get(`${BASE_URL}/api/inventory/get-single-inventory/${id}`, config).then((response) => {
      if (response.data.success) {
        setType(response.data.inventory.type)
        setQty(response.data.inventory.qty)
        setPrize(response.data.inventory.prize)
        setCategory(response.data.inventory.category)
        setDate(moment(response.data.inventory.createdAt).format('DD/MM/YYYY'))
        setId(response.data.inventory._id)
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setVisible(false)

    const data = { category, type, qty, prize, createdAt }

    Axios({
      method: 'put',
      url: `${BASE_URL}/api/inventory/update-inventory/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setInventory(response.data.inventory)
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
      name: 'date',
      label: 'DATE',
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
    print: 'false',
    download: 'false',

    // filter:'false'
  }
  const rows = inventory?.map((items, index) => {
    return {
      // id: index + 1,
      qty: items.qty,
      category: items.category,
      type: items.type,
      price: `₦${formatter.format(items.prize)}`,

      date: `${moment(items.createdAt).format('DD/MM/YYYY')}`,
      action: (
        <>
          <span
            rel="tooltip"
            title="edit item"
            onClick={() => {
              fetchData(items._id)
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
            onClick={handleDelete(items._id)}
          >
            <CIcon icon={cilTrash} style={{ fontSize: '100px', color: 'red' }} size="xl" />
          </span>
        </>
      ),
    }
  })
  if (inventory.length === 0) {
    return <center>No Product Found</center>
  }
  return (
    <>
      <MUIDataTable
        title="Your Created Products"
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
              to={`/admin/product-catlog?page=${item.page}`}
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
            <div className="col-sm-6">
              Qty:
              <div className="input-group">
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
            <div className="col-sm-6">
              Price:
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Set Date:
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
