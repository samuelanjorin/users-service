import sequelize from '../config/database'
import fs from 'fs'
import path from 'path'

const dir = path.join(__dirname, './db.sql')

const sql = fs.readFileSync(dir).toString()

sequelize.query(sql, { raw: true }).then(() => {
  console.log('Table created')
}).catch(error => {
  console.error('Error', error)
})
