const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const JWT_SECRET ="thisisasecretkey";
var fetchuser = require('../middleware/fetchuser');
//ROUTE 1: Create a user using : POST "/api/auth/createuser". No Login required
router.post('/createuser',[
  body('name', 'Enter a valid name!').isLength({ min: 5 }),
  body('email','Enter a valid email').isEmail(),
  body('password', 'Length of password must be atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{
  let success = false;
  //If there are errors return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try{
    let user = await User.findOne({email: req.body.email});
    if (user){
      return res.status(400).json({success,error: "Sorry a user with thid email already exists"})
    } 
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password ,salt);

    //Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data ={
      user:{
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    //res.json({"nice": "Noce"})
    success= true;
    res.json({success, authToken});
  }
  //catching errors
  catch (error){
    console.log(error.message);
    res.status(500).send("Some Internal Server Error occured");
  }
  })


  // ROUTE 2: uthenticate a user.: POST "/api/auth/login". no login required
  router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be empty').exists(),
  ], async (req,res)=>{
  

    //If there are errors return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {email ,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      success = false
      return res.status(400).json({success ,error: "Please try to login with correct credentials"});
    }
    const passwordCompare  = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      success = false
      return res.status(400).json({success, error: "Please try to login with correct credentials"});
    }
    const data ={
      user:{
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success,authToken});

  } catch (error){
    console.log(error.message);
    res.status(500).send("Some Internal Server Error occured");
  }

  
  })


//ROUTE 3: Get loggedin user Details using : POST "/api/auth/getuser". Login required

router.post('/getuser', fetchuser, async (req,res)=>{


try{
  userId = req.user.id;
  const user = await  User.findById(userId).select("-password")
  res.send(user)
} catch (error){
  console.log(error.message);
  res.status(500).send("Some Internal Server Error occured");
}
})

module.exports = router
