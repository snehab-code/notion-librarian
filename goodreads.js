const axios = require('axios')
const cheerio = require('cheerio')
// maybe change to !lookup

const grSearch = async (bookTitle) => {
    if (!bookTitle) {
        return
    }
    
    try {
        const response = await axios.get(`https://www.goodreads.com/search?q=${encodeURI(bookTitle)}`)

        if(response.data.includes('<h3 class="searchSubNavContainer">No results.</h3>')) {
            return
        }
        
        // c&p code from another project. Rewrite this to not use arrays!

        const $ = cheerio.load(response.data)
        const bookArray = $('[itemtype="http://schema.org/Book"]').toArray().slice(0, 4).map(ele => {
            const title = $(ele).text().split('avg rating')[0].replace(/\n|  /g, '').replace('by', ' by ')
            return {
                title: $('.bookTitle', $(ele).html()).text().trim(),
                link: `https://www.goodreads.com${$('.bookTitle', $(ele).html())[0].attribs.href.split('?from_search')[0]}`,
                author: $('.authorName', $(ele).html()).text().split(' ').filter(word => word).join(' ')
            }
        })
        const firstResult = await axios.get(bookArray[0].link)
        const description = $('#description', firstResult.data).text()
        bookArray[0].description = description

        return bookArray[0]
    } catch(err) {
        console.log(err)
        
    }
    
}

module.exports = grSearch