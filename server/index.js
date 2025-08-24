const express = require('express')
const app = express();
const connectDB = require('./config/db')
const adminRoute = require('./router/routes')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { cloudinaryConnect } = require('./config/cloudinary');
const cors = require('cors');


app.use(cookieParser());
connectDB();
cloudinaryConnect();

app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

//api mount
app.use('/api', adminRoute)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
