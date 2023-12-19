
const express=require("express")
const route=express.Router()


const services=require('../services/render')
const controller=require('../controller/userside/controller')
const adressController=require("../controller/userside/address")
const checkoutController=require("../controller/userside/checkout")
const buyNowControoller=require('../controller/userside/buyNow')
const middleware=require("../../middeleware/middeleware")

route.get("/",services.homeRoutes)

route.get("/login",middleware.checking,services.loginRoutes)  
 
route.get("/register1",services.otpRoutes)  
 
route.get("/register2",services.otp2Routes)   

route.get("/register3",services.registrationRoutes)  
  
route.get("/forgotpassword1",services.forgot1Routes) 
  
route.get("/forgotpassword2",services.forgot2Routes)

route.get("/forgotpassword3",services.forgot3Routes)

route.get("/logout",services.logout)

route.get('/updateUser',services.updateUser)

route.get('/updateUserPassword',services.updateUserPassword)

route.get('/productpage',services.singleproductpage)

route.get('/cateogarypage',services.cateogaryproductpage)

route.get('/cart',services.cartPage)

route.get('/address',services.address)

route.get('/addAddress',services.addAddress)

route.get('/checkoutPage',services.checkout)

route.get('/checkoutAddAddress',services.checkoutAddAddress)

route.get('/buyNowPage',services.buyNowPage)


   
// api create 
 

route.post('/api/',controller.create);

route.post('/api/login',controller.validation) 

route.get('/api/logout',controller.logout)



// registration otp

 
route.post('/api/otp',controller.otp)

route.post('/api/otpverification',controller.otpverification)

 
 
//forgot otp  

route.post('/api/forgototp',controller.forgototp)

route.post('/api/forgototpverification',controller.forgototp2)

route.post('/api/updateforgototp',controller.updatepassword)

// cart 
  
route.get('/api/addtocart',controller.addtoCart)

route.get('/api/removeCart',controller.removeCart)

route.post('/api/updateCartQuantity',controller.updateQuantity)



// adress 

route.post('/api/addAddress',adressController.addAddress)

route.get('/api/deleteAddress',adressController.deleteAddress)

route.post('/api/makeDefault',adressController.makeDefault) 



// checkout  

// route.post('/api/checkoutAddressChange',adressController.checkoutChangeAddress)

route.post('/api/checkoutAddressChange',adressController.checkoutChangeAddress) 


route.post('/api/payment',checkoutController.ckeckoutPayment)



// updateUser
  
route.post('/api/updateUser',controller.userUpdate)



// axios  

route.get('/homeproductaxios',controller.findproduct)

route.get('/homecateogaryaxios',controller.findcateogary)
  
route.get('/singleproductaxios',controller.singleproductpageaxios)

route.get('/cateogaryproductpageaxios',controller.cateogaryproductpage)

route.get('/findUseraxios',controller.findUser)

route.get('/findCartaxios',controller.findCart)

route.get('/updateUseraxios',controller.updateUser)

route.get('/addressaxios',adressController.address)

route.get('/checkoutaxios',checkoutController.ckeckout)

route.get('/checkoutCartAxios',checkoutController.ckeckoutCart)

route.get('/findBuyNowAxios',buyNowControoller.buyNow)







module.exports=route;

  