import axios from 'axios'

const servidor = axios.create({
    baseURL: 'https://ecommercewebsite-5ew1.onrender.com/api',
})

export default servidor