import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { DataProvider } from './pageContext'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const AdminLayout = React.lazy(() => import('./layout/AdminLayout'))
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Layout = React.lazy(() => import('./layout/Layout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ForggotPassword = React.lazy(() => import('./views/pages/forggotpassword/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./views/pages/resetpassword/ResetPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <DataProvider>
            <Routes>
              <Route exact path="/" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route
                exact
                path="/forgot-password"
                name="ForggotPassword Page"
                element={<ForggotPassword />}
              />
              <Route
                exact
                path="/reset-password/:id"
                name="Reset Password Page"
                element={<ResetPassword />}
              />

              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route path="/user/*" element={<Layout />} />
              <Route path="/admin/*" element={<AdminLayout />} />
            </Routes>
          </DataProvider>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
