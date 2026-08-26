import React, { useEffect, useState } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/order/view`, { search });
            setOrders(result.data._data || []);
            setSelectedIds([]);
        } catch {
            setOrders([]);
            iziToast.error({ title: 'Error', message: 'Orders load nahi ho paaye.', position: 'topRight' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    const toggleSelection = (id) => {
        setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
    };

    const updateStatus = async (id, order_status) => {
        try {
            const result = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/order/update-status/${id}`, { order_status });
            setOrders((items) => items.map((item) => item._id === id ? result.data._data : item));
            iziToast.success({ title: 'Success', message: result.data._message, position: 'topRight' });
        } catch (error) {
            iziToast.error({ title: 'Error', message: error.response?.data?._message || 'Status update nahi hua.', position: 'topRight' });
        }
    };

    const deleteOrders = async () => {
        if (!selectedIds.length) return;
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/order/delete`, { ids: selectedIds });
            iziToast.success({ title: 'Success', message: 'Selected orders delete ho gaye.', position: 'topRight' });
            loadOrders();
        } catch {
            iziToast.error({ title: 'Error', message: 'Orders delete nahi hue.', position: 'topRight' });
        }
    };

    const statusLabels = { 1: 'Order placed', 2: 'Order received', 3: 'In transit', 4: 'Out for delivery', 5: 'Completed', 6: 'Cancelled', 7: 'Failed' };

    return (
        <>
            <div>
                <div className="min-h-screen bg-gray-100 ml-64">

                    {/* Breadcrumb */}
                    <div className="bg-white border-b px-6 py-4">
                        <p className="text-2xl font-semibold text-gray-800">
                            Home | Order | <span className='text-violet-500'>Order List</span>
                        </p>
                    </div>

                    <section className="dark:bg-gray-900 p-3 sm:p-5">
                        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                            {/* <!-- Start coding here --> */}
                            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-3">
                                    <div className="w-full md:w-1/2 font-bold text-lg">
                                        <h2>Order List</h2>
                                    </div>
                                    <div>
                                        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadOrders()} placeholder="Order, name or mobile" className="border px-3 py-2 rounded" />
                                        <button onClick={loadOrders} className="bg-slate-600 text-white px-3 py-2 m-2 rounded-lg">Search</button>
                                    <button onClick={deleteOrders} disabled={!selectedIds.length} className='bg-blue-500 disabled:bg-gray-400 text-white px-2 py-2 m-2 rounded-lg shadow font-bold'>
                                                    Delete
                                    </button>
                                    </div>
                                 </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3"><input type="checkbox" checked={orders.length > 0 && selectedIds.length === orders.length} onChange={() => setSelectedIds(selectedIds.length === orders.length ? [] : orders.map((order) => order._id))} /></th>
                                                <th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? <tr><td colSpan="8" className="px-4 py-6 text-center">Loading orders...</td></tr> : orders.length ? orders.map((order) => <tr key={order._id} className="border-b dark:border-gray-700"><td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(order._id)} onChange={() => toggleSelection(order._id)} /></td><td className="px-4 py-3 text-black">{order.order_number}</td><td className="px-4 py-3">{order.name}</td><td className="px-4 py-3">{order.product_info?.reduce((total, item) => total + Number(item.quantity || 1), 0)}</td><td className="px-4 py-3">₹{order.net_amount}</td><td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString('en-IN')}</td><td className="px-4 py-3"><select value={order.order_status} onChange={(e) => updateStatus(order._id, e.target.value)} className="border rounded p-1">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td><td className="px-4 py-3"><button onClick={() => setSelectedOrder(order)} className="px-2 py-2 bg-gray-300 font-bold">View</button></td></tr>) : <tr><td colSpan="8" className="px-4 py-6 text-center">No orders found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                    {selectedOrder && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="max-w-lg w-[90%] bg-white rounded p-6"><div className="flex justify-between"><h3 className="font-bold text-lg">{selectedOrder.order_number}</h3><button onClick={() => setSelectedOrder(null)}>✕</button></div><p className="mt-3"><b>Customer:</b> {selectedOrder.name} ({selectedOrder.mobile_number})</p><p><b>Amount:</b> ₹{selectedOrder.net_amount}</p><p><b>Payment:</b> {selectedOrder.payment_status === 2 ? 'Paid' : 'Pending'}</p><p className="mt-3"><b>Shipping address:</b> {selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}</p><div className="mt-4 border-t pt-3"><b>Products</b>{selectedOrder.product_info?.map((item, index) => <p key={index}>{item.name || item.product_name || 'Product'} × {item.quantity || 1}</p>)}</div></div></div>}
                </div>
            </div>
        </>
    )
}
