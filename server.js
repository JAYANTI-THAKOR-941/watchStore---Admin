import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import ejs from 'ejs';

import path from 'path'; // Useful for directory paths
import { fileURLToPath } from 'url';


dotenv.config();

const PORT = process.env.PORT || 8000

const app = express();

// database connection
connectDB();

// middleware setup
app.use(express.json());
app.use(express.urlencoded({extended:true}));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//import routes
import userRoutes from './routes/userRoute.js';
import adminRoutes from './routes/adminRoute.js'

app.use('/api/user',userRoutes);
app.use('/api/',adminRoutes)

app.get('/',(req,res)=>{
    res.send("Server is working..!");
});

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})