import axios from 'axios'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')

  if (token && config.url?.includes('/api/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axios
