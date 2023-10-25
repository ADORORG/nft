const fs = require('fs')
const https = require('https')
const { exec } = require('child_process') 
/* 
* For some reason, Next.js 13.4.4 cannot access process.env on Digital Ocean.
* This file copy env from the process and create .env.production file ready to
* be loaded by next.js
*/

/**
 * Read env from Environmental Variables
 * @returns 
 */
function getENVs() {
    // Command to get all env variables
    const command = 'env | grep -e .'
    
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`getENVs Error: ${error.message}`)
                return reject(error.message)
            }
    
            if (stderr) {
                console.error(`getENVs stderr: ${stderr}`)
                return reject(stderr)
            }
    
            // console.info(`Matching envs: \n${stdout}`)
            return resolve(stdout)
        })
    })
}

function getRemoteEnvs() {
    const envUrl = process.argv[2].split('=')[1]
    return new Promise(resolve => {
        https.get(envUrl, (res) => {

            if (res.statusCode >= 200 && res.statusCode < 300) {
                let content = ''
                res.on('data', chunk => {
                    content += chunk
                })
                res.on('end', () => {
                    // send the content
                    resolve(content)
                })
                res.on('error', console.error)
            } else {
                // Free up memory
                res.resume()
                resolve('')
            }
        })
    })
}

async function main(envKeys = []) {
    const envs = await getRemoteEnvs()

    if (envs.length) {
        const envNeeded = envs.split("\n").filter(env => envKeys.includes(env.split('=')[0]))
        fs.writeFileSync('.env.production', envNeeded.join('\n'), 'utf-8')
        console.info('.env.production created!', envNeeded.length)
    } else {
        console.info('No ENVs found')
    }

}

main([
    'DB_HOST',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'PINATA_API_KEY',
    'PINATA_API_SECRET',
    'PINATA_JWT',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_FROM',
    'NEXT_PUBLIC_PINATA_GATEWAY',
    'NEXT_PUBLIC_CONTRACT_BASE_URI',
    'NEXT_PUBLIC_ALCHEMY_ID',
    'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
])