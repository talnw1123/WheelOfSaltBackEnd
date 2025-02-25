require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const path = require('path');  // Add this line

const auth = require('./middleware/auth')
const userRoutes = require("./routes/userRoute");

const login = require("./controllers/loginController");
const register = require("./controllers/registerController");

const getUsername = require('./controllers/getUserNameController')
const getAllUsers = require('./controllers/getAllUsersController')
const updateUser= require('./controllers/updateUserController')
const deductUserMoney = require('./controllers/deductUserMoney')
const getUserMoney = require('./controllers/getUserMoneyController')

const createProduct = require('./controllers/createProductController'); // Adjust the path as needed
const getAllProducts = require('./controllers/getAllProductController')
const updatedProduct = require('./controllers/updateProductController')
const getOneProduct = require('./controllers/getOneProductController')
const getWheelData = require('./controllers/getWheelDataController')
const deleteItemFromSpin = require('./controllers/deleteItemFromSpinController')
const deleteProduct = require('./controllers/deleteProductController')

const slipHistoryRoutes = require('./routes/slipRoute');

const saveSlip = require('./controllers/createSlipProductController')
const getPurchaseHistoryByEmail = require('./controllers/getSlipProductController')

const dashboardRoutes = require('./routes/dashboardRoutes');
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.USER_DB,
  pass: process.env.PASS_DB,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/users", userRoutes);
app.post("/api/users/login", login); // Corrected path
app.post("/api/users/register", register);
app.get('/api/users/username', getUsername);
app.get('/api/getAllUsers', getAllUsers)
app.post('/api/updateUser/:username',updateUser)
app.get('/api/getUserMoney/:email',getUserMoney)
app.post('/api/deductUserMoney',deductUserMoney)

app.post('/api/createProduct', createProduct)
app.get('/api/getAllProducts', getAllProducts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Ensure static middleware is configured
app.post('/api/updatedProduct/:_id', updatedProduct);
app.get('/api/getOneProduct/:_id', getOneProduct);
app.get('/api/getWheelData/:_id', getWheelData );
app.post('/api/deleteItemFromSpin/:_id', deleteItemFromSpin );
app.delete('/api/deleteProduct/:_id',deleteProduct)

app.use('/api', slipHistoryRoutes);
app.post('/api/saveSlip', saveSlip);
app.get('/api/getPurchaseHistoryByEmail/:email', getPurchaseHistoryByEmail);

app.get("/", (req, res) => {
  res.status(200).send("Welcome Kmutt");
});


const cron = require('node-cron');
const SlipHistory = require('./models/slipHistoryModel');
app.use('/api/dashboard', dashboardRoutes);
// Schedule tasks to be run on the server
cron.schedule('0 0 * * *', async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalAmount = await SlipHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // You can log this amount or save it to a database or send an email, etc.
    console.log(`Total top-ups today: ${totalAmount[0]?.total || 0}`);
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
