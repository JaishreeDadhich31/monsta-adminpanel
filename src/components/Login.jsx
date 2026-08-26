import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

export default function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const formHandler = async (event) => {
        event.preventDefault()
        setMessage('')

        if (!formData.email.trim() || !formData.password) {
            setMessage('Email and password are required.')
            return
        }

        try {
            setIsLoading(true)
            const response = await axios.post('http://localhost:5000/api/admin/auth/login', formData)

            if (!response.data._status) {
                setMessage(response.data._message || 'Login failed.')
                return
            }

            localStorage.setItem('admin_token', response.data._token)
            localStorage.setItem('admin_data', JSON.stringify(response.data._data))
            navigate('/dash-board', { replace: true })
        } catch (error) {
            setMessage(error.response?.data?._message || 'Unable to login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={formHandler}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                {message && <p className="text-sm text-red-600">{message}</p>}
                                <button type="submit" disabled={isLoading} className="text-white w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
