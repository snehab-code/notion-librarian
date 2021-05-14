const {Client, LogLevel} = require('@notionhq/client')
const {notionKey, bookdb} = require('./config.json')
const grSearch = require('./goodreads')

const notion = new Client({auth: notionKey
    // , logLevel: LogLevel.DEBUG
});

const grUpdate = async () => {
    const unsyncedPages = await notion.request({
        path: `databases/${bookdb}/query`,
        method: 'POST',
        body: {
            filter: {
                property: 'updated',
                checkbox: {
                    equals: false
                }
            }
        }
    })

    unsyncedPages.results.forEach(async (page) => {
        const grData = await grSearch(`${page.properties['Name'].title[0].plain_text} ${page.properties['Author'].rich_text[0] ? page.properties['Author'].rich_text[0].plain_text : ''}`)
        const updatePage = await notion.request({
            path: `pages/${page.id}`,
            method: 'PATCH',
            body: {
                properties: {
                    'Name': {'title': [{"text": { "content": grData.title}}]},
                    'Author': {'rich_text': [{'text': {'content': grData.author}}]},
                    updated: {checkbox: true},
                    'Description': {'rich_text': [{'text': {'content': grData.description}}]}
                }
            }
        })
        console.log(updatePage)
    })
}

grUpdate()
