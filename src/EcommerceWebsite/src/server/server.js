import axios from 'axios'

const servidor = axios.create({
    baseURL: 'http://localhost:8000/api',
})

export default servidor