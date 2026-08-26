import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { MdOutlineDriveFolderUpload } from "react-icons/md";


export default function AddWhyChooseUs() {

    let [SelectedImage, setSelectedImage] = useState("");
     let [errors, setErrors] = useState([]);

    let handleimagechange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);

            let updated = errors.filter((v) => v !== 'image');
                setErrors(updated);

            };
            reader.readAsDataURL(file);
        }
    };

    const [whychooseusId, setWhyChooseUsId] = useState('');

    // api response
    const [whychooseusDetails, setWhyChooseUsDetails] = useState({});

    const pageNavigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        setWhyChooseUsId(params.id);                  //params update ke liye

        if (params.id) {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/whychooseus/details/${params.id}`)
                .then((result) => {
                    if (result.data._status) {
                        setWhyChooseUsDetails(result.data._data)
                        if(result.data._data.image){
                            setSelectedImage(
                                `${result.data._image_path || 'http://localhost:5000/uploads/whychooseus'}/${result.data._data.image}`
                            )
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


    let formhandler = (event) => {
        event.preventDefault();

        let form = event.target;
        let fields = form.querySelectorAll('input')

        let newErrors = [];

        fields.forEach((field) => {
            if(field.name != 'image'){
                if (!field.value.trim()) {
                newErrors.push(field.name);
                }
            }
            
        });

         if (!SelectedImage) {
                newErrors.push("image");
            }

        newErrors = [...new Set(newErrors)];
        setErrors(newErrors);

        if (newErrors.length === 0) {

            if (whychooseusId) {
                axios.put(`${import.meta.env.VITE_API_BASE_URL}/whychooseus/update/${whychooseusId}`,
                    event.target)
                    .then((result) => {
                        console.log(result.data)
                        if (result.data._status == true) {
                            event.target.reset()
                            pageNavigate('/why choose us/view-why-choose-us')
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
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/whychooseus/create`, 
                    event.target
                )
                    .then((result) => {
                        if (result.data._status == true) {
                            event.target.reset()
                            pageNavigate('/why choose us/view-why-choose-us')
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
                    .catch(() => {
                        iziToast.error({
                            title: 'Error',
                            message: 'Something went wrong',
                            position: 'topRight'
                        });
                    })
            }
        }
    };


    let ErrorHandler = (event) => {
        let fieldName = event.target.name;

        if (event.target.value === "") {

            if (!errors.includes(fieldName)) {
                setErrors([...errors, fieldName]);
            }

        } else {

            let updated = errors.filter((v) => v !== fieldName);
            setErrors(updated);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gray-100 ml-64 p-6 rounded-lg">

                {/* Breadcrumb */}
                <div className="bg-white border-b px-6 py-4 mb-6">
                    <p className="text-2xl font-semibold text-gray-800">
                        Home | Parent | <span className='text-violet-500'>{whychooseusId ? 'Update Why Choose Us' : 'Add Why Choose Us'}</span>
                    </p>
                </div>

                {/* Header */}
                <div className="bg-lime-500 p-6 ">
                    <h2 className="text-2xl font-bold text-white">{whychooseusId ? 'Update Why Choose Us' : 'Add Why Choose Us'}</h2>
                </div>

                <section className="bg-white px-6 py-8 rounded-b-lg">
                    <div className=" min-h-[430px] px-10 bg-white py-10">
                        <form
                            onSubmit={formhandler}
                            className="flex gap-12 bg-white"
                        >
                            {/* IMAGE AREA */}
                            <div className="flex flex-col w-[300px]">
                                <label className="block mb-3 text-md font-medium text-gray-700">
                                    Image
                                </label>

                                <div className="relative w-[280px] h-[280px] border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">
                                    {!SelectedImage && (
                                        <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4">
                                            <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>

                                            <div
                                                className="absolute inset-0 bg-gradient-to-r 
                                                from-transparent via-white/40 to-transparent
                                                animate-[shimmer_1.8s_linear_infinite]"
                                            ></div>

                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <MdOutlineDriveFolderUpload className="text-slate-600" size={60} />
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
                                    <p className="text-red-600 text-sm mt-1">Image is required</p>
                                )}
                            </div>

                            {/* FORM FIELDS */}
                            <div className="flex-1 max-w-[700px] pt-8">
                                <div className="mb-7">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue = {whychooseusDetails.name}
                                        autoComplete="off"
                                        onKeyUp={ErrorHandler}
                                        className="text-[16px] border border-slate-300 text-gray-900 rounded-lg 
                                          focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                          block w-full py-3 px-4 shadow-sm"
                                                                      placeholder="Enter title name"
                                    />

                                    {errors.includes("name") && (
                                        <p className="text-red-600 text-sm mt-1">Title is required</p>
                                    )}
                                </div>

                                <div className="mb-7">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Order
                                    </label>

                                    <input
                                        type="number"
                                        onKeyUp={ErrorHandler}
                                        defaultValue = {whychooseusDetails.order}
                                        name="order"
                                        min={1}
                                        autoComplete="off"
                                        className="text-[16px] border border-slate-300 text-gray-900 rounded-lg 
                                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                        block w-full py-3 px-4 shadow-sm"
                                        placeholder="Enter order number"
                                    />

                                     {errors.includes("order") && (
                                    <p className="text-red-600 text-sm mt-1">Order is required</p>
                                )}

                                </div>

                                 <div className="mb-7">
                                    <label className="block mb-2 text-md font-medium text-gray-700">
                                        Description
                                    </label>

                                    <input
                                        type="text"
                                        name="description"
                                        defaultValue = {whychooseusDetails.description}
                                        autoComplete="off"
                                        onKeyUp={ErrorHandler}
                                        className="text-[16px] border border-slate-300 text-gray-900 rounded-lg 
                                          focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
                                          block w-full py-3 px-4 shadow-sm"
                                          placeholder="Enter description name"
                                    />

                                    {errors.includes("description") && (
                                        <p className="text-red-600 text-sm mt-1">Title is required</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="mt-3 cursor-pointer text-white bg-lime-500 hover:bg-lime-500
                                                focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-3 shadow-sm transition-all"
                                >
                                    {whychooseusId ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    )
}
 










































