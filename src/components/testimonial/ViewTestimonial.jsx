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

export default function ViewTestimonial() {

    const [openFilter, setOpenFilter] = useState(false);
    const [filterData, setFilterData] = useState({});
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [testimonial, setTestimonial] = useState([]);
    const [imagePath, setImagePath] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [apiStatus, setApiStatus] = useState();

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/testimonial/view`, {
            name: filterData.name,
            page: currentPage,

        })
            .then((result) => {

                if (result.data._status == true) {

                    setTestimonial(result.data._data);
                    setImagePath(result.data._image_path || '');
                    setTotalPages(result.data._paginate.total_page);

                } else {

                    setTestimonial([]);
                    setTotalPages(1);

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
            name: e.target.name.value,
        };

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
        if (testimonial.length == selectedRecord.length) {
            setSelectedRecord([]);
        }
        else {
            setSelectedRecord([]);

            var checkBoxValue = [];
            testimonial.forEach(element => {
                checkBoxValue.push(element._id)
            });
            setSelectedRecord([...checkBoxValue]);
        }
    }

    const changeStatus = () => {

        if (selectedRecord.length > 0) {

            axios.put('http://localhost:5000/api/admin/testimonial/change-status', {
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
                title: "Are you sure?",
                message:
                    "Do you really want to delete selected records? This action cannot be undone.",
                position: "center",

                buttons: [

                    [
                        "<button><b>YES, Delete</b></button>",
                        function (instance, toast) {

                            axios.put('http://localhost:5000/api/admin/testimonial/delete', {
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

            <div className="min-h-screen bg-gray-50 ml-64">

                {/* Breadcrumb */}
                <div className="bg-white border-b px-6 py-4">

                    <p className="text-2xl font-semibold text-gray-800">
                        Home | Testimonial |{" "}
                        <span className="text-violet-500">View Testimonial</span>
                    </p>

                </div>

                {/* FILTER BOX */}
                <div
                    className={`px-5 overflow-hidden transition-all duration-300 ease-out 
          ${openFilter
                            ? "max-h-[500px] opacity-100 py-4"
                            : "max-h-0 opacity-0"
                        }`}
                >

                    <form
                        onSubmit={applyFilter}
                        className="p-5 relative rounded-xl border border-gray-300 w-full bg-white shadow-sm"
                    >

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setOpenFilter(false)}
                            className="absolute right-4 top-4 text-[28px] cursor-pointer text-gray-500 hover:text-black"
                        >
                            <MdOutlineClose />
                        </button>

                        <p className="font-bold text-[22px] mb-5 text-gray-800">
                            FILTER
                        </p>

                        {/* Inputs */}
                        <div className="flex items-center gap-6 flex-wrap">

                            <div className="w-[250px]">

                                <label className="block mb-2 font-medium text-gray-700">
                                    testimonial
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Enter Testimonial"
                                    className="border border-gray-300 shadow-sm w-full rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                                />

                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 mt-6">

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
                                className="bg-violet-700 hover:bg-violet-800 cursor-pointer text-white px-6 py-2 rounded-lg"
                            >
                                Apply
                            </button>

                        </div>

                    </form>

                </div>

                {/* MAIN CONTENT */}
                <div className="p-5 w-full">

                    {/* Header */}
                    <div className="bg-white flex justify-between items-center py-4 px-4 border border-gray-300 rounded-t-lg">

                        <h2 className="text-[20px] font-bold text-black">
                            View testimonial
                        </h2>

                        <div className="flex gap-3 items-center">

                            {/* Filter Button */}
                            <button
                                onClick={() => setOpenFilter(!openFilter)}
                                className="w-[45px] h-[45px] rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer"
                            >
                                <FaFilter className="text-[18px]" />
                            </button>

                            {/* Change Status */}
                            <button
                                onClick={changeStatus}
                                disabled={selectedRecord.length === 0}
                                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-lg border border-red-500 hover:bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-200"
                            >
                                Change Status
                            </button>

                            {/* Delete */}
                            <button
                                onClick={deleteRecords}
                                disabled={selectedRecord.length === 0}
                                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-green-500 rounded-lg border border-green-500 hover:bg-green-700 focus:z-10 focus:ring-4"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                    {/* TABLE */}
                    <div className="border border-t-0 rounded-b-md border-slate-400">

                        <div className="overflow-hidden">

                            <table className="w-full table-fixed text-left text-gray-700">

                                <thead className="bg-gray-100 uppercase text-sm">

                                    <tr>

                                        <th className="px-2 py-3 w-[80px]">

                                            <input
                                                type="checkbox"
                                                checked={testimonial.length > 0 && testimonial.length === selectedRecord.length}
                                                onChange={selectAllCheckBox}
                                                className="mr-2 w-4 h-4 cursor-pointer"
                                            />

                                            Select

                                        </th>

                                        <th className="px-2 py-3 w-[60px]">S.No.</th>

                                        <th className="px-2 py-3 w-[110px]">Name</th>

                                        <th className="px-2 py-3 w-[130px]">Designation</th>

                                        <th className="px-2 py-3">Message</th>

                                        <th className="px-2 py-3 w-[70px] text-center">Rating</th>

                                        <th className="px-2 py-3 w-[80px] text-center">Image</th>

                                        <th className="px-2 py-3 w-[80px] text-center">Status</th>

                                        <th className="px-2 py-3 w-[60px] text-center">Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        testimonial.length > 0
                                            ?
                                            testimonial.map((v, i) => (
                                                
                                                <tr key={v._id} className="border-b hover:bg-gray-50">

                                                    <td className="px-4 py-3">

                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRecord.includes(v._id)}
                                                            onChange={() => SingleCheckSelect(v._id)}
                                                            className="w-4 h-4 cursor-pointer"
                                                        />

                                                    </td>

                                                    <td className="px-4 py-3 font-semibold">
                                                        {i + 1}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {v.name}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {v.desgination}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {v.message}
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        {v.rating}
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        {
                                                            v.image
                                                                ?
                                                                <img
                                                                    src={`${imagePath}/${v.image}`}
                                                                    alt={v.name}
                                                                    className="w-12 h-12 rounded-md object-cover border mx-auto"
                                                                />
                                                                :
                                                                "-"
                                                        }

                                                    </td>

                                                    <td className="px-4 py-3 text-center">

                                                        {
                                                            v.status
                                                                ?
                                                                <span className="text-green-600 font-semibold">
                                                                    Active
                                                                </span>
                                                                :
                                                                <span className="text-red-600 font-semibold">
                                                                    Inactive
                                                                </span>
                                                        }

                                                    </td>

                                                    <td className="px-4 py-3 text-center">

                                                        <Link
                                                            to={`/testimonial/update/${v._id}`}
                                                            className="text-yellow-500 hover:text-yellow-600"
                                                        >
                                                            <FaPen />
                                                        </Link>

                                                    </td>

                                                </tr>

                                            ))
                                            :
                                            <tr>

                                                <td
                                                    colSpan={10}
                                                    className="py-5 text-center font-bold"
                                                >
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

            </div >

        </>
    );
}
