const sitemaps = require('sitemap-stream-parser');
const axios = require('axios')
const ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Sitemap Ping'
  });
  parser.addArgument(
    [ 'site' ],
    {
      help: 'The sitemap to fetch'
    }
  );
  parser.addArgument(
    '--mobile' ,
    {
      help: 'Also use a mobile useragent',
      nargs: 0
    }
  );
  parser.addArgument(
    [ '-p', '--parallel' ],
    {
      help: 'How many GET requests to make in parallel'
    }
  );

const args = parser.parseArgs();

const axiosDesktop = axios.create()
axiosDesktop.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0'

const axiosiPhone = axios.create()
axiosiPhone.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'

const getAllUrls = async () => {
    return new Promise((resolve, reject)=> {
        let urls = []
        sitemaps.parseSitemaps(args.site, function(url) { urls.push(url) }, function(err, sitemaps) {
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


async function pingUrl(url, axiosInstance) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Pinging ' + url)
            const response = await axiosInstance.get(url)
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
        await pingUrl(url, axiosDesktop)
        if (args.mobile) {
            await pingUrl(url, axiosiPhone)
        }
      }, args.parallel || 4)
}

(async () => {

    if(args.mobile) {
        console.log('Pinging with mobile and desktop user agent')
    }

    await pingAll()
})()






