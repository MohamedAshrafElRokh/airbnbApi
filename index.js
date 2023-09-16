const express = require("express");
const cors = require('cors');
const User = require("./models/Users.js")
const bcrypt = require('bcryptjs')
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
require('dotenv').config()


const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "sdaadasdadawdadad"
app.use(express.json())

app.use(
cors({
    credentials: true,
    origin: "http://localhost:5173",
})
);

// app.use(cors({ origin: "*" }));

mongoose.connect(process.env.MONGO_URL);

app.post('/register', async(req,res)=>
{
    console.log("hi");
    try
    {
        const {name, email, password} = req.body;
        const userData = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userData);
    } catch(error)
    {
        res.status(422).json(error)
    }
})

app.post('/login',async(req,res)=>
{
    try
    {
        const {email,password} = req.body;
        const userData = await User.findOne({email})
        if(userData)
        {
            const passOk = bcrypt.compareSync(password,userData.password)
            if(passOk)
            {
                jwt.sign({email:userData.email, id:userData._id}, jwtSecret, {}, (error,token) =>
                {
                    if(error)   throw error
                    res.cookie('token', token).json(userData)
                    
                })
            }else{
                res.json(false)
            }
        }
        else
        {
            res.json(false)
        }
    }
    catch(error)
    {
        res.status(422).json(error)
    }
})

// app.get('/profile', async(req, res)=>
// {
//     // const {token} = req.cookies
//     // console.log(req.cookies,"token");
//             const userInfo = await User.findOne(userData.id)
//             res.json(userInfo);
//             console.log(userInfo);

// })


app.listen(8000)