import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { Link } from 'react-router';
import 'izitoast/dist/css/iziToast.min.css';



export default function ViewCategory() {

  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({})
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const [apiStatus, setApiStatus] = useState();
  const [imagePath , setImagePath] = useState('');

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/category/view`, {
      name: filterData.name,
      order: filterData.order,
      page: currentPage


    })
      .then((result) => {
        if (result.data._status == true) {
          setCategories(result.data._data)
          setTotalPages(result.data._paginate.total_pages)
          setImagePath(result.data._image_path)
        } 
        else {
          setCategories([]);
          // console.log(currentPage)
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
    setCurrentPage(1);

    let obj = {
      name: e.target.name.value,
      order: e.target.order.value
    };

    setFilterData(obj);
  };


  const [selectedRecord, setSelectedRecord] = useState([])

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
    if (categories.length == selectedRecord.length) {
      setSelectedRecord([]);
    }
    else {
      setSelectedRecord([]);

      var checkBoxValue = [];
      categories.forEach(element => {
        checkBoxValue.push(element._id)
      });
      setSelectedRecord([...checkBoxValue]);
    }
  }


  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put(`${import.meta.env.VITE_API_BASE_URL}/category/change-status`, {
        ids: selectedRecord

      })
        .then((result) => {
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
        title: "Confirm Delete",
        message: "Are you Sure you want to delete.",
        position: "center",
        buttons: [
          [
            "<button><b>YES, Delete</b></button>",
            function (instance, toast) {

              axios.put(`${import.meta.env.VITE_API_BASE_URL}/category/delete`, {
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
              instance.hide({ transitionOut: "fadeOut" }, toast);
            }
          ]
        ]
      })

    } else {

      iziToast.error({
        title: "No Selection",
        message: "Please select at least one record to delete.",
        position: "topRight",
      });

    }

  }



  return (
    <>
      <section className="ml-[240px] min-h-screen bg-[#f3f4f6]">

        {/* Breadcrumb */}
        <div className="bg-white border-b px-6 py-4">
          <p className="text-2xl font-semibold text-gray-800">
            Home | Parent | <span className='text-violet-500'>View Category</span>
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


            <p className="font-semibold py-2 text-[20px]">
              Filter
            </p>


            <div className="flex items-center gap-6">

              <div className="mb-5"> 

                <label className="block mb-2 font-medium text-gray-700">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter Material Name"
                  className="text-[17px] border border-slate-300 rounded-lg 
                          focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                          block w-full py-2.5 px-3"
                />

              </div>

              <div className="mb-5">

                <label className="block mb-2 font-medium text-gray-700">
                  Order
                </label>

                <input
                  type="text"
                  name="order"
                  autoComplete="off"
                  placeholder="Order"
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
                  // setCurrentPage(1) 
                }}
                className="text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all"
              >
                Clear
              </button>



              <button
                type="submit"
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-indigo-300"
              >
                Apply
              </button>

            </div>

          </form>

        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 py-6">

          <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-6">
              <h2 className="text-[18px] font-bold text-black">
                View Category
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="w-[36px] h-[36px] rounded-full bg-[#2f80ed] hover:bg-[#1f6fd6] text-white flex items-center justify-center"
                >
                  <FaFilter className="text-[16px]" />
                </button>

                <button
                  onClick={changeStatus}
                  disabled={selectedRecord.length == 0}
                  className="text-white bg-red-500 hover:bg-red-600 text-sm px-5 py-2.5 rounded-md font-semibold"
                >
                  Change Status
                </button>

                <button
                  onClick={deleteRecords}
                  disabled={selectedRecord.length == 0}
                  className="text-white bg-green-500 hover:bg-green-600 text-sm px-5 py-2.5 rounded-md font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[#172033]">
                <thead className="bg-[#f1f2f4]">
                  <tr>
                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      <input
                        type="checkbox"
                        checked={categories.length == selectedRecord.length ? 'checked' : ''}
                        onClick={selectAllCheckBox}
                        className="mr-2 w-4 h-4 cursor-pointer"
                      />
                      {/* Select */}
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      S. No.
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      Name
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      Image
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      Order
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-bold uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {
                    categories.length > 0
                      ?
                      categories.map((v, i) => {
                        return (
                          <tr key={v._id} className="border-b border-gray-400">

                            {/* Checkbox */}
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedRecord.includes(v._id)}
                                onChange={() => SingleCheckSelect(v._id)}
                              />
                            </td>

                            {/* Serial Number */}
                            <td className="px-4 py-3">
                              {i + 1}
                            </td>

                            {/* Name */}
                            <td className="px-4 py-3">
                              <span className="text-black font-normal">
                                {v.name}
                              </span>
                            </td>

                            {/* Image */}
                            <td className="px-4 py-3">
                              {/* {console.log(imagePath)} */}
                             {/* {console.log(v.image)}  */}
                              {
                                v.image
                                ?
                                 <img
                                className="w-[50px] h-[50px] object-cover rounded-md"
                                src={`${imagePath}/${v.image}`}
                                alt=""
                              />
                                :
                                'N/A'
                              }
                             
                            </td>

                            {/* Order */}
                            <td className="px-4 py-3">
                              {v.order}
                            </td>

                            {/* Status */}
                            {
                              v.status == 1
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

                            {/* Action */}
                            <td className="px-4 py-3 text-yellow-500">
                              <Link to={`/parent/update/${v._id}`}>
                                <FaPen />
                              </Link>
                            </td>

                          </tr>
                        )
                      })
                      :
                      <tr className="border-b border-gray-400">
                        <td colSpan={7} className="px-4 py-3 text-center font-bold">
                          No record found !!
                        </td>
                      </tr>
                  }

                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-5 w-[92%] mx-auto">
              <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
             />
          </div>

        </div>
      </section >
    </>
  )
}
