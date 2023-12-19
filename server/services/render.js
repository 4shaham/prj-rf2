const axios=require("axios")

exports.homeRoutes=(req,res)=>{
   
    axios.all([
      axios.get(`http://localhost:${process.env.PORT}/homeproductaxios`) ,
      axios.get(`http://localhost:${process.env.PORT}/homecateogaryaxios`) 
   ])
   .then(axios.spread((data1,data2)=>{
      res.render("homepage",{Product:data1.data,cateogary:data2.data,isLogged:req.session.authentication}) 
   })).catch(err=>{
      res.send(err)
   })
}
 

 exports.loginRoutes=(req,res)=>{

    res.render("login",{emailmessage: req.session.email,passwordmessage: req.session.password,message:req.session.message,emailvalidation:req.session.emailvalidation,emailvalue:req.session.emalevalue,passwordValue: req.session.passwordValue}, (err, html) => {
      if(err){
         console.log('render err',err);
         return res.send('Internal server  err');
      }
      delete req.session.password;
      delete req.session.message;
      delete req.session.email;
      delete req.session.emailvalidation;
      delete req.session.emalevalue;
      delete  req.session.passwordValue;

      res.send(html);

    })

 } 

 exports.otpRoutes=(req,res)=>{   

    res.render("registration1",{message:req.session.Otpeerrmessage,findEmail:req.session.findEmail},(err,html)=>{
      if(err){
         res.send(err)
      }
      delete req.session.Otpeerrmessage;
      delete req.session.findEmail;
      res.send(html)
    }) 
 } 
     
 exports.otp2Routes=(req,res)=>{
    res.render("registration2")     
 } 
 
 exports.registrationRoutes=(req,res)=>{
    res.render("registration3",{bodyMessage: req.session.body,confimPasswordErr:req.session.chekingPassword,requiredPassword: req.session.requiredPassword,requiredConfirmPassword: req.session.requiredConfirmPassword,emailValidation: req.session.passwordValidation},(err,html)=>{
      if(err){
         console.log('render err',err);
         return res.send('Internal server  err');
      }

      delete req.session.body;
      delete req.session.chekingPassword;
      delete req.session.requiredPassword;
      delete req.session.requiredConfirmPassword;
      delete req.session.passwordValidation;
     
      res.send(html);  
    })   
 } 
  
 exports.forgot1Routes=(req,res)=>{ 
   res.render("forgotpassword1")
}
  
exports.forgot2Routes=(req,res)=>{

   res.render("forgotpassword2")

}
exports.forgot3Routes=(req,res)=>{

   res.render("forgotpassword3")

}

exports.logout=(req,res)=>{
   const useremail=req.session.logoutemail
   axios.get(`http://localhost:${process.env.PORT}/findUseraxios?user=${useremail}`) 
    
   .then((response)=>{     
   
      res.render("logout",{user:response.data}) 
      
  }).catch(err=>{  
      res.send(err)   
  })     
}


exports.singleproductpage=(req,res)=>{
   const productId=req.query.id
   const userId= req.session.userId


   axios.get(`http://localhost:${process.env.PORT}/singleproductaxios?id=${productId}&userId=${userId}`) 
   
   .then((response)=>{      
      res.render("singleproductpage",{product:response.data.product,isCart:response.data.productCart})
  }).catch(err=>{  
      res.send(err)   
  }) 
   
}
exports.cateogaryproductpage=(req,res)=>{
   const name=req.query.name
   axios.get(`http://localhost:${process.env.PORT}/cateogaryproductpageaxios?name=${name}`) 

   .then((response)=>{      
      res.render("categaryProduct",{product:response.data}) 
  }).catch(err=>{  
      res.send(err)   
  })     
}


exports.cartPage=(req,res)=>{
   const userid=req.session.userId
   
   axios.get(`http://localhost:${process.env.PORT}/findCartaxios?id=${userid}`) 
   .then((response)=>{      
      res.render("cartPage",{userCart:response.data}) 
  }).catch(err=>{  
      res.send(err)   
  })       
}


exports.updateUser=(req,res)=>{
   const usereId=req.query.id
   axios.get(`http://localhost:${process.env.PORT}/updateUseraxios?updateUser=${usereId}`)
   .then((response)=>{      
      res.render("updateUser",{user:response.data}) 
  }).catch(err=>{  
      res.send(err)   
  })  
}

exports.updateUserPassword=(req,res)=>{
  console.log("kil");
   res.render("userPasswordUpdate") 

}

exports.address=(req,res)=>{
   const userid=req.session.userId
   axios.get(`http://localhost:${process.env.PORT}/addressaxios?id=${userid}`) 
   .then((response)=>{      
      res.render('userAddress',{addresData:response.data})
  }).catch(err=>{  
      res.send(err)   
  })
}

exports.addAddress=(req,res)=>{

   res.render('addAddress',{err: req.session.addressErr},(err,html)=>{
      if(err){
         console.log(err)
      }

      delete req.session.addressErr;

      res.send(html)
   })

}


exports.checkout=(req,res)=>{

   const userid=req.session.userId
   axios.all([
       axios.get(`http://localhost:${process.env.PORT}/checkoutCartAxios?id=${userid}`) ,
       axios.get(`http://localhost:${process.env.PORT}/checkoutaxios?id=${userid}`) 
   ])
   
//    .then(axios.spread((data1,data2))=>{      
//       res.render('checkout',{address:response.data})
//       console.log(response.data);
//   }).catch(err=>{  
//       res.send(err)   
//   })


  .then(axios.spread((data1,data2)=>{
   res.render("checkout",{userCart:data1.data,address:data2.data,onclickONPayment:req.session.paymentSelection},(err,html)=>{
    if(err){
      res.send(err)
    }
    delete req.session.paymentSelection;
    res.send(html)

   }) 
})).catch(err=>{
   res.send(err)
})



}


exports.checkoutAddAddress=(req,res)=>{

   res.render("checkoutAddAddress")

}

exports.buyNowPage=(req,res)=>{

   const productId=req.query.id
   console.log(productId);
   
   axios.get(`http://localhost:${process.env.PORT}/findBuyNowAxios?id=${productId}`) 

   .then((response)=>{
      res.render('buyNowPage',{buyNowProduct:response.data})
   }).catch(err=>{
      res.send(err) 
   })



}