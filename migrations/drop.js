import sequelize from '../config/database'
import fs from 'fs'
import path from 'path'

const dir = path.join(__dirname, './drop.sql')

const sql = fs.readFileSync(dir).toString()

sequelize.query(sql, { raw: true }).then(() => {
  console.log('Table Dropped successfully')
}).catch(error => {
  console.error('Error', error)
})
