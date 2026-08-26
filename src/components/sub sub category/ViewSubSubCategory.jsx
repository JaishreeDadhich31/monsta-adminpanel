import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import iziToast from "izitoast";
import { Link } from "react-router";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';


export default function ViewSubSubCategory() {

  const [subSubCategories, setSubSubCategories] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({})
  const [selectedRecord, setSelectedRecord] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [imagePath, setImagePath] = useState('');
  const [apiStatus, setApiStatus] = useState();
  const [parentCategory, setParentCategory] = useState([]);
  let [parent_category_id, setparentcategoryid] = useState('');
  let [categories, setCategories] = useState([]);
  let [subCategories, setSubCategories] = useState([]);



  useEffect(() => {
    console.log(filterData)
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/view`, {
      name: filterData.name,
      parent_category_id: filterData.parent_category_id,
      sub_category_id: filterData.sub_category_id,
      page: currentPage,

    })
      .then((result) => {
        console.log("result => ", result)
        if (result.data._status) {
          setSubSubCategories(result.data._data);
          setTotalPages(result.data._paginate.total_page)
          setImagePath(result.data._image_path)
        }
        else {
          setSubSubCategories([])
        }
      })
      .catch((err) => {
        console.log(err)
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong',
          position: 'topRight'
        });
      })
  }, [apiStatus, filterData, currentPage])

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/parent-category`, {
      status: true,
      // id : parent_category_id 
    })
      .then((result) => {
        if (result.data._status) {
          setCategories(result.data._data);
        }
        else {
          setCategories([])
        }
      })
      .catch((err) => {
        console.log(err)
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong',
          position: 'topRight'
        });
      })
  }, [parent_category_id, selectedRecord])

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/sub-category`, {
      status: true,
      // id : parent_category_id 
    })
      .then((result) => {
        if (result.data._status) {
          setSubCategories(result.data._data);
        }
        else {
          setSubCategories([])
        }
      })
      .catch((err) => {
        console.log(err)
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong',
          position: 'topRight'
        });
      })
  }, [parent_category_id, selectedRecord])

  const applyFilter = (e) => {
    e.preventDefault();

    let obj = {
      name: e.target.name.value,
      parent_category_id: e.target.parent_category_id.value,
      sub_category_id: e.target.sub_category_id.value
    };

     console.log("Filter Data =>", obj);

    setFilterData(obj);

    iziToast.success({
      title: "Success",
      message: "Filter applied successfully!",
      position: "topRight",
    });
  };

  const clearFilter = () => {
    let obj = { name: '', code: "" }
    setFilterData(obj);

    iziToast.info({
      title: "Cleared",
      message: "All filters removed",
      position: "topRight",
    });
  };

  const SingleCheckSelect = (id) => {
    if (selectedRecord.includes(id)) {
      let finalData = selectedRecord.filter((v) => {
        if (v != id) {
          return v
        }
      })

      setSelectedRecord(finalData)
    } else {
      let finalData = [...selectedRecord, id]
      setSelectedRecord(finalData)
    }
  }

  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/change-status`, {
        ids: selectedRecord

      })
        .then((result) => {
          if (result.data._status == true) {
            setApiStatus(!apiStatus)
            iziToast.success({
              title: "Status Updated",
              message: result.data._message,
              position: "topRight",
            })
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
        message: "Please select at least one record to delete.",
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
        message: "Do you really want to delete selected records? This action cannot be undone.",
        position: "center",
        buttons: [
          [
            "<button><b>YES</b></button>",
            function (instance, toast) {
              axios.put(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/delete`, {
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
            true,
          ],
          [
            "<button>NO</button>",
            function (instance, toast) {
              iziToast.info({
                title: "Cancelled",
                message: "Delete action cancelled.",
                position: "topRight",
              });
              instance.hide({ transitionOut: "fadeOut" }, toast);
            },
          ],
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
      <section className="ml-[240px] min-h-screen bg-[#f3f4f6]">

        {/* Breadcrumb */}
        <div className="bg-white border-b px-6 py-4">
          <p className="text-2xl font-semibold text-gray-800">
            Home | Sub Sub | <span className='text-violet-500'>View Sub Sub Category</span>
          </p>
        </div>


        {/* ---------------- FILTER BOX ---------------- */}
        <div
          className={`px-1 overflow-hidden transition-all duration-300 ease-out 
              ${openFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
               `}
        >
          <form
            onSubmit={applyFilter}
            className="py-5 relative px-6 my-4 rounded-md border w-full bg-white shadow-sm max-w-[1065px] mx-auto"
          >
            <button
              type="button"
              onClick={() => setOpenFilter(false)}
              className="absolute right-4 cursor-pointer top-4 text-[28px] text-gray-600 hover:text-black"
            >
              <MdOutlineClose />
            </button>

            <p className="font-bold py-2 text-[20px]">FILTER</p>

            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Parent Category Name
              </label>

              <select
                name="parent_category_id"
                className="border-2 border-gray-300 shadow-sm w-full rounded-md px-2 py-1 text-[17px]"
              >
                <option value="">Select Parent Category</option>

                {
                  categories.map((v, i) => {
                    return (
                      <option key={i} value={v._id}>
                        {v.name}
                      </option>
                    )
                  })
                }
              </select>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Sub Category Name
              </label>

              <select
                name="sub_category_id"
                className="border-2 border-gray-300 shadow-sm w-full rounded-md px-2 py-1 text-[17px]"
              >
                <option value="">Select Sub Category</option>

                {
                  subCategories.map((v, i) => {
                    return (
                      <option key={i} value={v._id}>
                        {v.name}
                      </option>
                    )
                  })
                }
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={clearFilter}
                className="text-white cursor-pointer bg-gray-500 hover:bg-gray-600 px-6 py-2.5 rounded-lg"
              >
                Clear
              </button>

              <button
                type="submit"
                className="text-white cursor-pointer bg-purple-700 hover:bg-purple-800 px-6 py-2.5 rounded-lg"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div className="max-w-[1065px] mx-auto py-6 px-2">

          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">

            {/* ---------------- Header ---------------- */}
            <div className="bg-white flex justify-between items-center py-6 px-5">
              <div className="text-[18px] font-bold">View Category</div>

              <div className="flex gap-3 items-center">

                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="w-[38px] h-[38px] rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer"
                >
                  <FaFilter />
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

            {/* ---------------- TABLE ---------------- */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-black">
                <thead className="text-sm uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-4 w-[70px]">
                      <input
                        name="deleteCheck"
                        id="purple-checkbox"
                        type="checkbox"
                        checked={subSubCategories.length == selectedRecord.length ? 'checked' : ''}
                        className="w-4 h-4 cursor-pointer text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        value=""
                      />
                    </th>
                    <th className="px-4 py-4">S. NO.</th>
                    <th className="px-4 py-4">NAME</th>
                    <th className="px-4 py-4">PARENT CATEGORY</th>
                    <th className="px-4 py-4">SUB CATEGORY</th>
                    <th className="px-4 py-4">IMAGE</th>
                    <th className="px-4 py-4">ORDER</th>
                    <th className="px-4 py-4">STATUS</th>
                    <th className="px-4 py-4">ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {
                    subSubCategories.length > 0
                      ?
                      subSubCategories.map((v, i) => {
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

                            {/* parentcategory  */}
                            <td className="px-4 py-3">
                              {v.parent_category_id.name}
                            </td>

                            {/* subcategory  */}
                            <td className="px-4 py-3"> 
                              {v.sub_category_id?.name}
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
                              v.status == true
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
                              <Link to={`/subsubcategory/update/${v._id}`}>
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

            <div className="pt-5 w-[92%] mx-auto">
              <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

