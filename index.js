const jsonToCsvLib = require('json-2-csv')
const jtoc = jsonToCsvLib.json2csvAsync
const { promisify } = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const qs = require('querystring')
const bent = require('bent')('json', { 'User-Agent': 'Best-Programing-lang-' })

const OAUTH_TOKEN = process.env.TOKEN
const PAGE = 1
const FILENAME = `data-${PAGE}.csv` // Constant

// Clean FILENAME csv content
writeFile(FILENAME, '').catch(e => console.error(e))

// String -> Promise
const w = data => writeFile(FILENAME, data, { flag: 'a' })

// _ -> Promise
const main = async () => {
    try {
        const url = `https://api.github.com/search/repositories?${qs.stringify({
            q: 'is:public',
            sort: 'stars',
            order: 'desc',
            per_page: 1000,
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
        const csv = await jtoc(json, {
            prependHeader: true,
            expandArrayObjects: true
        })
        await w(csv + '\n')
    } catch (e) {
        console.error(e)
    }
}

// (str "https://api.github.com/search/repositories?"
//  "q=" query
//  "&sort=stars&order=desc&"
//  "page=" page "&"
//  "per_page=1&"
//  "access_token=" oauth-token))))

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// const fileStream = fs.createWriteStream('test.csv', { flags: 'a' })

// const write =

// fileStream.write('test fun', err =>
//     err ? console.error(err) : console.log('done')
// )

// fileStream.close()

main().catch(e => console.error(e))
