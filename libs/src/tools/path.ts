import path from 'path'

const isDev = process.env.DS_MODE === 'development'
export const rootPath = path.join(__dirname, isDev ? '../../../' : '../../')