const fs = require('fs')

/* 
* For some reason, Next.js 13.4.4 cannot access process.env on Digital Ocean.
* This file copy env from the process and create .env.production file ready to
* be loaded by next.js
*/

async function main(envKeys = []) {
    const envs = Array.from(Object.entries(process.env))

    if (envs.length) {
        const envContent = envs.map(([key, value]) => envKeys.includes(key) ? `${key}=${value}\n` : '')
        console.log('envContent>>>', envContent)
        fs.writeFileSync('.env.production', envContent.join(''), 'utf-8')
        console.info('.env.production created!')
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