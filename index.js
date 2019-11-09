const jsonToCsvLib = require('json-2-csv')
const jtoc = jsonToCsvLib.json2csvAsync
const { promisify } = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const qs = require('querystring')
const bent = require('bent')('json', { 'User-Agent': 'Best-Programing-lang-' })

const OAUTH_TOKEN = process.env.TOKEN
const FROM = 1000
const TO = 1003
const PAGE = `${FROM}..${TO}`
console.log(PAGE)

const FILENAME = `data-${PAGE.replace('..', '-')}.csv` // Constant

// Clean FILENAME csv content
writeFile(FILENAME, '').catch(e => console.error(e))

// String -> Promise
const w = data => writeFile(FILENAME, data, { flag: 'a' })

// _ -> Promise
const main = async () => {
    try {
        const url = `https://api.github.com/search/repositories?${qs.stringify({
            q: `stars:${PAGE} is:public`,
            sort: 'stars',
            order: 'desc',
            per_page: 100,
            // page: PAGE,
            // page: 1, -> 10
            access_token: OAUTH_TOKEN
        })}`

        // run 10 times and push it to file.

        const res = await bent(url)
        const json = res.items.map(
            ({
                name,
                created_at,
                size,
                stargazers_count,
                language,
                forks_count,
                open_issues_count,
                license,
                languages_url,
                description,
                html_url
            }) => {
                return {
                    name,
                    language,
                    stars: stargazers_count,
                    forks: forks_count,
                    license: license ? license.key : '',
                    open_issues: open_issues_count,
                    created: created_at,
                    size,
                    description,
                    url: html_url,
                    languages: languages_url
                }
            }
        )
        console.log(json.length)
        const csv = await jtoc(json, {
            prependHeader: false,
            expandArrayObjects: true
        })

        await w(csv + '\n')
    } catch (e) {
        console.error(e)
    }
}

main().catch(e => console.error(e))
