import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'

import AdminLayout from './AdminLayout'
import Layout from './Layout'

class DefaultLayout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Routes>
          <Route
            path="/dashboard/user/sale"
            name="Dashboard"
            render={(props) => <Layout {...props} />}
          />
          <Route
            path="/dashboard/admin"
            name="Admin"
            render={(props) => <AdminLayout {...props} />}
          />
        </Routes>
      </div>
    )
  }
}

export default DefaultLayout
