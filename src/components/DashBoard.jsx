import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialStats = {
    users: null,
    products: null,
    categories: null,
    orders: null,
}

const getTotalRecords = (response) => {
    const { _data: records, _paginate: pagination } = response.data || {}

    return pagination?.total_records ?? pagination?.totalRecords ?? (Array.isArray(records) ? records.length : 0)
}

export default function DashBoard() {
    const [stats, setStats] = useState(initialStats)

    useEffect(() => {
        let isMounted = true
        const apiUrl = import.meta.env.VITE_API_BASE_URL

        const loadDashboardStats = async () => {
            const requests = [
                axios.post(`${apiUrl}/user/view`, { page: 1 }),
                axios.post(`${apiUrl}/product/view`, { page: 1 }),
                axios.post(`${apiUrl}/category/view`, { page: 1 }),
                axios.post(`${apiUrl}/order/view`, {}),
            ]

            const results = await Promise.allSettled(requests)

            if (!isMounted) return

            setStats({
                users: results[0].status === 'fulfilled' ? getTotalRecords(results[0].value) : null,
                products: results[1].status === 'fulfilled' ? getTotalRecords(results[1].value) : null,
                categories: results[2].status === 'fulfilled' ? getTotalRecords(results[2].value) : null,
                orders: results[3].status === 'fulfilled' ? getTotalRecords(results[3].value) : null,
            })
        }

        loadDashboardStats()

        return () => {
            isMounted = false
        }
    }, [])

    const displayStat = (value) => value === null ? '—' : value

    return (
        <>
            <div>

                {/* dashboard inner box */}

                <main className="p-5 md:ml-64 h-auto pt-20">

                    {/* breadcrubms */}

                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-2">

                            <li className="inline-flex items-center">
                                <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                    Home
                                </a>
                            </li>

                            <li className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-sm font-medium text-gray-500">
                                    Dashboard
                                </span>
                            </li>

                        </ol>
                    </nav>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                        {/* Users  */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-5 h-36 flex flex-col justify-center shadow-lg">
                            <h2 className="text-2xl font-bold">{displayStat(stats.users)}</h2>
                            <p className="text-lg">Users</p>
                        </div>

                        {/* Products */}
                        <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-5 h-36 flex flex-col justify-center shadow-lg">
                            <h2 className="text-2xl font-bold">{displayStat(stats.products)}</h2>
                            <p className="text-lg">Product</p>
                        </div>

                        {/* Category  */}
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-5 h-36 flex flex-col justify-center shadow-lg">
                            <h2 className="text-2xl font-bold">{displayStat(stats.categories)}</h2>
                            <p className="text-lg">Category</p>
                        </div>

                        {/* Orders  */}
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-5 h-36 flex flex-col justify-center shadow-lg">
                            <h2 className="text-2xl font-bold">{displayStat(stats.orders)}</h2>
                            <p className="text-lg">Orders</p>
                        </div>

                    </div>
                </main>
            </div>
        </>
    )
}
