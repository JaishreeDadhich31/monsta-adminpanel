import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdOutlineClose } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import 'izitoast/dist/css/iziToast.min.css';

export default function ViewUser() {
    const [users, setUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refresh, setRefresh] = useState(false);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/user`;

    // Page, filter ya refresh change hote hi backend se latest users laate hain.
    useEffect(() => {
        axios.post(`${apiUrl}/view`, { ...filters, page })
            .then(({ data }) => {
                if (data._status) {
                    setUsers(data._data);
                    setTotalPages(data._paginate.total_page);
                } else {
                    setUsers([]);
                    setTotalPages(1);
                }
            })
            .catch(() => iziToast.error({ title: 'Error', message: 'Users load nahi ho paye.', position: 'topRight' }));
    }, [apiUrl, filters, page, refresh]);

    const toggleOne = (id) => {
        setSelectedIds((oldIds) => oldIds.includes(id) ? oldIds.filter((value) => value !== id) : [...oldIds, id]);
    };

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === users.length ? [] : users.map((user) => user._id));
    };

    const callSelectedApi = (path, successTitle) => {
        if (!selectedIds.length) {
            return iziToast.error({ title: 'No Selection', message: 'No user select', position: 'topRight' });
        }

        axios.put(`${apiUrl}/${path}`, { ids: selectedIds })
            .then(({ data }) => {
                if (!data._status) throw new Error(data._message);
                iziToast.success({ title: successTitle, message: data._message, position: 'topRight' });
                setSelectedIds([]);
                setRefresh((oldValue) => !oldValue);
            })
            .catch((error) => iziToast.error({ title: 'Error', message: error.message || 'Something went wrong.', position: 'topRight' }));
    };

    const applyFilter = (event) => {
        event.preventDefault();
        setFilters({ name: event.target.name.value, email: event.target.email.value });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 ml-64">
            <div className="bg-white border-b px-6 py-4">
                <p className="text-2xl font-semibold text-gray-800">Home | User | <span className="text-violet-500">View</span></p>
            </div>

            {filterOpen && (
                <form onSubmit={applyFilter} className="m-5 p-5 relative rounded-xl border bg-white shadow-sm">
                    <button type="button" onClick={() => setFilterOpen(false)} className="absolute right-4 top-4 text-2xl"><MdOutlineClose /></button>
                    <h2 className="font-bold text-xl mb-4">Filter Users</h2>
                    <div className="flex gap-4 flex-wrap">
                        <input name="name" placeholder="Search by name" className="border rounded-lg px-3 py-2" />
                        <input name="email" placeholder="Search by email" className="border rounded-lg px-3 py-2" />
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="reset" onClick={() => { setFilters({}); setPage(1); }} className="bg-gray-500 text-white px-5 py-2 rounded-lg">Clear</button>
                        <button className="bg-violet-700 text-white px-5 py-2 rounded-lg">Apply</button>
                    </div>
                </form>
            )}

            <div className="p-5">
                <div className="bg-white flex justify-between items-center py-4 px-4 border rounded-t-lg">
                    <h2 className="text-xl font-bold">View Users</h2>
                    <div className="flex gap-3 items-center">
                        <button onClick={() => setFilterOpen(!filterOpen)} className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center"><FaFilter /></button>
                        <button onClick={() => callSelectedApi('change-status', 'Status Updated')} className="bg-red-500 text-white px-4 py-2 rounded-lg">Change Status</button>
                        <button onClick={() => callSelectedApi('delete', 'User Deleted')} className="bg-green-500 text-white px-4 py-2 rounded-lg">Delete</button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-t-0 rounded-b-lg bg-white">
                    <table className="w-full text-left text-gray-700">
                        <thead className="bg-gray-100 uppercase text-sm"><tr>
                            <th className="px-4 py-3"><input type="checkbox" checked={users.length > 0 && selectedIds.length === users.length} onChange={toggleAll} /> Select</th>
                            <th className="px-4 py-3">S.No.</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Mobile Number</th><th className="px-4 py-3">Status</th>
                        </tr></thead>
                        <tbody>{users.length ? users.map((user, index) => <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(user._id)} onChange={() => toggleOne(user._id)} /></td>
                            <td className="px-4 py-3">{(page - 1) * 15 + index + 1}</td><td className="px-4 py-3">{user.name}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3">{user.mobile_number || '-'}</td>
                            <td className="px-4 py-3"><span className={user.status ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{user.status ? 'Active' : 'Inactive'}</span></td>
                        </tr>) : <tr><td colSpan="6" className="py-5 text-center font-bold">No users found.</td></tr>}</tbody>
                    </table>
                </div>
                <div className="pt-5 w-[92%] mx-auto"><ResponsivePagination current={page} total={totalPages} onPageChange={setPage} /></div>
            </div>
        </div>
    );
}
