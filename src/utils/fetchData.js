import config from '../utils/config'

// const apiUrl = `${config.server}:${config.port}${config.baseURL}`
const apiUrl = `${config.server}${config.baseURL}`
export const fetchData = async (url, method, data) => {
     return await fetch(`${apiUrl}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-cors-api-key': 'temp_9869bffe28387073bf3e222797cc7350'
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
}