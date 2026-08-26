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

export default function ViewMaterial() {

  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({})
  const [material, setMaterial] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(5);
  const [apiStatus, setApiStatus] = useState();

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/material/view`, {
      name: filterData.name,
      order: filterData.order,
      page: currentPage


    })
      .then((result) => {
        if (result.data._status == true) {
          setMaterial(result.data._data)
        } else {
          setMaterial([]);
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
    if (material.length == selectedRecord.length) {
      setSelectedRecord([]);
    }
    else {
      setSelectedRecord([]);

      var checkBoxValue = [];
      material.forEach(element => {
        checkBoxValue.push(element._id)
      });
      setSelectedRecord([...checkBoxValue]);
    }
  }


  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put('http://localhost:5000/api/admin/material/change-status', {
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
        message: "Please select at least one material to change status.",
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

              axios.put('http://localhost:5000/api/admin/material/delete', {
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
      <section className="ml-[240px] min-h-screen bg-gray-50">
        {/* Breadcrumb */}
                      <div className="bg-white border-b px-6 py-4">
                        <p className="text-2xl font-semibold text-gray-800">
                          Home | Parent | <span className='text-violet-500'>View Material</span>
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
                  Material Name
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
                  setCurrentPage(1)
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

        {/* MAIN */}

        <div className="p-6">

          <div className="overflow-x-auto border border-gray-200 bg-white rounded-md shadow-sm">


            {/* Header */}
            <div className="flex justify-between items-center px-5 py-6">

              <div className="text-[18px] font-bold">
                View Material
              </div>

              <div className="flex gap-3 items-center">

                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="w-[34px] h-[34px] rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                >
                  <FaFilter />
                </button>

                <button
                  onClick={changeStatus}
                  className="text-white bg-red-500 hover:bg-red-600 text-sm px-5 py-2.5 rounded-md font-semibold"
                >
                  Change Status
                </button>

                <button
                  onClick={deleteRecords}
                  className="text-white bg-green-500 hover:bg-green-600 text-sm px-5 py-2.5 rounded-md font-semibold"
                >
                  Delete
                </button>

              </div>
            </div>

            {/* TABLE */}
            <div className="w-full">

              <table className="w-full min-w-full text-left text-gray-700">

                <thead className="text-sm uppercase bg-gray-100">

                  <tr>
                    <th className="px-4 py-3">
                      <input type="checkbox"
                        checked={material.length == selectedRecord.length ? 'checked' : ''}
                        onClick={selectAllCheckBox}
                        className="mr-2" />
                      Material Name
                    </th>

                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>

                </thead>

                <tbody>
                  {
                    material.length > 0
                      ?
                      material.map((v) => {
                        return (
                          <tr key={v._id} className="border-b border-gray-400">
                            <th scope="col" className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedRecord.includes(v._id) ? 'checked' : ''}
                                  onClick={() => SingleCheckSelect(v._id)}
                                />
                                <span className="text-black font-normal">{v.name}</span>
                              </div>
                            </th>

                            <td className="px-4 py-3">{v.order}</td>

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

                            <td className="px-4 py-3 text-yellow-500">
                              <Link to={`/material/update/${v._id}`}>
                                <FaPen />
                              </Link>
                            </td>
                          </tr>
                        )
                      })
                      :
                      <tr className="border-b border-gray-400">
                        <td colSpan={4} className="px-4 py-3 text-center font-bold">
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
      </section>
    </>
  )
}