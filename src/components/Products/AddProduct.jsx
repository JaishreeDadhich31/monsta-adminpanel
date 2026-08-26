import { useNavigate, useParams } from 'react-router';
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import Select from "react-select";
import iziToast from "izitoast";
import { Link } from 'react-router';
import axios from 'axios';
import React, { useEffect, useState } from 'react'


export default function AddProduct() {

  let [parentCategories, setparentCategories] = useState([]);
  let [subCategories, setsubCategories] = useState([]);
  let [materials, setMaterials] = useState([]);
  let [parentCategoryId, setParentCategoryId] = useState('');  // use for update 
  let [subCategoryId, setSubCategoryId] = useState('');
  let [materialId, setMaterialId] = useState('');
  let [productId, setProductId] = useState('');   // for update 
  let [productDetails, setProductDetails] = useState('');
  let [colors, setColors] = useState('')
  let [colorsId, setColorsId] = useState('')
  let [errors, setErrors] = useState([]);
  let [SelectedImage, setSelectedImage] = useState("");
  let [productMaterialInfo, setProductMaterialInfo] = useState('');
  let [productColorInfo, setProductColorInfo] = useState('');

  let [subSubCategories, setSubSubCategories] = useState([]);
  const [subSubCategoryId, setSubSubCategoryId] = useState('');

  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    setProductId(params.id)

    if (params.id) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/details/${params.id}`)
        .then((result) => {
          if (result.data._status) {
            console.log(result.data._data.color_id);
            setProductDetails(result.data._data)
            setParentCategoryId(result.data._data.parent_category_id._id)
            setSubCategoryId(result.data._data.sub_category_id._id)
            setSubSubCategoryId(result.data._data.sub_sub_category_id._id)
            setMaterialId(result.data._data.material_id._id)
            setProductMaterialInfo({
              label: result.data._data.material_id.name,
              value: result.data._data.material_id._id
            })

            setProductColorInfo({
              label: result.data._data.color_id.name,
              value: result.data._data.color_id._id
            });


            if (result.data._data.image) {
              setSelectedImage(result.data._image_path + '/' + result.data._data.image)
            }

            if (result.data._data.images && result.data._data.images.length > 0) {
              const multiImages = result.data._data.images.map((img) => ({
                image: result.data._image_path + '/' + img,
                file: null
              }));

              setImageBlocks([...multiImages, { image: null, file: null }]);
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

  }, [params.id])


  // parent-category
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/parent-category`, {
      status: true,
      id: parentCategoryId
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
    if (parentCategoryId) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-category`, {
        status: true,
        // id: subCategoryId,
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
    }

  }, [parentCategoryId])

  //sub-subcategory
  useEffect(() => {
    if (subCategoryId) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/sub-sub-category`, {
        status: true,
        // id: subCategoryId,
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
      id: materialId
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

  // color
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/colors`, {
      status: true,
      id: colorsId
    })
      .then((result) => {
        if (result.data._status) {
          var newdata = result.data._data.map((v) => {
            v.value = v._id,
              v.label = v.name

            return v;
          })
          setColors(newdata);
        }
        else {
          setColors([])
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

  // parentcategory select karnah ke liye 
  const handleParentCategory = (e) => {
    ErrorHandler(e)
    if (e.target.value != '') {
      setParentCategoryId(e.target.value)
    } else {
      setParentCategoryId('')
      setsubCategories([])
    }
  }

  const handleSubCategory = (e) => {
    ErrorHandler(e)
    if (e.target.value != '') {
      setSubCategoryId(e.target.value)
    } else {
      setSubCategoryId('')
      setsubCategories([])
    }
  }

  let [imageBlocks, setImageBlocks] = useState([
    { image: null, file: null }
  ]);

  let pageNavigate = useNavigate()


  let handleSingleImagechange = (event) => {
    const file = event.target.files[0];
    ErrorHandler(event);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleMultipleImageChange = (e, index) => {
    const file = e.target.files[0];

    ErrorHandler(e);

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const updated = [...imageBlocks];

      updated[index].image = reader.result;
      updated[index].file = file;

      // last block pe image select hui → new block add
      if (index === imageBlocks.length - 1) {
        updated.push({ image: null, file: null });
      }

      setImageBlocks(updated);

      setErrors(errors.filter(e => e !== "multi_image"));
    };

    reader.readAsDataURL(file);
  };


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
  let handleSubmit = (e) => {

    e.preventDefault();

    let form = e.target;

    let fields = form.querySelectorAll(
      "input, textarea, select"
    );

    let newErrors = [];

    fields.forEach((field) => {

      if (
        field.name &&
        field.type !== "file" &&
        !field.value.trim()
      ) {
        newErrors.push(field.name);
      }

    });


    // single image check
    if (!SelectedImage) {
      newErrors.push("image");
    }


    // multiple image check
    const hasImage = imageBlocks.some(
      (b) => b.image !== null
    );

    if (!hasImage) {
      newErrors.push("multi_image");
    }


    newErrors = [...new Set(newErrors)];

    setErrors(newErrors);


    if (newErrors.length === 0) {

      if (productId) {
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/product/update/${productId}`,
          event.target)
          .then((result) => {
            console.log(result.data)
            if (result.data._status == true) {
              e.target.reset()
              pageNavigate('/products/view-product')
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
          .catch((error) => {
            console.log(error)
            iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
          })
      } else {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/create`,
          event.target
        )
          .then((result) => {

            if (result.data._status == true) {
              e.target.reset()
              pageNavigate('/products/view-product')
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
          .catch((err) => {

            console.log("error", err)
            iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
          })
      }
    }
  };


  const handleRemoveBlock = (index) => {
    const updated = imageBlocks.filter((_, i) => i !== index);

    // kam se kam 1 block rehna chahiye
    if (updated.length === 0) {
      setImageBlocks([{ image: null, file: null }]);
    } else {
      setImageBlocks(updated);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 ml-64">

      {/* Breadcrumb */}
      <nav className="flex border-b bg-white shadow-sm" aria-label="Breadcrumb">
        <ol className="p-3 px-6 inline-flex text-2xl items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="text-md font-medium text-red-900 hover:text-lime-800">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/product/add" className="text-md font-medium text-red-900 hover:text-lime-800">
                Product / {productId ? 'Update Product' : 'Add Product'}
              </Link>
            </div>
          </li>
        </ol>
      </nav>


      {/* BODY */}
      <div className="w-full min-h-[680px] px-5 bg-slate-50 py-10">

        <div className="mx-auto">

          <h3
            className="text-[24px] font-semibold bg-gradient-to-r from-purple-600 to-purple-500
                       py-3 px-5 rounded-t-lg text-white border border-indigo-500"
          >
            {
              productId ? 'Update Product' : 'Add Product'
            }
          </h3>


          <form
            onSubmit={handleSubmit}
            className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm"
          >
            <div className='flex gap-3'>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Parent Category</label>
                <select onChange={handleParentCategory} name="parent_category_id" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Parent Category</option>

                  {
                    parentCategories.map((v, i) => {
                      return (
                        <option value={v._id} key={i} selected={parentCategoryId == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }


                </select>
                {errors.includes("parent_category_id") && <p className="text-red-600 text-sm mt-1">Parent category is required</p>}
              </div>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Sub Category</label>
                <select onChange={handleSubCategory} name="sub_category_id" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Sub Category</option>

                  {
                    subCategories.map((v, i) => {
                      return (
                        <option value={v._id} selected={subCategoryId == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }
                </select>
                {errors.includes("sub_category_id") && <p className="text-red-600 text-sm mt-1">Sub category is required</p>}
              </div>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Sub Sub Category</label>
                <select onChange={ErrorHandler} name="sub_sub_category_id" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Sub Sub Category</option>

                  {
                    subSubCategories.map((v, i) => {
                      return (
                        <option value={v._id} selected={subSubCategoryId == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }

                </select>
                {errors.includes("sub_sub_category_id") && <p className="text-red-600 text-sm mt-1">Sub Sub category is required</p>}
              </div>

            </div>

            <div className='flex gap-3'>
              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Product Name</label>
                <input type="text" defaultValue={productDetails.name} name="name" onKeyUp={ErrorHandler} placeholder="Enter product name" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("name") && <p className="text-red-600 text-sm mt-1">Product name is required</p>}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Product Type</label>
                <select onChange={ErrorHandler} name="product_type" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Product Type</option>
                  <option value='1' selected={productDetails.product_type == 1 ? 'selected' : ''}>Featured</option>
                  <option value='2' selected={productDetails.product_type == 2 ? 'selected' : ''} >New Arrivals</option>
                  <option value='3' selected={productDetails.product_type == 3 ? 'selected' : ''}>On Sale</option>
                </select>
                {errors.includes("product_type") && <p className="text-red-600 text-sm mt-1">Product Type is required</p>}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Materials
                </label>

                <Select
                  options={materials}
                  name='material_id'
                  value={productMaterialInfo}
                  onChange={(value) => {
                    setProductMaterialInfo(value);
                    setMaterialId(value.value);

                    if (value.value) {
                      setErrors(errors.filter(e => e !== "materials"));
                    }
                  }}
                />
                {errors.includes("material_id") && (
                  <p className="text-red-600 text-sm mt-1">
                    Materials required
                  </p>
                )}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Colors
                </label>

                <Select
                  options={colors}
                  name='color_id'
                  value={productColorInfo}
                  onChange={(value) => {
                    setProductColorInfo(value)
                    setColorsId(value.value);
                    if (value.value) {
                      setErrors(errors.filter(e => e !== "colors"));
                    }
                  }}
                />

                {errors.includes("color_id") && (
                  <p className="text-red-600 text-sm mt-1">
                    Colors required
                  </p>
                )}

              </div>
            </div>

            <div className='flex gap-3'>
              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Is Trending</label>
                <select onChange={ErrorHandler} name="is_trending" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Is Trending</option>
                  <option value='1' selected={productDetails.is_trending == 1 ? 'selected' : ''}>Yes</option>
                  <option value='2' selected={productDetails.is_trending == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.includes("is_trending") && <p className="text-red-600 text-sm mt-1">Is Trending required</p>}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Is Best Selling</label>
                <select onChange={ErrorHandler} name="is_best_sellings" className="text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3">
                  <option value=''>Select Is Best Selling</option>
                  <option value='1' selected={productDetails.is_best_sellings == 1 ? 'selected' : ''}>Yes</option>
                  <option value='2' selected={productDetails.is_best_sellings == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.includes("is_best_sellings") && <p className="text-red-600 text-sm mt-1">Is Best Selling required</p>}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Product Code</label>
                <input type="text" defaultValue={productDetails.product_code} name="product_code" onKeyUp={ErrorHandler} placeholder="Enter product code" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("product_code") && <p className="text-red-600 text-sm mt-1">Product code is required</p>}
              </div>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Dimension</label>
                <input type="text" defaultValue={productDetails.dimension} name="dimension" onKeyUp={ErrorHandler} placeholder="Enter Dimension" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("dimension") && <p className="text-red-600 text-sm mt-1">Dimension is required</p>}
              </div>
            </div>

            <div className='flex gap-3'>

              <div className="mb-6 basis-[25%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Estimate Delivery Days</label>
                <input type="text" defaultValue={productDetails.estimate_delivery_days} name="estimate_delivery_days" onKeyUp={ErrorHandler} placeholder="Enter Estimate Delivery Days" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("estimate_delivery_days") && <p className="text-red-600 text-sm mt-1">Estimate Delivery Days is required</p>}
              </div>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Actual Price</label>
                <input type="number" defaultValue={productDetails.actual_price} name="actual_price" min={1} onKeyUp={ErrorHandler} placeholder="Enter actual price" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("actual_price") && <p className="text-red-600 text-sm mt-1">Actual Price is required</p>}
              </div>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Sale Price</label>
                <input type="number" defaultValue={productDetails.sale_price} name="sale_price" min={1} onKeyUp={ErrorHandler} placeholder="Enter sale price" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("sale_price") && <p className="text-red-600 text-sm mt-1">Sale Price is required</p>}
              </div>

              <div className="mb-6 basis-[33%]">
                <label className="block mb-2 text-md font-medium text-gray-700">Order</label>
                <input type="number" defaultValue={productDetails.order} name="order" min={1} onKeyUp={ErrorHandler} placeholder="Enter order" className="text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
                {errors.includes("order") && <p className="text-red-600 text-sm mt-1">Order is required</p>}
              </div>
            </div>

            <div className='mb-6'>
              <label className="block mb-2 text-md font-medium text-gray-700">Short Description</label>
              <textarea name="short_description" defaultValue={productDetails.short_description} onKeyUp={ErrorHandler} placeholder="Enter short description" className="  text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
              {errors.includes("short_description") && <p className="text-red-600 text-sm mt-1">Short description is required</p>}
            </div>

            <div className='mb-6'>
              <label className="block mb-2 text-md font-medium text-gray-700"> Long Description</label>
              <textarea name="long_description" defaultValue={productDetails.long_description} onKeyUp={ErrorHandler} placeholder="Enter long description" className="text-[17px] min-h-[150px] border border-gray-300 rounded-lg block w-full py-2.5 px-3" />
              {errors.includes("long_description") && <p className="text-red-600 text-sm mt-1"> Long Description is required</p>}
            </div>

            <div className='flex mb-6 flex-col'>
              <label className="block mb-2 text-md font-medium text-gray-700">
                Image
              </label>

              <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">

                {!SelectedImage && (
                  <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">

                    <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                    <div className="absolute inset-0 bg-gradient-to-r 
                                    from-transparent via-white/40 to-transparent  animate-[shimmer_1.8s_linear_infinite]">
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
                  onChange={handleSingleImagechange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {errors.includes("image") && (
                <p className="text-red-600 text-sm mt-1">Image is required</p>
              )}
            </div>

            <div className="flex  mb-6 flex-col">
              <label className="block mb-2 text-md font-medium text-gray-700">
                Multiple Images
              </label>

              <div className="flex flex-wrap gap-5">

                {imageBlocks.map((block, index) => (

                  <div key={index} className="relative">

                    {/* remove button */}
                    {block.image && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(index)}
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>
                    )}

                    <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">

                      {!block.image && (
                        <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">

                          <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                          <div className="absolute inset-0 bg-gradient-to-r 
                                          from-transparent via-white/40 to-transparent
                                           animate-[shimmer_1.8s_linear_infinite]">
                          </div>

                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <MdOutlineDriveFolderUpload
                              className="text-slate-600"
                              size={55}
                            />
                            <div className="w-28 h-3 bg-slate-400 rounded-full"></div>
                            <div className="w-20 h-3 bg-slate-400 rounded-full"></div>
                          </div>

                        </div>
                      )}

                      {block.image && (
                        <img
                          src={block.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}

                      <input
                        type="file"
                        name='images'
                        accept="image/*"
                        onChange={(e) => handleMultipleImageChange(e, index)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />

                    </div>

                  </div>

                ))}

              </div>

              {errors.includes("multi_image") && (
                <p className="text-red-600 text-sm mt-1">
                  At least one image required
                </p>
              )}
            </div>



            <div className='flex justify-end'>
              <button type="submit" className="mt-3 text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all">{
                productId ? 'Update' : 'Submit'
              }</button>
            </div>

          </form>
        </div>
      </div>
    </section>
  )
}
