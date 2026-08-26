import React, { useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import iziToast from "izitoast";
import Select from "react-select";
import { Link } from "react-router";
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import 'izitoast/dist/css/iziToast.min.css';



export default function ViewProducts() {
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({});
  let [deatailpopup, setdeatailpopup] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  let [colors, setColors] = useState([]);
  let [parentCategories, setparentCategories] = useState([]);
  let [subCategories, setsubCategories] = useState([]);
  let [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  let [parentCategoryId, setParentCategoryId] = useState('');  // use for update
  let [subCategoryId, setSubCategoryId] = useState('');
  const [totalPages, setTotalPages] = useState(2);
  const [apiStatus, setApiStatus] = useState();
  const [imagePath, setImagePath] = useState('');
  const [products, setProducts] = useState([]);
  let [subSubCategories, setSubSubCategories] = useState([]);
  const [subSubCategoryId, setSubSubCategoryId] = useState('');

  const filterProducts = (items, filters) => items.filter((product) => {
    const name = filters?.name?.trim().toLowerCase();
    const materialId = product.material_id?._id || product.material_id;
    const actualPrice = Number(product.actual_price);
    const priceFrom = filters?.price_from === '' || filters?.price_from === undefined
      ? null
      : Number(filters.price_from);
    const priceTo = filters?.price_to === '' || filters?.price_to === undefined
      ? null
      : Number(filters.price_to);

    return (!name || product.name?.toLowerCase().includes(name))
      && (!filters?.material_id || materialId === filters.material_id)
      && (priceFrom === null || actualPrice >= priceFrom)
      && (priceTo === null || actualPrice <= priceTo);
  });

  // parent-category
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/parent-category`, {
      status: true,
    })
      .then((result) => {
        if (result.data._status) {
          setparentCategories(result.data._data);
        }
        else {
          setparentCategories([])
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

  }, [])


  //sub-category
  useEffect(() => {

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-category`, {
      status: true,
      parent_category_id: parentCategoryId
    })
      .then((result) => {
        if (result.data._status) {
          setsubCategories(result.data._data);
        }
        else {
          setsubCategories([])
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
  }, [parentCategoryId])


  //sub-subcategory
  useEffect(() => {
    if (subCategoryId) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-sub-category`, {
        status: true,
        sub_category_id: subCategoryId,
        parent_category_id: parentCategoryId
      })
        .then((result) => {
          if (result.data._status) {
            setSubSubCategories(result.data._data);
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
    }

  }, [parentCategoryId, subCategoryId])


  // Material
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/materials`, {
      status: true,
    })
      .then((result) => {
        if (result.data._status) {
          var newdata = result.data._data.map((v) => {
            v.value = v._id,
              v.label = v.name

            return v;
          })
          setMaterials(newdata);
        }
        else {
          setMaterials([])
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

  }, [])


  const handleParentCategory = (e) => {
    if (e.target.value !== '') {
      setParentCategoryId(e.target.value)
      setSubCategoryId('')
      setSubSubCategories([])
    } else {
      setParentCategoryId('')
      setSubCategoryId('')
      setsubCategories([])
      setSubSubCategories([])
    }
  }

  const handleSubCategory = (e) => {
    if (e.target.value !== '') {
      setSubCategoryId(e.target.value)
    } else {
      setSubCategoryId('')
      setSubSubCategories([])
    }
  }

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/view`, {
      page: currentPage,
      parent_category_id: filterData?.parent_category_id,
      sub_category_id: filterData?.sub_category_id,
      sub_sub_category_id: filterData?.sub_sub_category_id

    })
      .then((result) => {
        if (result.data._status == true) {
          setProducts(filterProducts(result.data._data, filterData))
          setTotalPages(result.data._paginate.total_page || 1)
          setImagePath(result.data._image_path)
        }
        else {
          setProducts([]);
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
      parent_category_id: e.target.parent_category_id.value,
      sub_category_id: e.target.sub_category_id.value,
      sub_sub_category_id: e.target.sub_sub_category_id.value,
      material_id: selectedMaterial?.value || '',
      price_from: e.target.price_from.value,
      price_to: e.target.price_to.value

    };

    setFilterData(obj);
  };


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
    if (products.length == selectedRecord.length) {
      setSelectedRecord([]);
    }
    else {
      setSelectedRecord([]);

      var checkBoxValue = [];
      products.forEach(element => {
        checkBoxValue.push(element._id)
      });
      setSelectedRecord([...checkBoxValue]);
    }
  }


  const changeStatus = () => {
    if (selectedRecord.length > 0) {

      axios.put(`${import.meta.env.VITE_API_BASE_URL}/product/change-status`, {
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

              axios.put(`${import.meta.env.VITE_API_BASE_URL}/product/delete`, {
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

  const [productDetails, setProductDetails] = useState(null);

  const getProductDetails = (product_id) => {

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/details/${product_id}`)
      .then((result) => {
        if (result.data._status) {
          setProductDetails(result.data._data)
          setdeatailpopup(true)
        }
        else {
          iziToast.error({
            title: 'Error',
            message: result.data._message,
            position: 'topRight'
          });
        }
      })
      .catch((err) => {
        console.log(err)
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong',
          position: 'topRight'
        });
      });
  }


  return (
    <>
      <DetailPopUp deatailpopup={deatailpopup} setdeatailpopup={setdeatailpopup} productDetails={productDetails} imagePath={imagePath} />
      <div className="min-h-screen  ml-64">

        {/* Breadcrumb */}
        <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
          <ol className="inline-flex items-center space-x-2 text-gray-600">
            <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a className="text-md font-medium hover:text-indigo-600">Product</a></li>
            <li>/</li>
            <li className="text-md font-medium text-gray-900">View Product</li>
          </ol>
        </nav>

        {/* FILTER */}
        <div
          className={`p-4 overflow-hidden transition-all duration-300 ease-out 
                    ${openFilter ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-3">
                <label className="block mb-2 font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter Name"
                  className="text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Parent Category</label>
                <select
                  onChange={handleParentCategory}
                  name="parent_category_id"
                  className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                >
                  <option value="">Select Parent Category</option>
                  {
                    parentCategories.map((v, i) => {
                      return <option value={v._id} key={i}>{v.name}</option>
                    })
                  }
                </select>
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Sub Category</label>
                <select
                  onChange={handleSubCategory}
                  name="sub_category_id"
                  className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                >
                  <option value="">Select Sub Category</option>
                  {
                    subCategories.map((v, i) => {
                      return <option value={v._id} key={i}>{v.name}</option>
                    })
                  }
                </select>
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Sub Sub Category</label>
                <select
                  name="sub_sub_category_id"
                  className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3"
                >
                  <option value="">Select Sub Sub Category</option>
                  {
                    subSubCategories.map((v, i) => {
                      return <option value={v._id} key={i}>{v.name}</option>
                    })
                  }
                </select>
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Materials</label>
                <Select
                  options={materials}
                  name="material_id"
                  value={selectedMaterial}
                  onChange={setSelectedMaterial}
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Price from</label>
                <input
                  type="number"
                  name="price_from"
                  placeholder="Enter price"
                  className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-medium text-gray-700">Price to</label>
                <input
                  type="number"
                  name="price_to"
                  placeholder="Enter price"
                  className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3"
                />
              </div>

            </div>

            <div className="flex items-center gap-3 pt-6">
              <button
                type="reset"
                onClick={() => {
                  setFilterData({});
                  setSelectedMaterial(null);
                  setParentCategoryId('');
                  setSubCategoryId('');
                  setsubCategories([]);
                  setSubSubCategories([]);
                  setCurrentPage(1);
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
        <div className="p-4">

          {/* Header */}
          <div className="bg-slate-100 flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300">
            <div className="text-[26px] font-semibold">View Product</div>

            <div className="flex gap-3 items-center">

              {/* Filter */}
              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="w-[38px] h-[38px] rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer"
              >
                <FaFilter />
              </button>

              {/* Status */}
              <button
                onClick={changeStatus}
                disabled={selectedRecord.length === 0}
                className="text-white  bg-red-500 hover:bg-red-600
                             text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
              >
                Change Status
              </button>

              {/* Delete */}
              <button
                onClick={deleteRecords}
                disabled={selectedRecord.length === 0}
                className="text-white bg-green-500 hover:bg-green-600 
                             text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all"
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
                        checked={products.length == selectedRecord.length ? 'checked' : ''}
                        onClick={selectAllCheckBox}
                        className="mr-2 w-4 h-4 cursor-pointer text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      Select
                    </th>
                    <th className="px-2 w-[60px] py-3">S. No.</th>
                    <th className="px-2 py-3">Name</th>
                    <th className="px-2 py-3">Category Details</th>
                    <th className="px-2 py-3">Material</th>
                    <th className="px-2 w-[100px] py-3">Product Type</th>
                    <th className="px-2 w-[100px] py-3">Image</th>
                    <th className="px-2 w-[100px] py-3">Actual Price</th>
                    <th className="px-2 w-[100px] py-3">Sale Price</th>
                    <th className="px-2 w-[50px] py-3">Order</th>
                    <th className="px-2 w-[100px] py-3">Status</th>
                    <th className="px-2 w-[100px] py-3">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {
                    products.length > 0
                      ?
                      products.map((v, i) => {
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

                            {/* parent category  */}
                            <td className="px-4 py-3">
                              <span className="text-black font-normal">
                                {v.parent_category_id?.name} {'>>'}  {v.sub_category_id?.name}  {'>>'} {v.sub_sub_category_id?.name}
                              </span>
                            </td>

                            {/* materials  */}
                            <td className="px-4 py-3">
                              <span className="text-black font-normal">
                                {v.material_id.name}
                              </span>
                            </td>

                            {/* product - type  */}
                            <td className="px-4 py-3">
                              <span className="text-black font-normal">
                                {

                                  v.product_type == 1
                                    ?
                                    <>Featured</>
                                    :
                                    v.product_type == 2
                                      ?
                                      'New Arrivals'
                                      :
                                      'On Sale'
                                }
                              </span>
                            </td>

                            {/* Image */}
                            <td className="px-4 py-3">

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

                            {/* Actual Price */}
                            <td className="px-4 py-3">
                              {v.actual_price}
                            </td>

                            {/* Sale Price */}
                            <td className="px-4 py-3">
                              {v.sale_price}
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
                              <TbListDetails className="cursor-pointer" onClick={() => getProductDetails(v._id)} />
                              <Link to={`/products/update/${v._id}`}>
                                <FaPen />
                              </Link>
                            </td>

                          </tr>
                        )
                      })
                      :
                      <tr className="border-b border-gray-400">
                        <td colSpan={12} className="px-4 py-3 text-center font-bold">
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
      </div>
    </>
  );
}


function DetailPopUp({ deatailpopup, setdeatailpopup, productDetails, imagePath }) {
  if (!deatailpopup || !productDetails) return null;

  const additionalImages = Array.isArray(productDetails.images)
    ? productDetails.images.filter(Boolean)
    : [];
  const colorName = productDetails.color_id?.name || productDetails.color_id || 'N/A';

  return (

    <>
      <div
        className={`${deatailpopup ? "" : "hidden"
          } fixed inset-0 z-50 flex items-center justify-center bg-black/40`}
      >
        <div className="w-[90%] max-w-6xl bg-white rounded-lg shadow-lg">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-100 rounded-t-lg">
            <h2 className="text-[22px] font-semibold text-gray-800">
              Product Details
            </h2>

            <button
              onClick={() => setdeatailpopup(false)}
              className="text-gray-600 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>

          {/* BODY */}

          <div className="p-6 grid grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">

            {/* MAIN IMAGE */}
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              <img
                className="w-full h-[250px] object-cover rounded"
                src={productDetails.image ? `${imagePath}/${productDetails.image}` : ''}
                alt="product"
              />
            </div>

            {/* MULTIPLE IMAGES */}
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm flex flex-wrap gap-3 content-start">
              {additionalImages.length > 0 ? additionalImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  className="w-24 h-24 object-cover rounded"
                  src={`${imagePath}/${image}`}
                  alt={`Product ${index + 1}`}
                />
              )) : <span className="text-gray-500">No additional images</span>}
            </div>

            {/* DETAILS */}
            <div className="border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-center text-[20px] font-semibold text-gray-800 mb-4">
                Product Info
              </h3>

              <ul className="space-y-3 text-[16px]">

                <li>
                  <span className="font-semibold">Parent Name:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.parent_category_id?.name}</span>
                </li>

                <li>
                  <span className="font-semibold">Sub Category Name:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.sub_category_id?.name}</span>
                </li>

                <li>
                  <span className="font-semibold">Sub Sub Category Name:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.sub_sub_category_id?.name}</span>
                </li>

                <li>
                  <span className="font-semibold">Product Name:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.name}</span>
                </li>

                <li>
                  <span className="font-semibold"> Actual Price:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.actual_price}</span>
                </li>

                <li>
                  <span className="font-semibold"> Sale Price:</span>
                  <span className="ml-2 text-gray-700">{productDetails?.sale_price}</span>
                </li>

                <li>
                  <span className="font-semibold">Material</span>
                  <span className="ml-2 text-gray-700">{productDetails?.material_id?.name}</span>
                </li>

                <li>
                  <span className="font-semibold">Is trending</span>
                  <span className="ml-2 text-gray-700">{productDetails?.is_trending}</span>
                </li>

                <li>
                  <span className="font-semibold">Is Best Selling</span>
                  <span className="ml-2 text-gray-700">{productDetails?.is_best_sellings}</span>
                </li>

                <li>
                  <span className="font-semibold">Short Description</span>
                  <span className="ml-2 text-green-600 font-medium">{productDetails?.short_description}</span>
                </li>

                <li>
                  <span className="font-semibold">Long Description</span>
                  <span className="ml-2 text-gray-700">{productDetails?.long_description}</span>
                </li>

                <li>
                  <span className="font-semibold">Product Code</span>
                  <span className="ml-2 text-gray-700">{productDetails?.product_code}</span>
                </li>

                <li>
                  <span className="font-semibold">Dimension</span>
                  <span className="ml-2 text-gray-700">{productDetails?.dimension}</span>
                </li>

                <li>
                  <span className="font-semibold">Estimate Delivery Days</span>
                  <span className="ml-2 text-gray-700">{productDetails?.estimate_delivery_days}</span>
                </li>

                <li>
                  <span className="font-semibold">Order</span>
                  <span className="ml-2 text-gray-700">{productDetails?.order}</span>
                </li>

                <li>
                  <span className="font-semibold">Color:</span>
                  <span className="ml-2 text-blue-600 font-medium">{colorName}</span>
                </li>

              </ul>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
            <button
              onClick={() => setdeatailpopup(false)}
              className="px-5 py-2 bg-red-800 hover:bg-slate-600 text-white rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </>
  )
}
