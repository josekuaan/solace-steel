import React, { useEffect, useContext, useState } from 'react'

import { Link, useNavigate, useLocation } from 'react-router-dom'

import Axios from 'axios'
import * as moment from 'moment'
import { WalletContext } from '../../../pageContext'
// import happy from "../../../assets/icons/happiness.svg";
import Modal from './DashBoardmodal'
import ReoderModal from './ReoderModal'
import color from './ColorPallet'
import '../../style.css'
import BASE_URL from '../../../base_url'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
} from '@coreui/react'

// import { CChartBar } from '@coreui/react-chartjs'
import { CChart } from '@coreui/react-chartjs'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import MUIDataTable, { TableFooter } from 'mui-datatables'
import columns from './column'
import CustomeFooter from 'src/views/widgets/CustomeFooter'
function useQuery() {
  return new URLSearchParams(useLocation().search)
}
const formatter = new Intl.NumberFormat({
  style: 'currency',
  currency: 'NGN',
})
const Dashboard = () => {
  const navigate = useNavigate()
  const { setOthers, setUsers, users, level, setLevel, setInventory } = useContext(WalletContext)

  const isLoggedIn = window.localStorage.getItem('loggedIn')
  const token = localStorage.getItem('token')
  const query = useQuery()
  const currentPage = query.get('page') || 1

  const [numberOfPagesDay, setNumberOfPagesDay] = useState()
  const [numberOfPagesWeek, setNumberOfPagesWeek] = useState()
  const [numberOfPagesMonth, setNumberOfPagesMonth] = useState()
  const [responsive] = useState('standard')
  const [grouped, setGrouped] = useState([])
  const [month, setMonth] = useState('')
  const [week, setWeek] = useState('')
  const [day, setDay] = useState('')
  const [currentMonth, setCurrentMonth] = useState([])

  const [originalMonth, setOriginalMonth] = useState([])
  const [currentWeek, setCurrentWeek] = useState([])
  const [currentDay, setCurrentDay] = useState([])
  const [originalWeek, setOriginalWeek] = useState([])
  const [originalDay, setOriginalDay] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalWeek, setModalWeek] = useState(false)
  const [modalDay, setModalDay] = useState(false)
  const [modalMonth, setModalMonth] = useState(false)
  var daySum = 0
  var weekSum = 0
  var monthSum = 0
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Authorization: `Bearer ${token}`,
    },
  }
  useEffect(() => {
    fetchData()
  }, [currentPage])
  const fetchData = async () => {
    Axios.get(`${BASE_URL}/api/user/auth/get-users`, config).then(function (response) {
      if (response.data.success) {
        setUsers(response.data.msg)
      }
    })

    Axios.get(`${BASE_URL}/api/inventory/get-inventories`, config).then(function (response) {
      if (response.data.success) {
        setInventory(response.data.inventory)

        for (var i = 0; i < response.data.inventory.length; i++) {
          if (response.data.inventory[i].qty <= response.data.inventory[i].otherLevel) {
            setLevel([response.data.inventory[i]])
          }
        }
        const grouped = response.data.inventory.reduce(
          ((map) => (r, a) => {
            map.set(
              a.category,
              map.get(a.category) || r[r.push({ category: a.category, quantity: 0 }) - 1],
            )
            map.get(a.category).quantity += a.qty
            return r
          })(new Map()),
          [],
        )

        setGrouped(grouped)
      }
    })

    Axios.get(
      `${BASE_URL}/api/inventory/get-sales-by-day-week-month-year?page=${currentPage}`,
      config,
    ).then(function (response) {
      if (response.data.success) {
        setNumberOfPagesDay(response.data.numberOfPages.numberOfPageDay)
        setNumberOfPagesWeek(response.data.numberOfPages.numberOfPageWeek)
        setNumberOfPagesMonth(response.data.numberOfPages.numberOfPageMonth)
        let monthSum = 0
        for (var i = 0; i < response.data.month.length; i++) {
          monthSum += response.data.month[i].totalAmount
        }

        setCurrentMonth(response.data.month)
        setOriginalMonth(response.data.month)
        setMonth(monthSum)
        let weekSum = 0
        for (var i = 0; i < response.data.week.length; i++) {
          weekSum += response.data.week[i].totalAmount
        }

        setCurrentWeek(response.data.week)
        setOriginalWeek(response.data.week)
        setWeek(weekSum)

        let daySum = 0
        for (var i = 0; i < response.data.day.length; i++) {
          daySum += response.data.day[i].totalAmount
        }

        setCurrentDay(response.data.day)
        setOriginalDay(response.data.day)
        setDay(daySum)
      }
    })
  }
  const handleFetch = async (input) => {
    Axios.get(`${BASE_URL}/api/inventory/get-qty?query=${input}`, config).then(function (response) {
      if (response.data.success) {
        setOthers(response.data.inventory)
      }
    })
  }

  const onChangeUser = (e) => {
    const { value } = e.target
    if (value === 'alluser') {
      setCurrentMonth(originalMonth)
      setCurrentWeek(originalWeek)
      setCurrentDay(originalDay)
    } else {
      let week = originalWeek.slice().filter((week) => week.userId === value)
      let month = originalMonth.slice().filter((month) => month.userId === value)
      let day = originalDay.slice().filter((day) => day.userId === value)

      setCurrentMonth(month)

      setCurrentWeek(week)
      // setCurrentFormatDay(day)
      setCurrentDay(day)
    }
  }

  const options = {
    filterType: 'none',
    responsive,
    selectableRows: 'none',
    print: 'false',
    download: 'false',
    // filter:'false'
  }
  const dayRows = currentDay?.map((item, index) => {
    return {
      // id: index + 1,
      qty: item.qty,
      category: item.category,
      type: item.type,
      payment: item.payment,
      price: `₦${formatter.format(item.prize)}`,
      total: `₦${
        Number(item.convertedqty) === 1
          ? formatter.format(item.prize)
          : formatter.format(item.prize * item.qty)
      }`,
      date: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
    }
  })
  const weekRows = currentWeek?.map((item, index) => {
    return {
      // id: index + 1,
      qty: item.qty,
      category: item.category,
      type: item.type,
      payment: item.payment,
      price: `₦${formatter.format(item.prize)}`,
      total: `₦${
        Number(item.convertedqty) === 1
          ? formatter.format(item.prize)
          : formatter.format(item.prize * item.qty)
      }`,
      date: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
    }
  })

  const monthRows = currentMonth?.map((item, index) => {
    return {
      // id: index + 1,
      qty: item.qty,
      category: item.category,
      type: item.type,
      payment: item.payment,
      price: `₦${formatter.format(item.prize)}`,
      total: `₦${
        Number(item.convertedqty) === 1
          ? formatter.format(item.prize)
          : formatter.format(item.prize * item.qty)
      }`,
      date: `${moment(item.createdAt).format('DD/MM/YYYY')}`,
    }
  })
  if (isLoggedIn === null) {
    return navigate('/')
  }
  return (
    <>
      <div className="content">
        <CRow>
          {grouped.length === 0
            ? ''
            : grouped.map((group, index) => {
                return (
                  <CCol sm="6" lg="4" key={index} style={{ paddingBottom: '20px' }}>
                    <div
                      className={`${color[index]} card`}
                      onClick={() => {
                        handleFetch(group.category)
                        setVisible(!visible)
                      }}
                    >
                      <h3 style={{ color: 'white', textTransform: 'capitalize' }}>
                        {group.category}
                      </h3>
                      <div>{group.quantity ? group.quantity : 'Not Created yet'}</div>
                    </div>
                  </CCol>
                )
              })}
          <Modal modal={visible} setModal={setVisible} />
          {level.length > 0 ? <ReoderModal level={level} /> : ''}
        </CRow>
        <br />
        <div className="row">
          <div className="col-md-12">
            <CCard>
              <CCardHeader>Bar Chart</CCardHeader>
              <CCardBody>
                <CChart
                  type="bar"
                  data={{
                    datasets: [
                      {
                        label: 'Sales per month',
                        backgroundColor: '#f87979',
                        data: [10, 22, 34, 46, 58, 70, 46, 23, 45, 78, 34, 12],
                      },
                    ],
                  }}
                  labels="months"
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalDay(!modalDay)}
              style={{ cursor: 'pointer' }}
            >
              <h5 style={{ padding: '20px 10px 0px' }}>
                <small>TODAY SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <span className="interest" style={{ color: '#fff' }}>
                    {day.length === 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${day === 0 ? day : `N${day}`}`}</span>
                    )}
                  </span>
                  <div style={{ marginTop: '14px' }}>
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>VS average
                    </small>
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalWeek(!modalWeek)}
              style={{ cursor: 'pointer' }}
            >
              <h5 style={{ padding: '20px 10px 0px' }}>
                <small>THIS WEEK SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <div className="withdraw">
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>
                    </small>{' '}
                    {week.length == 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${week === 0 ? week : `N${week}`}`}</span>
                    )}
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalMonth(!modalMonth)}
              style={{ cursor: 'pointer' }}
            >
              <h5 style={{ padding: '20px 10px 0px' }}>
                <small>THIS MONTH SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <div className="balance">
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>
                    </small>{' '}
                    {month.length == 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${month === 0 ? month : `N${month}`}`}</span>
                    )}
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CModal size="lg" visible={modalMonth} onClose={() => setModalMonth(false)}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              )
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <MUIDataTable
              title="Your Sold Products"
              data={monthRows}
              columns={columns}
              options={options}
              components={{
                TableFooter: CustomeFooter,
              }}
            />
            {currentMonth.map((current, index) => {
              monthSum +=
                Number(current.convertedqty) === 1 ? current.prize : current.prize * current.qty
            })}
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                padding: '30px',
                fontSize: '20px',
              }}
            >
              {`₦${formatter.format(monthSum)}`}
            </div>
            <Pagination
              // classes={{ ul: classes.ul }}
              count={numberOfPagesMonth}
              page={Number(currentPage) || 1}
              variant="outlined"
              color="primary"
              pagination={false}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/admin/dashboard?page=${item.page}`}
                  {...item}
                />
              )}
            />
          </div>
        </CModalBody>
      </CModal>
      <CModal size="lg" visible={modalWeek} onClose={() => setModalWeek(false)}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              )
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <MUIDataTable
              title="Your Sold Products"
              data={weekRows}
              columns={columns}
              options={options}
              components={{
                TableFooter: CustomeFooter,
              }}
            />
            {currentWeek.map((current, index) => {
              weekSum +=
                Number(current.convertedqty) === 1 ? current.prize : current.prize * current.qty
            })}
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                padding: '30px',
                fontSize: '20px',
              }}
            >
              {`₦${formatter.format(weekSum)}`}
            </div>
            <Pagination
              // classes={{ ul: classes.ul }}
              count={numberOfPagesWeek}
              page={Number(currentPage) || 1}
              variant="outlined"
              color="primary"
              pagination={false}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/admin/dashboard?page=${item.page}`}
                  {...item}
                />
              )}
            />
          </div>
        </CModalBody>
      </CModal>
      <CModal size="lg" visible={modalDay} onClose={() => setModalDay(false)}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              )
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <MUIDataTable
              title="Your Sold Products"
              data={dayRows}
              columns={columns}
              options={options}
              components={{
                TableFooter: CustomeFooter,
              }}
            />
            {currentDay.map((current, index) => {
              daySum +=
                Number(current.convertedqty) === 1 ? current.prize : current.prize * current.qty
            })}
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                padding: '30px',
                fontSize: '20px',
              }}
            >
              {`₦${formatter.format(daySum)}`}
            </div>
            <Pagination
              // classes={{ ul: classes.ul }}
              count={numberOfPagesDay}
              page={Number(currentPage) || 1}
              variant="outlined"
              color="primary"
              pagination={false}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/admin/dashboard?page=${item.page}`}
                  {...item}
                />
              )}
            />
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Dashboard
