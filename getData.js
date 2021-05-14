const axios = require('axios')
const {notionKey} = require('./config.json')
const grSearch = require('./goodreads')

const getData = async(params) => {
    const {method, url, data} = {params}
    try {
        const response = await axios[method](url, {
            headers: {
                'Authorization': `Bearer ${notionKey}`
            },
            data
        })();
        const bookData = await grSearch('Mark Lawrence Grey Sister')
        console.log(bookData)
        return response.data
    } catch(err) {
        console.log(err)
        return null
    }
}

module.exports = getData