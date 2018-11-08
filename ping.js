const sitemaps = require('sitemap-stream-parser');
const axios = require('axios')
 
const site = process.argv[2]

const getAllUrls = async () => {
    return new Promise((resolve, reject)=> {
        let urls = []
        sitemaps.parseSitemaps(site, function(url) { urls.push(url) }, function(err, sitemaps) {
            if (!err) {
                resolve(urls)
            } else {
                reject(err)
            }
            
        })
    })
}

async function asyncForEach(array, callback, concurrency) {

    if (!concurrency) {
        concurrency = 1
    }

    for (let index = 0; index < array.length; index += concurrency) {
        for(let thread = 0; thread < concurrency; thread ++) {
            await callback(array[index + thread], index + thread, array)
        }
    }
  }


async function pingUrl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Pinging ' + url)
            const response = await axios.get(url)
            resolve(response)
        } catch(e) {
            console.log('Error pinging: '+ url)
            resolve(e)
        }
    })
    
}


async function pingAll() {
    const urls = await getAllUrls()
    await asyncForEach(urls, async (url) => {
        await pingUrl(url)
      }, 4)
}

(async () => {
    await pingAll()
})()






