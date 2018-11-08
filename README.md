# Sitemap Ping

Tool to ping all the URLS in an XML sitemap.


## Usage: 

```sh
    node ping.js https://example.com/sitemap.xml
```

## Options:

You can choose to also ping with a mobile useragent using `--mobile`.

By default sitemap-ping will only use a desktop firefox useragent


```sh
usage: ping.js [-h] [-v] [--mobile] [-p PARALLEL] site

Sitemap Ping

Positional arguments:
  site                  The sitemap to fetch

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  --mobile              Also use a mobile useragent
  -p PARALLEL, --parallel PARALLEL
                        How many GET requests to make in parallel
```
