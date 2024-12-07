import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Route,RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import {store} from './store/store.js';
import { Provider } from 'react-redux'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path ='/'>
      <Route path='' element={<AuthPage/>}/>
      <Route path='home' element={
        <ProtectedRoute>
          <HomePage/>
        </ProtectedRoute>
      }/>
      <Route path='profile' element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>
      }/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <RouterProvider router = {router}/> 
    </Provider>
  </StrictMode>,
)
