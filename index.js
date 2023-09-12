const express = require("express");
const cors = require('cors');
const User = require("./models/Users.js")
const bcrypt = require('bcryptjs')
const bcryptSalt = bcrypt.genSaltSync(10)
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()

app.use(express.json())

// app.use(cors({

//     credentials:true,
//     origin:'http://localhost:5173'
// }))

app.use(cors({ origin: "*" }));

mongoose.connect(process.env.MONGO_URL);

app.post('/register', async(req,res)=>
{
    const {name, email, password} = req.body;
    const userData = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    })

    res.json(userData);
})
app.listen(8000)