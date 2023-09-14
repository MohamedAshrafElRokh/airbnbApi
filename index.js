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
    try
    {
        const {name, email, password} = req.body;
        const userData = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
    })
    } catch(error)
    {
        res.status(422).json(error)
    }
    res.json(userData);
})

app.post('/login',async(req,res)=>
{
    try
    {
        const {email,password} = req.body;
        console.log(res.body);
        const userData = await User.findOne({email})

        if(userData)
        {
            const passOk = bcrypt.compareSync(password,userData.password)
            if(passOk)
            {
                res.json(true)

            }else{
                res.json(false)
            }
        }
        else
        {
            res.json('not found')
        }
    }
    catch(error)
    {
        res.status(422).json(error)
    }
})


app.listen(8000)