import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import PartnerRegister from '../pages/PartnerRegister'
import PartnerLogin from '../pages/PartnerLogin'
import Home from '../pages/general/Home'
import CreateFood from '../pages/FoodPartner/CreateFood.jsx'
import Profile from '../pages/FoodPartner/Profile.jsx'
import SavedVideos from '../pages/general/SavedVideos.jsx'
import LandingPage from '../pages/general/Landing.jsx'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<PartnerRegister />} />
        <Route path='/food-partner/login' element={<PartnerLogin />} />
        <Route path='/' element={<LandingPage/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/create-food' element={<CreateFood/>} />
        <Route path='/food-partner/:id' element={<Profile/>} />
        <Route path='/saved' element={<SavedVideos/>}/>
      </Routes>
    </Router>
  )
}