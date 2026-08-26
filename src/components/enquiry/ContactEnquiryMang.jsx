import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdOutlineClose } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'izitoast/dist/css/iziToast.min.css';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export default function ContactEnquiryMang() {
    const [enquiries, setEnquiries] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filters, setFilters] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/contact`;

    useEffect(() => {
        axios.post(`${apiUrl}/view`, { ...filters, page })
            .then(({ data }) => {
                setEnquiries(data._status ? data._data : []);
                setTotalPages(data._paginate?.total_page || 1);
            })
            .catch(() => {
                setEnquiries([]);
                iziToast.error({ title: 'Error', message: 'Contact enquiries load nahi ho payi.', position: 'topRight' });
            });
    }, [apiUrl, filters, page, refresh]);

    const toggleOne = (id) => {
        setSelectedIds((oldIds) => oldIds.includes(id)
            ? oldIds.filter((value) => value !== id)
            : [...oldIds, id]);
    };

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === enquiries.length ? [] : enquiries.map((item) => item._id));
    };

    const callSelectedApi = (path) => {
        if (!selectedIds.length) {
            return iziToast.error({ title: 'No Selection', message: 'Pehle enquiry select karein.', position: 'topRight' });
        }

        axios.put(`${apiUrl}/${path}`, { ids: selectedIds })
            .then(({ data }) => {
                if (!data._status) throw new Error(data._message);
                iziToast.success({ title: 'Success', message: data._message, position: 'topRight' });
                setSelectedIds([]);
                setRefresh((value) => !value);
            })
            .catch((error) => iziToast.error({ title: 'Error', message: error.response?.data?._message || error.message, position: 'topRight' }));
    };

    const applyFilter = (event) => {
        event.preventDefault();
        setFilters({
            name: event.target.name.value,
            email: event.target.email.value,
            subject: event.target.subject.value
        });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-100 ml-64">
            <div className="bg-white border-b px-6 py-4">
                <p className="text-2xl font-semibold text-gray-800">Home | Enquiry | <span className="text-violet-500">Contact Enquiry</span></p>
            </div>

            {filterOpen && <form onSubmit={applyFilter} className="m-5 p-5 relative rounded-xl border bg-white shadow-sm">
                <button type="button" onClick={() => setFilterOpen(false)} className="absolute right-4 top-4 text-2xl"><MdOutlineClose /></button>
                <h2 className="font-bold text-xl mb-4">Filter Enquiries</h2>
                <div className="flex flex-wrap gap-4">
                    <input name="name" placeholder="Search by name" className="border rounded-lg px-3 py-2" />
                    <input name="email" placeholder="Search by email" className="border rounded-lg px-3 py-2" />
                    <input name="subject" placeholder="Search by subject" className="border rounded-lg px-3 py-2" />
                </div>
                <div className="mt-4 flex gap-3">
                    <button type="reset" onClick={() => { setFilters({}); setPage(1); }} className="bg-gray-500 text-white px-5 py-2 rounded-lg">Clear</button>
                    <button className="bg-violet-700 text-white px-5 py-2 rounded-lg">Apply</button>
                </div>
            </form>}

            <section className="p-5">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <h2 className="font-bold text-xl">Contact Enquiry Management</h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setFilterOpen((value) => !value)} className="bg-blue-500 p-3 rounded-full text-white"><FaFilter /></button>
                            <button onClick={() => callSelectedApi('change-status')} disabled={!selectedIds.length} className="bg-red-500 disabled:bg-red-500 text-white px-4 py-2 rounded-lg">Change Status</button>
                            
                            <button onClick={() => callSelectedApi('delete')} disabled={!selectedIds.length} className="bg-green-500 disabled:bg-green-500 text-white px-4 py-2 rounded-lg">Delete</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs uppercase bg-gray-100"><tr>
                                <th className="px-4 py-3"><input type="checkbox" checked={enquiries.length > 0 && selectedIds.length === enquiries.length} onChange={toggleAll} /> Select</th>
                                <th className="px-4 py-3">User Info</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Status</th>
                            </tr></thead>
                            <tbody>{enquiries.length ? enquiries.map((item) => <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleOne(item._id)} /></td>
                                <td className="px-4 py-3"><p className="font-semibold">{item.name}</p><p>{item.email}</p><p>{item.mobile_number}</p></td>
                                <td className="px-4 py-3">{item.subject}</td><td className="px-4 py-3 max-w-xs whitespace-normal">{item.message}</td>
                                <td className="px-4 py-3"><span className={item.status ? 'bg-green-500 text-white px-3 py-1 rounded' : 'bg-red-500 text-white px-3 py-1 rounded'}>{item.status ? 'Active' : 'Inactive'}</span></td>
                            </tr>) : <tr><td colSpan="5" className="py-6 text-center font-semibold">No contact enquiries found.</td></tr>}</tbody>
                        </table>
                    </div>
                </div>
                <div className="pt-5 w-[92%] mx-auto"><ResponsivePagination current={page} total={totalPages} onPageChange={setPage} /></div>
            </section>
        </div>
    );
}
