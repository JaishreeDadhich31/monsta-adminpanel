import axios from "axios";
import iziToast from "izitoast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function AddFaq() {


    const [faqId, setFaqId] = useState('');

    // api response
    const [faqDetails, setFaqDetails] = useState('');

    const pageNavigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        setFaqId(params.id);

        if (params.id) {
            axios.post(`http://localhost:5000/api/admin/faq/details/${params.id}`)
                .then((result) => {
                    if (result.data._status) {
                        setFaqDetails(result.data._data)
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

        let form = event.target;
        let fields = form.querySelectorAll('input')

        let newErrors = [];

        fields.forEach((field) => {
            if (!field.value.trim()) {
                newErrors.push(field.name);
            }
        });


        newErrors = [...new Set(newErrors)];
        setErrors(newErrors);

        if (newErrors.length === 0) {

            if (faqId) {
                axios.put(`http://localhost:5000/api/admin/faq/update/${faqId}`, {
                    question: event.target.question.value,
                    answer: event.target.answer.value,
                    order: event.target.order.value
                })
                    .then((result) => {
                        console.log(result.data)
                        if (result.data._status == true) {
                            event.target.reset()
                            pageNavigate('/faq/view-faq')
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
                axios.post("http://localhost:5000/api/admin/faq/create", {
                    question: event.target.question.value,
                    answer: event.target.answer.value,
                    order: event.target.order.value
                })
                    .then((result) => {
                        if (result.data._status == true) {
                            event.target.reset()
                            pageNavigate('/faq/view-faq')
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
                        console.log("Full Error:", error);
                        console.log("Response:", error.response);
                        console.log("Data:", error.response?.data);

                        iziToast.error({
                            title: "Error",
                            message:
                                error.response?.data?._message ||
                                error.response?.data?._error ||
                                error.message ||
                                "Something went wrong",
                            position: "topRight",
                        });
                    });
            }
            event.target.reset()
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
                        Home | Faq | <span className='text-purple-500'>{
                            faqId ? 'Update Faq' : 'Add Faq'
                        }  </span>
                    </p>
                </div>

                {/* BODY */}
                <div className="w-full min-h-[390px] px-4 bg-slate-50 py-10">
                    <div className="mx-auto ">

                        <h3 className="text-[24px] font-semibold 
                        bg-gradient-to-r from-blue-500 to-blue-500
                        py-3 px-5 rounded-t-lg text-white border border-blue-500">
                            {
                                faqId ? 'Update faq' : 'Add faq'
                            }
                        </h3>

                        <form onSubmit={formhandler} className="border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm">

                            {/* Question  */}
                            <div className="mb-6">
                                <label className="block mb-2 text-md font-medium text-gray-700">
                                    Question
                                </label>

                                <input
                                    type="text"
                                    name="question"
                                    defaultValue={faqDetails.question}
                                    autoComplete="off"
                                    onKeyUp={ErrorHandler}
                                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                                    block w-full py-2.5 px-3"
                                />

                                {errors.includes("question") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Question is required
                                    </p>
                                )}
                            </div>

                            {/* Answer  */}
                            <div className="mb-6">
                                <label className="block mb-2 text-md font-medium text-gray-700">
                                    Answer
                                </label>

                                <input
                                    type="text"
                                    name="answer"
                                    defaultValue={faqDetails.answer}
                                    autoComplete="off"
                                    onKeyUp={ErrorHandler}
                                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                                    block w-full py-2.5 px-3"
                                />

                                {errors.includes("answer") && (
                                    <p className="text-red-600 text-sm mt-1">
                                        Answer is required
                                    </p>
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
                                    defaultValue={faqDetails.order}
                                    min={1}
                                    autoComplete="off"
                                    className="text-[17px] border border-slate-300 text-gray-900 rounded-lg 
                                    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
                                    block w-full py-2.5 px-3"
                                    placeholder="Enter order number"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-3 cursor-pointer text-white 
                                bg-blue-500 hover:bg-blue-500
                                focus:ring-4 focus:ring-purple-300
                                font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
                            >   {
                                    faqId ? 'Update' : 'Submit'
                                }

                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}