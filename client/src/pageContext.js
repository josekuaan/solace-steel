/* eslint-disable react/prop-types */

import React, { useState, useEffect, createContext } from 'react'
import BASE_URL from './base_url'
import { useNavigate } from 'react-router-dom'

import Axios from 'axios'

const WalletContext = createContext()

const DataProvider = (props) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [currentuser, setCurrentUser] = useState([])

  const [sale, setSale] = useState([])
  const [inventory, setInventory] = useState([])
  const [categories, setCategory] = useState([])
  const [others, setOthers] = useState([])
  const [level, setLevel] = useState([])
  const [Returned, setReturn] = useState([])
  const userId = window.localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  useEffect(() => {
    let isMounted = true
    getData()
    return () => {
      isMounted = false
    }
  }, [])

  const getData = async () => {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }

    try {
      Axios.get(`${BASE_URL}/api/user/auth/getMe/${userId}`, config)
        .then(function (response) {
          // handle success
          if (response.data.success) {
            setCurrentUser([response.data.msg])
          }
        })
        .catch(function (error) {
          // handle error
          if (error.response.data.msg === 'Not authorized to access this route') {
            navigate('/')
          }
          console.log(error.response)
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        users,
        setUsers,
        currentuser,
        setCurrentUser,
        setSale,
        sale,
        inventory,
        setInventory,
        categories,
        setCategory,
        others,
        setOthers,
        setLevel,
        level,
        Returned,
        setReturn,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  )
}

export { DataProvider, WalletContext }
