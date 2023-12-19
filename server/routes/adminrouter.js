
const express=require("express")
const route=express.Router()
const adminservices=require('../services/adminrender')
const controller=require('../controller/adminside/admincontroller')
const store=require('../controller/adminside/multer.js')
const middeleware=require("../../middeleware/middeleware.js")




 
route.get('/adminlogin',adminservices.adminloginRoutes)

route.get('/admin/',middeleware.adminchecking,adminservices.admindashRoutes)

// usermanagment  

route.get('/admin/UserManagment',middeleware.adminchecking,adminservices.adminUserManagment)



// product managment

route.get('/admin/productManagment',middeleware.adminchecking,adminservices.adminProductManagment)

route.get('/admin/addproduct',middeleware.adminchecking,adminservices.adminaddproduct)

route.get('/admin/editproduct',middeleware.adminchecking,adminservices.admineditproduct)

route.get('/admin/unlistproduct',middeleware.adminchecking,adminservices.adminunllistproduct)




// cateogarymanagment  

route.get('/admin/cateogaryManagment',middeleware.adminchecking,adminservices.admincateogarymanagment)

route.get('/admin/addCateogaryManagment',middeleware.adminchecking,adminservices.adminAddCateogarymanagment)

route.get('/admin/unlistCateogaryManagment',middeleware.adminchecking,adminservices.adminUnlistCateogarymanagment)

route.get('/admin/editcateogary',adminservices.admineditcateogary)
   
// add catrogary

route.post('/admin/addCateogary',store.array('image',1),controller.addcateogary)

// delete cateogary

route.get('/admin/unlistCateogary',controller.unlistcateogary)

//recycle 

route.get('/admin/unlistrecycleCateogary',controller.unlistrecyclecateogary)

// edit cateogary  

route.post('/admin/editCateogary',store.array('image',1),controller.editcateogary)

//api  
   

route.post('/admin/login',controller.verification)

// add to product  

route.post('/admin/addproduct',store.array('image',12),controller.addproduct)

// delete product 

route.get('/admin/deleteproduct',controller.deleteproduct)

//recycle product

route.get('/admin/recycleproduct',controller.recycleproduct)

//editproduct 

route.post("/admin/editproduct",store.array('image',12),controller.editproduct)


//usermanagment blocked

route.get('/admin/blockeduser',controller.blockeduser)

// usermanagment unblock

route.get('/admin/unblockeduser',controller.unblockUser)

// logout api 

route.get('/admin/logout',controller.logout)   

// axios    


route.get('/admin/findproduct',controller.findproduct)

route.get('/admin/unlistProductaxios',controller.findunlistproductaxios)
           
route.get('/admin/editproductAxios',controller.findeditproduct)

route.get('/admin/findCateogary',controller.findCateogary)

route.get('/admin/findUnlistCateogary',controller.findUnlistCateogary)

route.get('/admin/usermanagmentAxios',controller.finduser)

route.get('/admin/editcateogaryAxios',controller.findeditCateogary)

module.exports=route;
  