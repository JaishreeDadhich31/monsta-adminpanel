import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { Link } from 'react-router';
import 'izitoast/dist/css/iziToast.min.css';


export default function ViewSlider() {
    const [openFilter, setOpenFilter] = useState(false);
    const [filterData, setFilterData] = useState({});
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [slider, setslider] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [apiStatus, setApiStatus] = useState();
    
    
      useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/slider/view`, {
          name: filterData.name,
          order: filterData.order,
          page: currentPage,

        })
          .then((result) => {
            console.log(result.data);
            if (result.data._status == true) {
              setslider(result.data._data)
              setTotalPages(result.data._paginate.total_page);
            } else {
              setslider([]);
              setCurrentPage(result.data._paginate.total_page)
              console.log(currentPage)
              iziToast.error({
                title: 'Error',
                message: result.data._message,
                position: 'topRight'
              });
            }
          })
          .catch(() => {
            iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
    
          })
      }, [filterData, currentPage, apiStatus])
    
      const applyFilter = (e) => {
    
        e.preventDefault();
    
        let obj = {
             name: e.target.name.value
            }
    
        setFilterData(obj);
    
        iziToast.success({
          title: "Success",
          message: "Filter applied successfully!",
          position: "topRight",
        });
    
      };
    
      console.log(filterData);
    
      const SingleCheckSelect = (id) => {
        if (selectedRecord.includes(id)) {
          let finalData = selectedRecord.filter((v) => v !== id)
          setSelectedRecord(finalData)
        } else {
          let finalData = [...selectedRecord, id]
          setSelectedRecord(finalData)
        }
      }
    
      const selectAllCheckBox = () => {
        if (slider.length == selectedRecord.length) {
          setSelectedRecord([]);
        }
        else {
          setSelectedRecord([]);
    
          var checkBoxValue = [];
          slider.forEach(element => {
            checkBoxValue.push(element._id)
          });
          setSelectedRecord([...checkBoxValue]);
        }
      }
    
      const changeStatus = () => {
    
        if (selectedRecord.length > 0) {
    
          axios.put('http://localhost:5000/api/admin/slider/change-status', {
            ids: selectedRecord
    
          })
            .then((result) => {
              console.log(result.data);
              if (result.data._status == true) {
                setApiStatus(!apiStatus)
                iziToast.success({
                  title: "Status Updated",
                  message: result.data._message,
                  position: "topRight",
                });
                setSelectedRecord([])
              }
              else {
                console.log(result.data);
                iziToast.error({
                  title: 'Error',
                  message: result.data._message,
                  position: 'topRight'
                });
              }
            })
            .catch((error) => {
              console.error("CHANGE STATUS ERROR:");
              console.error(error.stack || error);
    
              iziToast.error({
                title: "Error",
                message: error.response?.data?._message || error.message,
                position: "topRight",
              });
            });
    
    
        } else {
    
          iziToast.error({
            title: "No Selection",
            message: "Please select at least one record to change status.",
            position: "topRight",
          });
    
        }
      }
    
      const deleteRecords = () => {
    
        if (selectedRecord.length > 0) {
    
          iziToast.question({
            timeout: 20000,
            close: true,
            overlay: true,
            displayMode: "once",
            id: "delete-confirm",
            zindex: 999999,
            title: "Are you sure?",
            message:
              "Do you really want to delete selected records? This action cannot be undone.",
            position: "center",
    
            buttons: [
    
              [
                "<button><b>YES, Delete</b></button>",
                function (instance, toast) {
    
                  axios.put('http://localhost:5000/api/admin/slider/delete', {
                    ids: selectedRecord
    
                  })
                    .then((result) => {
                      if (result.data._status == true) {
                        setApiStatus(!apiStatus)
                        iziToast.success({
                          title: "Record Delete",
                          message: result.data._message,
                          position: "topRight",
                        });
                        // check box ke liye  
                        setSelectedRecord([])
                      }
                      else {
                        iziToast.error({
                          title: 'Error',
                          message: result.data._message,
                          position: 'topRight'
                        });
                      }
                    })
                    .catch(() => {
                      iziToast.error({
                        title: 'Error',
                        message: 'Something went wrong',
                        position: 'topRight'
                      });
    
                    })
    
    
                  instance.hide({ transitionOut: "fadeOut" }, toast);
    
                },
                true
              ],
              [
                "<button>Cancel</button>",
                function (instance, toast) {
    
                  iziToast.info({
                    title: "Cancelled",
                    message: "Material delete action cancelled.",
                    position: "topRight",
                  });
    
                  instance.hide({ transitionOut: "fadeOut" }, toast);
    
                }
              ]
            ],
          });
    
        } else {
    
          iziToast.error({
            title: "No Selection",
            message: "Please select at least one record to delete.",
            position: "topRight",
          });
    
        }
    
      };
    
    return (
        <>
            <section className="min-h-screen bg-gray-100 ml-64">

                 {/* Breadcrumb */}
          <div className="bg-white border-b px-6 py-4">
            <p className="text-2xl font-semibold text-gray-800">
               Home | Slider | <span className='text-violet-500'>View</span>
             </p>
           </div>


                {/* FILTER */}
                <div
                    className={`px-1 overflow-hidden transition-all duration-300 ease-out 
                    ${openFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >

                    <form
                        onSubmit={applyFilter}
                        className="py-4 relative px-6 my-3 rounded-lg border border-slate-200 w-full bg-white shadow-sm"
                    >

                        <button
                            type="button"
                            onClick={() => setOpenFilter(false)}
                            className="absolute right-4 top-4 text-[28px] text-gray-600 hover:text-black cursor-pointer"
                        >
                            <MdOutlineClose />
                        </button>

                        <p className="font-semibold py-2 text-[20px]">Filter</p>

                        <div className="flex items-center gap-6">

                            {/* Name */}
                            <div className="mb-5">
                                <label className="block mb-2 font-medium text-gray-700">Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Enter name"
                                    className="text-[17px] border border-slate-300 rounded-lg 
                                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                                     block w-full py-2.5 px-3"
                                />
                            </div>

                            {/* Rating */}
                            <div className="mb-5">
                                <label className="block mb-2 font-medium text-gray-700">
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    min={1}
                                    max={5}
                                    autoComplete="off"
                                    placeholder="Enter rating"
                                    className="text-[17px] border border-slate-300 rounded-lg 
                                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                                    block w-full py-2.5 px-3"
                                />
                            </div>

                        </div>


                        <div className="flex items-center gap-3 pt-2">

                            <button
                              type="reset"
                                onClick={() => {
                                  setFilterData({})
                                  setCurrentPage(1)
                                }}
                                className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-6 py-2 rounded-lg"
                              >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg 
                                shadow-sm transition-all focus:ring-4 focus:ring-indigo-300"
                            >
                                Apply
                            </button>

                        </div>

                    </form>
                </div>



                {/* MAIN */}
                <div className="p-4">

                    {/* Header */}
                    <div className="bg-white flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300">

                        <div className="text-[26px] font-semibold">
                            View Sliders
                        </div>

                        <div className="flex gap-3 items-center">

                            {/* Filter */}
                            <button onClick={() => setOpenFilter(true)}>
                                <div className="bg-blue-500 p-2 rounded-full">
                                    <FaFilter className="text-white" />
                                </div>
                            </button>


                            {/* Status */}
                            <button
                                onClick={changeStatus}
                                disabled={selectedRecord.length === 0}
                                className="text-white
                                 bg-red-500 hover:bg-red-500 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
                            >
                                Change Status
                            </button>


                            {/* Delete */}
                            <button
                                onClick={deleteRecords}
                                disabled={selectedRecord.length === 0}
                                className="text-white
                                 bg-green-500 hover:bg-green-500 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>



                    {/* TABLE */}
                    <div className="border border-t-0 rounded-b-md border-slate-300">

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-gray-700">

                                <thead className="text-sm uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-2 w-[100px] py-3">
                                        <input
                                            type="checkbox"
                                            checked={slider.length === selectedRecord.length && slider.length > 0}
                                            onChange={selectAllCheckBox}
                                            className="mr-2 w-4 h-4 cursor-pointer text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        Select
                                    </th>

                                        <th className="px-2 py-3">Title</th>
                                        <th className="px-2 py-3">Image</th>
                                        <th className="px-2 py-3">Order</th>
                                        <th className="px-2 py-3">Status</th>
                                        <th className="px-2 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                            {
                                slider.map((item, index) => (
                                    <tr key={item._id} className="bg-white border-b">

                                        <td className="px-2 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecord.includes(item._id)}
                                                onChange={() => SingleCheckSelect(item._id)}
                                            />
                                        </td>

                                        <td className="px-2 py-4">
                                            {item.name}
                                        </td>

                                        <td className="px-2 py-4">
                                            <img
                                                src={`http://localhost:5000/uploads/slider/${item.image}`}
                                                className="w-[50px] h-[50px] object-cover rounded"
                                            />
                                        </td>

                                        <td className="px-2 py-4">
                                            {item.order}
                                        </td>

                                        {/* Status */}
                                          {
                                            item.status == 1
                                              ?
                                              <td className="px-4 py-3">
                                                <span className="text-green-500 text-lg font-bold">
                                                  Active
                                                </span>
                                              </td>
                                              :
                                              <td className="px-4 py-3">
                                                <span className="text-red-600 text-lg font-bold">
                                                  Inactive
                                                </span>
                                              </td>
                                          }

                                        <td className="px-2 py-4 text-yellow-500">
                                            <Link to={`/slider/update/${item._id}`}>
                                                <FaPen />
                                            </Link>
                                        </td>

                                    </tr>
                                ))
                            }
                            </tbody>

                            </table>

                        </div>
                    </div>

                </div>

            </section>
        </>
    )
}






























// import React from 'react'
// import { FaFilter } from "react-icons/fa";
// import { FaPen } from "react-icons/fa";

// export default function ViewSlider() {
//   return (
//                 <>
//                     <div>
//                         <div className="min-h-screen bg-gray-100 ml-64">
        
//                             {/* Breadcrumb */}
//                             <div className="bg-white border-b px-6 py-4">
//                                 <p className="text-2xl font-semibold text-gray-800">
//                                     Home | Slider | <span className='text-violet-500'>View Slider</span>
//                                 </p>
//                             </div>
        
//                             <section class=" dark:bg-gray-900 p-3 sm:p-5">
//                                 <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
//                                     {/* <!-- Start coding here --> */}
//                                     <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
//                                         <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
//                                             <div class="w-full md:w-1/2 font-bold text-lg">
//                                                 <h2>View User</h2>
                                                
//                                             </div>
//                                             <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
//                                                 <button type="button" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
//                                                     <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//                                                         <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
//                                                     </svg>
//                                                     Add product
//                                                 </button>
//                                                 <div className="bg-blue-500 p-2 rounded-full">
//                                                     <FaFilter className="text-white" />
//                                                 </div>
//                                                 <div class="flex items-center space-x-3 w-full md:w-auto">
//                                                     <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium 
//                                                     text-white !bg-red-500 rounded-lg border border-gray-200 
//                                                     hover:!bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-200" type="button">
//                                                         Change Status
//                                                     </button>
                                                    
//                                                     <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium 
//                                                     text-white !bg-green-500 rounded-lg border border-gray-200 
//                                                     hover:!bg-green-700 focus:z-10 focus:ring-4 focus:ring-green-200" type="button">
        
//                                                         Delete
//                                                     </button>
                                                    
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="overflow-x-auto">
//                                             <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//                                                 <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                                                     <tr>
//                                                         <th scope="col" class="px-4 py-3">
//                                                             <div className='flex items-center gap-2'>
//                                                                 <input type='checkbox' />
//                                                                 <span>Name</span>
//                                                             </div>
//                                                         </th>
//                                                         <th scope="col" class="px-4 py-3">Image</th>
//                                                         <th scope="col" class="px-4 py-3">Order </th>
//                                                         <th scope="col" class="px-4 py-3">Status</th>
//                                                         <th scope="col" class="px-4 py-3">Action</th>
//                                                         <th scope="col" class="px-4 py-3">
//                                                             <span class="sr-only">Actions</span>
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
                                          
//                                                     <tr class="border-b dark:border-gray-700">
//                                                         <th scope="col" class="px-4 py-3">
//                                                             <div className='flex items-center gap-2'>
//                                                                 <input type='checkbox' />
//                                                                 <span className='text-black'>ABC</span>
//                                                             </div>
//                                                         </th>
//                                                         <td class="px-4 py-3"></td>
//                                                         <td class="px-4 py-3">1</td>
//                                                         <td class="px-4 py-3">
//                                                             <span class="bg-red-400 text-xs text-3xl px-4 py-3 font-bold text-white rounded text-xm">
//                                                                 Active
//                                                             </span>
//                                                         </td>
//                                                         <td class="px-4 py-3"><FaPen /></td>
//                                                         <td class="px-4 py-3 flex items-center justify-end">
//                                                             <button id="apple-imac-20-dropdown-button" data-dropdown-toggle="apple-imac-20-dropdown" class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
        
//                                                             </button>
//                                                             <div id="apple-imac-20-dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
//                                                                 <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="apple-imac-20-dropdown-button">
//                                                                     <li>
//                                                                         <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
//                                                                     </li>
//                                                                     <li>
//                                                                         <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
//                                                                     </li>
//                                                                 </ul>
//                                                                 <div class="py-1">
//                                                                     <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </section>
//                         </div>
//                     </div>
//                 </>
//             )
//         }
