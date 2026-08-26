import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useNavigate, useParams } from 'react-router';

export default function AddSubSubCategory() {

  let [errors, setErrors] = useState([]);
  let [SelectedImage, setSelectedImage] = useState("");
  let [categories, setCategories] = useState([]);
  let [parent_category_id, setparent_category_id] = useState('');   //for update
  const [subCategoryId, setSubCategoryId] = useState('');// api response
  const [subCategoryDetails, setSubCategorylDetails] = useState({});
  let [subcategories, setSubCategories] = useState([]);
  const [subSubCategorydetails, setsubSubCategorydetails] = useState({});
  const [subSubCategoryId, setsubSubCategoryId] = useState('');

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/parent-category`, {
      status: true,
      id: parent_category_id
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
  }, [parent_category_id])


  useEffect(() => {
    if(parent_category_id){
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/sub-category`, {
      status: true,
      parent_category_id: parent_category_id
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
  }  
  }, [parent_category_id])

  const handleParentCategory = (e) => {
    ErrorHandler(e)
    if (e.target.value != '') {
      setparent_category_id(e.target.value)
    } else {
      setparent_category_id('')
      setSubCategories([])
    }
  }


  let handleimagechange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const pageNavigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    setsubSubCategoryId(params.id);                  //params update ke liye

    if (params.id) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/details/${params.id}`)
        .then((result) => {
          if (result.data._status) {
            setsubSubCategorydetails(result.data._data)
            setparent_category_id(result.data._data.parent_category_id)
            setSubCategoryId(result.data._data.sub_category_id)
            if (result.data._data.image) {
              setSelectedImage(result.data._image_path + '/' + result.data._data.image)
            }

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
  }, [params])

  let ErrorHandler = (event) => {

    let fieldName = event.target.name;
    let value = event.target.value;

    if (!value || value.trim() === "") {

      if (!errors.includes(fieldName)) {
        setErrors([...errors, fieldName]);
      }

    } else {

      let updated = errors.filter((v) => v !== fieldName);
      setErrors(updated);

    }
  };

  let formhandler = (event) => {
    event.preventDefault();

    let form = event.target;
    let fields = form.querySelectorAll('input , textarea , select')

    let newErrors = [];

    fields.forEach((field) => {
      if (field.type !== 'file' && !field.value.trim()) {
        newErrors.push(field.name);
      }
    });

    if (!SelectedImage) {
      newErrors.push("image");
    }

    newErrors = [...new Set(newErrors)];
    setErrors(newErrors);

    if (newErrors.length === 0) {

      // Keep a snapshot of the form before any reset. Passing the live form
      // element to axios and resetting it immediately could make axios send
      // empty values for every field.
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      formData.set('name', name);
      formData.set('slug', slug);

      if (subSubCategoryId) {
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/update/${subSubCategoryId}`,
          formData)
          .then((result) => {
            console.log(result.data)
            if (result.data._status == true) {
              form.reset()
              pageNavigate('/subsubcategory/view-category')
              iziToast.success({
                title: 'Success',
                message: result.data._message,
                position: 'topRight'
              });
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
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/sub-sub-category/create`,
          formData
        )
          .then((result) => {
            if (result.data._status == true) {
              form.reset()
              pageNavigate('/subsubcategory/view-category')
              iziToast.success({
                title: 'Success',
                message: result.data._message,
                position: 'topRight'
              });
            } else {
              iziToast.error({
                title: 'Error',
                message: result.data._message,
                position: 'topRight'
              });
            }
          })
          .catch((error) => {
             console.log(error);
            iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
          })
      }
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-100 ml-64 p-6 rounded-lg">

        {/* Breadcrumb */}
        <div className="bg-white border-b px-6 py-4 mb-6">
          <p className="text-2xl font-semibold text-gray-800"> Home | Sub Sub | <span className='text-violet-500'>
            {
              subSubCategoryId ? 'Update Sub Sub Category' : 'Add Sub Sub Category'
            }</span></p>
        </div>

        {/* Body */}
        <div className="w-full min-h-[680px] px-5 bg-slate-50 py-10">
          <div className="mx-auto">

            <h3 className="text-[24px] font-semibold
              bg-purple-700
                py-3 px-5 rounded-t-lg text-white border border-purple-700">
              {
                subSubCategoryId ? 'Update Sub Sub Category' : 'Add Sub Sub Category'
              }
            </h3>

            <form
              onSubmit={formhandler}
              className="border border-slate-200 border-t-0 gap-6 flex bg-white p-6 rounded-b-lg shadow-sm"
            >
              {/* IMAGE AREA */}
              <div className='flex flex-col'>
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Image
                </label>

                <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">

                  {!SelectedImage && (
                    <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">

                      <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                        animate-[shimmer_1.8s_linear_infinite]">
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <MdOutlineDriveFolderUpload className="text-slate-600" size={55} />
                        <div className="w-28 h-3 bg-slate-400 rounded-full"></div>
                        <div className="w-20 h-3 bg-slate-400 rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {SelectedImage && (
                    <img
                      src={SelectedImage}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  )}

                  <input
                    type="file"
                    name='image'
                    accept="image/*"
                    onChange={handleimagechange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {errors.includes("image") && (
                  <p className="text-red-600 text-sm mt-1">image is required</p>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className='w-full'>

                {/* Select Category */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Select Parent Category
                  </label>

                  <select
                    onChange={handleParentCategory}
                    name="parent_category_id"
                    defaultValue={subSubCategorydetails.parent_category_id}
                    className="text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg 
                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                    block w-full py-2.5 px-3"
                  >
                    <option value="">Select Category</option>
                    {
                      categories.map((v, i) => {
                        return (
                          <option value={v._id} selected={v._id == parent_category_id ? 'selected' : ''}>{v.name}</option>
                        )
                      })
                    }

                  </select>

                  {errors.includes("parent_id") && (
                    <p className="text-red-600 text-sm mt-1">parent-category is required</p>
                  )}
                </div>

                {/* Select Sub Category */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Select Sub Category
                  </label>

                  <select
                    onChange={ErrorHandler}
                    name="sub_category_id"
                    defaultValue=""
                    className="text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg 
                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                    block w-full py-2.5 px-3"
                  >
                    <option value="">Select Category</option>
                    {
                      subcategories.map((v, i) => {
                        return (
                          <option value={v._id} selected={v._id == subCategoryId ? 'selected' : ''}>{v.name}</option>
                        )
                      })
                    }
                  </select>

                  {errors.includes("parent_id") && (
                    <p className="text-red-600 text-sm mt-1">parent-category is required</p>
                  )}
                </div>

                {/*  Category Name */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    defaultValue={subSubCategorydetails.name}
                    autoComplete="off"
                    onKeyUp={ErrorHandler}
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                              focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                              block w-full py-2.5 px-3"
                    placeholder="Enter category name"
                  />

                  {errors.includes("name") && (
                    <p className="text-red-600 text-sm mt-1">Name is required</p>
                  )}
                </div>


                {/* Order */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    defaultValue={subSubCategorydetails.order}
                    min={1}
                    autoComplete="off"
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-2.5 px-3"
                    placeholder="Enter order number"
                  />
                </div>

                <div className='flex justify-end'>
                  <button
                    type="submit"
                    className="mt-3 cursor-pointer text-white 
                               bg-violet-600 hover:bg-violet-600
                                 focus:ring-4 focus:ring-indigo-300
                                 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
                  >
                    {

                      subSubCategoryId ? 'Update' : 'Submit'

                    }
                  </button>
                </div>

              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}




























