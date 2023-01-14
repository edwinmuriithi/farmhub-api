import express from "express";
import cors from 'cors'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config() // Load environment variables

//Import routes 
import Index from './routes/main'
import Auth from './routes/auth'
import Users from './routes/users'
import Posts from './routes/posts'
import Messaging from './routes/messaging'
import Data from './routes/data'

// import Reports from './routes/reports'

const app = express();
const PORT = 8080;

app.use(cors())


app.use('/', Index)

app.use('/auth', Auth)
app.use('/users', Users)
app.use('/posts', Posts)
app.use('/messaging', Messaging)
app.use('/data', Data)

app.use('/files', express.static(`${path.join(__dirname, '../public/')}`))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});