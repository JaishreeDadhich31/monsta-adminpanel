import React, { useState } from 'react'
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import iziToast from "izitoast";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";


export default function AddTestimonial() {

  const [testimonialId, setTestimonialId] = useState('');

  // api response
  const [testimonialDetails, setTestimonialDetails] = useState({});

  const [SelectedImage, setSelectedImage] = useState("");

  const [ImageFile, setImageFile] = useState(null);

  const pageNavigate = useNavigate();

  const params = useParams();

  const handleimagechange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setTestimonialId(params.id);

    if (params.id) {
      axios.post(`http://localhost:5000/api/admin/testimonial/details/${params.id}`)
        .then((result) => {
          if (result.data._status) {
            const testimonial = result.data._data;
            setTestimonialDetails(testimonial);
            setSelectedImage(
              testimonial.image
                ? `${result.data._image_path || 'http://localhost:5000/uploads/testimonial'}/${testimonial.image}`
                : ''
            );
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
        });
    }
  }, [params])


  let [errors, setErrors] = useState([]);


  let formhandler = (event) => {
    event.preventDefault();

    console.log("FORM SUBMITTED");

    let form = event.target;
    let fields = form.querySelectorAll("input, textarea");
    let newErrors = [];

    if (!testimonialId && !ImageFile) {
      newErrors.push("image");
    }

    fields.forEach((field) => {
      if (!field.value.trim()) {
        newErrors.push(field.name);
      }
    });

    newErrors = [...new Set(newErrors)];
    setErrors(newErrors);

    if (newErrors.length === 0) {

      let formData = new FormData();

      formData.append("name", event.target.name.value);
      formData.append("desgination", event.target.desgination.value);
      formData.append("message", event.target.message.value);
      formData.append("rating", event.target.rating.value);


      if (ImageFile) {
        formData.append("image", ImageFile);
      }

      if (testimonialId) {

        axios.put(
          `http://localhost:5000/api/admin/testimonial/update/${testimonialId}`,
          formData
        )
          .then((result) => {

            console.log(result.data);

            if (result.data._status == true) {

              event.target.reset();
              setSelectedImage("");
              setImageFile(null);

              pageNavigate("/testimonial/view-testimonial");

              iziToast.success({
                title: "Success",
                message: result.data._message,
                position: "topRight"
              });

            } else {

              iziToast.error({
                title: "Error",
                message: result.data._message,
                position: "topRight"
              });

            }

          })
          .catch(() => {

            iziToast.error({
              title: "Error",
              message: "Something went wrong",
              position: "topRight"
            });

          });

      } else {

        console.log("Before Axios");
        console.log(formData);

        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        axios.post(
          "http://localhost:5000/api/admin/testimonial/create",
          formData
        )
          .then((result) => {

            if (result.data._status == true) {

              event.target.reset();
              setSelectedImage("");
              setImageFile(null);

              pageNavigate("/testimonial/view-testimonial");

              iziToast.success({
                title: "Success",
                message: result.data._message,
                position: "topRight"
              });

            } else {

              iziToast.error({
                title: "Error",
                message: result.data._message,
                position: "topRight"
              });

            }

          })
          .catch((error) => {

            console.log("FULL ERROR");
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);

            iziToast.error({
              title: "Error",
              message:
                error.response?.data?._message ||
                error.response?.data?._error ||
                error.message,
              position: "topRight"
            });

          });

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
      <section className="min-h-screen bg-gray-100 ml-64 p-6 rounded-lg">

        {/* Breadcrumb */}
        <div className="bg-white border-b px-6 py-4 mb-6">
          <p className="text-2xl font-semibold text-gray-800">
            Home | Testimonial | <span className='text-violet-500'>Add Testimonial</span>
          </p>
        </div>

        {/* Body */}
        <div className="pt-5">
          <div className="mx-auto">

            {/* Heading */}
            <h3 className="text-[24px] font-semibold 
            bg-gradient-to-r from-lime-500 to-lime-500
            py-3 px-5 rounded-t-lg text-white border border-lime-500">
              Add New Testimonial
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

                      <div className="absolute inset-0 bg-gradient-to-r 
                        from-transparent via-white/40 to-transparent
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
                    accept="image/*"
                    onChange={handleimagechange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {errors.includes("image") && (
                  <p className="text-red-600 text-sm mt-1">image is required</p>
                )}
              </div>

              {/* FORM */}
              <div className='basis-full'>

                {/* Name */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    defaultValue={testimonialDetails.name}
                    autoComplete="off"
                    onKeyUp={ErrorHandler}
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                block w-full py-2.5 px-3"
                    placeholder="Enter name"
                  />

                  {errors.includes("name") && (
                    <p className="text-red-600 text-sm mt-1">Name is required</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Designation
                  </label>

                  <input
                    type="text"
                    name="desgination"
                    defaultValue={testimonialDetails.desgination}
                    autoComplete="off"
                    onKeyUp={ErrorHandler}
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
    block w-full py-2.5 px-3"
                    placeholder="Enter designation"
                  />

                  {errors.includes("desgination") && (
                    <p className="text-red-600 text-sm mt-1">
                      Designation is required
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block mb-2 text-md font-medium text-gray-700">
                    Message
                  </label>

                  <textarea
                    name="message"
                    defaultValue={testimonialDetails.message}
                    autoComplete="off"
                    onKeyUp={ErrorHandler}
                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                block w-full py-2.5 px-3"
                    placeholder="Enter Message"
                  />

                  {errors.includes("message") && (
                    <p className="text-red-600 text-sm mt-1">message is required</p>
                  )}
                </div>

                {/* Rating + Order */}
                <div className='flex gap-4'>
                  <div className="mb-6 basis-[50%]">
                    <label className="block mb-2 text-md font-medium text-gray-700">
                      Rating
                    </label>

                    <input
                      type="number"
                      name="rating"
                      defaultValue={testimonialDetails.rating}
                      min={1}
                      max={5}
                      autoComplete="off"
                      className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                  block w-full py-2.5 px-3"
                      placeholder="Enter rating number"
                    />
                  </div>


                </div>

                {/* Button */}
                <div className='flex justify-end'>
                  <button
                    type="submit"
                    className="mt-3 cursor-pointer text-white 
                bg-lime-500 hover:bg-lime-500
                focus:ring-4 focus:ring-indigo-300
                font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
                  >
                    Submit
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}


















