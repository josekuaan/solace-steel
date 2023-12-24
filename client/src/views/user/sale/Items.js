/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as moment from 'moment'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import MUIDataTable from 'mui-datatables'
import CustomeFooter from 'src/views/widgets/CustomeFooter'
import Axios from 'axios'
import BASE_URL from 'src/base_url'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}
const formatter = new Intl.NumberFormat({
  style: 'currency',
  currency: 'NGN',
})
export default function Items({ numberOfPages, sale, setNumberOfPages, setSale }) {
  const [responsive] = useState('standard')
  const token = localStorage.getItem('token')
  const query = useQuery()
  const currentPage = query.get('page') || 1

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
    console.log(currentPage)
  }, [currentPage])

  const fetchData = () => {
    Axios.get(`${BASE_URL}/api/inventory/get-sales-by-user/?page=${currentPage}`, config).then(
      function (response) {
        if (response.data.success) {
          console.log(response.data.sale)
          setSale(response.data.sale)
          setNumberOfPages(response.data.numberOfPages)
        }
      },
    )
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
  ]
  const options = {
    filterType: 'none',
    responsive,
    selectableRows: 'none',
    print: 'false',
    download: 'false',
    pagination: 'false',
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
      date: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
    }
  })
  return (
    <>
      <MUIDataTable
        title="Your Sales History"
        data={rows}
        columns={columns}
        options={options}
        components={{
          TableFooter: CustomeFooter,
        }}
      />
      <Pagination
        // classes={{ ul: classes.ul }}
        count={numberOfPages}
        page={Number(currentPage) || 1}
        variant="outlined"
        color="primary"
        renderItem={(item) => (
          <PaginationItem component={Link} to={`/user/log?page=${item.page}`} {...item} />
        )}
      />
    </>
  )
}
