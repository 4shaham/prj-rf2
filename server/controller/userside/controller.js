

var Userdb = require("../../model/User schema")
var otpdb = require("../../model/otp.schema")
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")
const Product = require("../../model/product.schema")
const Cateogary = require("../../model/cateogary.schema")
const cartdb = require('../../model/cart.schema');
const { default: mongoose } = require("mongoose");



const otpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const sendOtpMail = async (req, res) => {
  const otp = otpGenrator();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Gocart",
      link: "https://mailgen.js/"
    },
  });

  const response = {
    body: {
      name: req.session.user,
      intro: "Your OTP for Gocart verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.user,
    subject: "Gocart OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.user,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.otpTd = data._id;
    res.status(200).redirect("/register2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};



//create and save new user  signup


exports.create = async (req, res) => {

  if (!req.body.name && !req.body.password && !req.body.confirmPassword) {
    req.session.body = " Please Enter The Details"
    return res.redirect('/register3')
  }
  if (!req.body.password) {
    req.session.requiredPassword = " Please Enter The Password"
    return res.redirect('/register3')
  }
  var minLength = 8;
  var maxLength = 12;
  if (req.body.password.length !== minLength && req.body.password.length !== maxLength) {

    req.session.passwordValidation = `Password must be between ${minLength} and ${maxLength} characters long.`;
    return res.redirect('/register3');
  }


  if (!req.body.confirmPassword) {
    req.session.requiredConfirmPassword = " Please Enter The Confirm Password"
    return res.redirect('/register3')
  }
  if (req.body.password !== req.body.confirmPassword) {
    req.session.chekingPassword = "Passwords do not match"
    return res.redirect('/register3');
  }




  //  const existingUser = await Userdb.findOne({ email: req.body.email });

  //  if (existingUser) {
  //      res.status(400).send({ message: "Email is already taken" });
  //      return;
  //  }


  // hashed password  

  //  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // for send mail 
  //  const sendVerifyMail=async(name,email, user_id)=>{



  const user = new Userdb({
    name: req.body.name,
    email: req.session.user,
    password: req.body.password,
  })

  // save user in bd

  user
    .save(user)
    .then(data => {
      res.redirect("/login")
    })
    .catch(err => {
      res.status(400).send({
        message: err.message || "some error occured while creating option "
      });
    });

}



// login verification  

exports.validation = async (req, res) => {

  if(!req.body.email&&!req.body.password){
    req.session.email = "Email is required";
    req.session.password = "password is required";
    return res.redirect("/login")

  }

  if (!req.body.email) {

    req.session.email = "Email is required";
    return res.redirect("/login")

  }
  //  if(/[A-Za-z0-9]+@gmail\.com$/.test(req.body.email)) {
  //   req.session.emailValidation = "Gmail is not valid";
  //   return res.redirect("/login");
  // } else {
  //   // Handle other errors or conditions if needed
  // }

  if (!req.body.password) {
    req.session.emalevalue = req.body.email
    req.session.password = "password is required";
    return res.redirect("/login")

  } 

 


  //  const userhashedPassword = await bcrypt.hash(req.body.password, 10);
  req.session.emalevalue = req.body.email
  req.session.passwordValue=req.body.password
  const a = {
    email: req.body.email,
    password: req.body.password
  }

  const foundUser = await Userdb.findOne({ email: a.email });

  if (!foundUser) {
    req.session.message = "User is not found";
    return res.redirect("/login")
  }


  if (foundUser.email === a.email && foundUser.password == a.password) {
    if (await Userdb.findOne({ email: a.email, blocked: true })) {
      res.send("user is blocked")
      return
    }
    const l = await Userdb.updateOne({ email: foundUser.email }, { $set: { status: "Active" } })
    
    req.session.authentication = true
    req.session.logoutemail = foundUser.email
    req.session.userId = foundUser._id
    req.session.message = ''
    res.redirect("/")
  } else {

    req.session.message = "password is incoreect"
    res.redirect("/login")

  }

}





exports.logout = async (req, res) => {
  console.log("hi")
  try {
    await Userdb.updateOne({ email: req.session.logoutemail }, { $set: { status: "Inactive" } })
    delete req.session.authentication
    delete req.session.userId
    res.redirect("/")
  } catch (err) {
    console.log(err)
    res.status(500)
  }

}



//registraion otp



exports.otp = async(req, res) => {

  if ( ! req.body.email) {
   
    req.session.Otpeerrmessage="This field is required"
    // res.status(400).send({ message: "hi you entered any thing" })
    return  res.redirect('/register1')
  }
  
  const usermail=await Userdb.findOne({email:req.body.email})
  
  if(usermail){
    req.session.findEmail="This Email is allready use"
    return res.redirect('/register1')
  }

  req.session.user = req.body.email

  sendOtpMail(req, res);



}




//authentication

exports.otpverification = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" })
    return
  }
  const otpUser = await otpdb.findOne({ _id: req.session.otpTd });

  const b = req.body.otp

  if (b == otpUser.otp) {
    res.redirect("/register3")
  } else {
    res.send("otp failed");
  }

}


// forgot otp mailer function 


const forgototpsendOtpMail = async (req, res) => {
  const otp = otpGenrator();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Gocart",
      link: "https://mailgen.js/"
    },
  });

  const response = {
    body: {
      name: req.session.forgotuser,
      intro: "Your OTP for Gocart verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.forgotuser,
    subject: "Gocart OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.forgotuser,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.forgototpTd = data._id;
    res.status(200).redirect("/forgotpassword2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};



// forgot otp   



exports.forgototp = async (req, res) => {

  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" })
    return
  }
  req.session.forgotuser = req.body.email

  const forgotuserb = await Userdb.findOne({ email: req.session.forgotuser });

  if (!forgotuserb) {
    console.log(" the mail")
    return
  }



  forgototpsendOtpMail(req, res);



}


// verification otp

exports.forgototp2 = async (req, res) => {

  if (!req.body) {
    return
  }

  const forgototpUser = await otpdb.findOne({ _id: req.session.forgototpTd });
  console.log(forgototpUser)

  if (forgototpUser.otp == req.body.otp) {
    res.redirect("/forgotpassword3")
  } else {
    res.send("error")
  }
}



//update password

exports.updatepassword = async (req, res) => {
  console.log("hi")


  //  if(!req.body){
  //   console.log("hi")
  //   return 
  //  }
  //  if(!req.body.password==req.body.confirmPassword){
  //   console.log("hill")
  //   return
  //  } 
  if (!req.body) {
    console.log("Error: Request body is missing");
    // You might want to send an error response to the client
    return res.status(400).json({ error: "Request body is missing" });
  }
  
  const { password, confirmPassword } = req.body;

  if (!(password === confirmPassword)) {
    console.log("Error: Passwords do not match");
    // You might want to send an error response to the client
    return res.status(400).json({ error: "Passwords do not match" });
  }

  //hased password 

  //  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  console.log(req.session.forgotuser)



  const updateuser = await Userdb.updateOne({ email: req.session.forgotuser }, { $set: { password: req.body.password } });
  console.log(updateuser)

  //  await Userdb.updateOne({ email:  req.session.forgotuser},{$set:{password:hashedPassword}})

  //  const uu= await Userdb.findOne({ email:  req.session.forgotuser})

  res.redirect("/login")


}


exports.singleproductpageaxios = async (req, res) => {
  const productId = req.query.id
  const userId=req.query.userId

  try {
      if(userId==="undefined"){
       console.log('hiii')
       const product = await Product.find({ _id: productId })
       const result={product}
       return  res.send(result)
      }
    
      const productCart = await cartdb.findOne(
        { userId: userId, "cartItems.productId": productId },
    );
    
    const product = await Product.find({ _id: productId })
   
    const result={product,productCart}

    res.send(result)

  } catch (err) {

    res.status(500).send(err)

  }


}


exports.addtoCart = async (req, res) => {

  const productId = req.query.id
  const userId = req.session.userId


  if(typeof userId==="undefined"){
    console.log('hiii')
    return  res.redirect('/login')
     
   }
 
 

  let checkCart= await cartdb.findOne({userId: userId,})
  if(!checkCart){
   checkCart = new cartdb({
    userId: userId,
    cartItems: [{
      productId: productId
    }]
  })
 }else{
   checkCart.cartItems.push({
      productId: productId
  })
}
  // save user in db     
 console.log(checkCart)
   checkCart
   .save()
    .then(data => {
      res.redirect("/cart")
    })
    .catch(err => {
      res.status(400).send({
        message: err.message || "some error occured while creating option "
      });
    });
}

exports.removeCart=async(req,res)=>{
 const userID=req.session.userId
 const productId=req.query.id
try{

  const d=await cartdb.findOne({ userId:userID})
  console.log(d)
  const index = d.cartItems.findIndex((value) => {
    return value.productId.toString() === productId;
  });
  console.log(index)
 
  d.cartItems.splice(index,1)
  await d.save()   
  res.redirect('/cart')
}catch(err){  
  res.status(500).send(err)
}

}

exports.updateQuantity= async(req,res)=>{
  console.log('klkl');
  const userId=req.session.userId
  const productId=req.query.pid
  const qty=req.query.qty
  console.log(qty);
  try{
   const d= await  cartdb.updateOne({userId:userId,'cartItems.productId':productId},{$set:{'cartItems.$.quantity':qty}})
   console.log(d);
   res.send(true);
  }catch(err){
    res.send(err)
  } 
  
 
  
}



exports.userUpdate=async(req,res)=>{
  console.log("hiii");
  const userId=req.session.userId
  console.log(req.body)
 try{
  const user=await Userdb.updateOne({_id:userId},{$set:{name:req.body.name,email:req.body.email}}) 
  console.log(user);
}catch(err){
  res.send(err)
}


}





// axios  

exports.findproduct = async (req, res) => {
  try {
    const product = await Product.find({ status: true })
    res.send(product)

  } catch (err) {
  
    res.status(500).send(err)
   
  }



}


exports.findcateogary = async (req, res) => {

  try {
    const product = await Cateogary.find({ status: true })
    res.send(product)

  } catch (err) {

    res.status(500).send(err)

  }


}

exports.cateogaryproductpage = async (req, res) => {
  const CateogaryName = req.query.name
  console.log(CateogaryName)
  try {
    const product = await Product.find({ cateogary: CateogaryName, status: true })
    res.send(product)
    console.log("Product:", product);

  } catch (err) {

    res.status(500).send(err)

  }


}

exports.findUser = async (req, res) => {

  try {
    const user = await Userdb.findOne({ email: req.query.user });
    console.log(req.query.user)
    res.send(user)

  } catch (err) {
    res.status(500).send(err)
  }

}

// show cart 

exports.findCart = async (req, res) => {
  const userId = req.query.id
  console.log(userId)
  console.log("hekkk")
  try {
    console.log("lll")

    let userCart = await cartdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $unwind:"$cartItems"
      },
      {
        $lookup:{
          from:"products",
          localField:"cartItems.productId",
          foreignField:"_id",
          as:"productDetails"

        }
      },
      {
        $project:{
          userID:1,
          cartItems:1,
          productDetails:1
        }
      }         
    ])
    console.log(userCart)
    res.send(userCart)
  } catch (err) {
    res.send(err)
  }
}

// show update user

exports.updateUser=async(req,res)=>{

  const id=req.query.updateUser
  try{
     const data=await Userdb.findOne({_id:id})
     res.send(data)
  }catch(err){
    res.send(err)
  }

}