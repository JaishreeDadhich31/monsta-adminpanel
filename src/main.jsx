import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import './assets/css/responsive.css'
import './api/axiosAuth'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import ViewUser from './components/user/ViewUser'
import CommonLayout from './components/common/CommonLayout'
import ContactEnquiryMang from './components/enquiry/ContactEnquiryMang'
import NewsLetter from './components/enquiry/NewsLetter'
import AddColor from './components/color/AddColor'
import ViewColor from './components/color/ViewColor'
import AddMaterial from './components/material/AddMaterial'
import ViewMaterial from './components/material/ViewMaterial'
import AddCategory from './components/parent category/AddCategory'
import ViewCategory from './components/parent category/ViewCategory'
import AddSubCategory from './components/sub category/AddSubCategory'
import ViewSubCategory from './components/sub category/ViewSubCategory'
import AddSubSubCategory from './components/sub sub category/AddSubSubCategory'
import ViewSubSubCategory from './components/sub sub category/ViewSubSubCategory'
import AddProduct from './components/Products/AddProduct'
import ViewProduct from './components/Products/ViewProduct'
import AddWhyChooseUs from './components/why choose us/AddWhyChooseUs'
import ViewWhyChooseUs from './components/why choose us/ViewWhyChooseUs'
import OrderList from './components/Order/OrderList'
import AddSilder from './components/sliders/AddSilder'
import ViewSlider from './components/sliders/ViewSlider'
import AddCountry from './components/Country/AddCountry'
import ViewCountry from './components/Country/ViewCountry'
import AddTestimonial from './components/testimonial/AddTestimonial'
import ViewTestimonial from './components/testimonial/ViewTestimonial'
import AddFaq from './components/faq/AddFaq'
import ViewFaq from './components/faq/ViewFaq'
import MyProfile from './components/MyProfile'
import Logout from './components/Logout'

function ProtectedRoutes() {
  return localStorage.getItem('admin_token') ? <Outlet /> : <Navigate to="/" replace />
}

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>

      <Routes>
           
          <Route path='/' element={< Login />} />

          <Route element={<ProtectedRoutes />}>
           <Route element={<CommonLayout/>}>

              <Route path='/dash-board' element={< DashBoard />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/logout' element={<Logout />} />

              <Route path='/view-user' element={<ViewUser />} />

              <Route path='enquiry'>
                  <Route path='contact-enquiry' element={<ContactEnquiryMang/>}/>
                  <Route path='news-letter' element={<NewsLetter/>}/>
              </Route>

              <Route path='color'>
                  <Route path='view-color' element={<ViewColor/>}/>
                  <Route path='update/:id' element={<AddColor/>}/>
                  <Route path='add-color' element={<AddColor/>}/>
              </Route>

              <Route path='material'>
                  <Route path='add-material' element={<AddMaterial/>}/>
                  <Route path='update/:id' element={<AddMaterial/>}/>
                  <Route path='view-material' element={<ViewMaterial/>}/>
              </Route>


              <Route path='parent'>
                  <Route path='add-category' element={<AddCategory/>}/>
                  <Route path='update/:id' element={<AddCategory/>}/>
                  <Route path='view-category' element={<ViewCategory/>}/>
              </Route>

              <Route path='subcategory'>
                <Route path='add-category' element = {<AddSubCategory/>}/>
                <Route path='update/:id' element={<AddSubCategory/>}/>
                <Route path='view-category' element ={<ViewSubCategory/>}/> 
              </Route>

              <Route path='subsubcategory'>
                <Route path='add-category' element = {<AddSubSubCategory/>}/>
                <Route path='update/:id' element={<AddSubSubCategory/>}/>
                <Route path='view-category' element ={<ViewSubSubCategory/>}/> 
              </Route>

              <Route path='products'>
                  <Route path='add-product' element={<AddProduct/>}/>
                  <Route path='update/:id' element={<AddProduct/>}/>
                  <Route path='view-product' element={<ViewProduct/>}/>
              </Route>

              <Route path='why choose us'>
                  <Route path='add-why-choose-us' element={<AddWhyChooseUs/>}/>
                  <Route path='update/:id' element={<AddWhyChooseUs/>}/>
                  <Route path='view-why-choose-us' element={<ViewWhyChooseUs/>}/>
              </Route>

              <Route path='order'>
                <Route path='order-list' element={<OrderList/>}/>
              </Route>

              <Route path='slider'>
                <Route path='add-slider' element ={<AddSilder/>}/>
                <Route path='update/:id' element={<AddSilder/>}/>
                <Route path='view-slider' element ={<ViewSlider/>}/>
              </Route>

              <Route path='country'>
                <Route path='add-country' element ={<AddCountry/>}/>
                <Route path='update/:id' element={<AddCountry/>}/>
                <Route path='view-country' element ={<ViewCountry/>}/>
              </Route>

              <Route path='testimonial'>
                <Route path='add-testimonial' element ={<AddTestimonial/>}/>
                <Route path='update/:id' element={<AddTestimonial/>}/>
                <Route path='view-testimonial' element ={<ViewTestimonial/>}/>
              </Route>

              <Route path='faq'>
                    <Route path='add-faq' element={<AddFaq/>}/>
                    <Route path='update/:id' element={<AddFaq/>}/>
                    <Route path='view-faq' element={<ViewFaq/>}/>
              </Route>
           </Route>
          </Route>


      </Routes>
    </BrowserRouter>
  </>

)
