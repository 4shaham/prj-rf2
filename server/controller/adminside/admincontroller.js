const Product=require("../../model/product.schema")

const Cateogary=require("../../model/cateogary.schema")

const Userdb=require("../../model/User schema")
exports.verification=(req,res)=>{


    const a={
        adminName:"shaham",
        adminPassword:"9995589030"  
    }
  const {adminName,adminPassword}=a
    
    console.log(a.adminName)

    
    const b={
        name:req.body.name,
        password:req.body.password

    }

    const {name,password}=b
 
    if(name==adminName && password == adminPassword ){
        req.session.admin=true
        res.redirect("/admin/")
    }else{
        req.session.adminerrmessage="pass"
    }

}

exports.addproduct=(req,res)=>{
     
    //  if(!req.body.pname){
    //   req.session.pname="the pname is required"
    //  }
    //  if(!req.body.bname){
    //   req.session.bname="the bname is required"
    //  }
    //  if(!req.body.category){
    //   req.session.category="the category is required"
    //  }
    //  if(!req.body.subtitle){
    //   req.session.subtitle="the subtitle is required"
    //  }
    //  if(!req.body.descriptionheading){
    //   req.session.descriptionheading="the descriptionheading is required"
    //  }
    //  if(!req.body.description){
    //   req.session.description="the description is required"
    //  }
    //  if(!req.body.firstprice){
    //   req.session.firstprice="the firstprice is required"
    //  }
    //  if(!req.body.lastprice){
    //   req.session.lastprice="the lastprice is required"
    //  }
    //  if(!req.body.discount){
    //   req.session.discount="the discount is required"
    //  }
    //  if(!req.body.color){
    //   req.session.color="the color is required"
    //  }
    //  if(!req.body.instock){
    //   req.session.instock="the instock is required"
    //  }
    //  if(!req.body.images){
    //   req.session.images="the images is required"
    //  }

    // if(req.session.pname||req.session.bname|| req.session.category||req.session.subtitle||req.session.descriptionheading|| req.session.description||req.session.firstprice|| req.session.lastprice||
    //   req.session.discount||req.session.color||req.session.instock||req.session.images){
    //     res.redirect("/admin/addproduct")  
    //  }

     console.log(req.body.pname +"this is body")

  const file=req.files
  const images=file.map((values)=>`/img/${values.filename}`);
  console.log(file);


 // save in db 
 const product=new Product({ 
    pname:req.body.pname,
    bname:req.body.bname,
    cateogary:req.body.category,
    subtitle:req.body.subtitle,
    descriptionheading:req.body.descriptionheading,
    description:req.body.description,
    firstprice:req.body.firstprice,    
    lastprice:req.body.lastprice,
    discount:req.body.discount, 
    color:req.body.color,
    instock:req.body.instock,    
    image:images
})

product 
  .save(product)    
  .then( data=>{
    console.log("correct")
    res.redirect("/admin/productManagment")  
 }) .catch(err=>{
    console.log("heloo")
    res.status(400).send({
        message:err.message||"some error occured while creating option "
    });  
 });
 
}   

exports.deleteproduct=async(req,res)=>{

  const deleteid=req.query.id
  console.log(deleteid);
  const d=await Product.updateOne({_id:deleteid},{$set:{status:false}})
  res.redirect("/admin/productManagment")
}

exports.findunlistproductaxios=async(req,res)=>{
   await Product.find({status:false})
   .then(product=>{
     res.send(product)
   }).catch(err=>{
    res.status(500).send({message:err.message})
  })
}

exports.recycleproduct=async(req,res)=>{
  const recycleid=req.query.id
  console.log(recycleid);
  await Product.updateOne({_id:recycleid},{$set:{status:true}})
  res.redirect("/admin/unlistproduct")
}



// axios  

exports.findproduct=async(req,res)=>{

     const page=req.query.page;
     const perPage=4;
     const skip= parseInt(Math.ceil((page -1)*Number(perPage)));
     console.log(skip,page,perPage);

  
      const product = await Product.find({status:true}).skip(skip).limit(perPage);
      let countDoc = await Product.find({status: true}).count();

      countDoc = Math.ceil(Number(countDoc)/perPage);

      console.log(product);
      const result = {
        product,
        countDoc
      }
      res.send(result)

     
}

exports.findeditproduct=async(req,res)=>{

 req.session.editid=req.query.id

       const data=await Product.findOne({_id:req.session.editid})
      .then(data=>{
        if(!data){
          res.status(404).send({message:`dcannot  user with ${id}.may be not user found`})
        }else{
          res.send(data)
        }
      }).catch(   err=>{   
        res.status(500).send({message:err.message})
      })

}   


exports.editproduct=async(req,res)=>{ 
  
  const editid=req.query.id
  const file=req.files
  console.log(file); 
  const images=file.map((values)=>`/img/${values.filename}`);

const dd=await Product.updateOne({_id:editid},{$set:{   
  pname:req.body.pname,
  bname:req.body.bname,
  cateogary:req.body.category,
  subtitle:req.body.subtitle,
  descriptionheading:req.body.descriptionheading,
  description:req.body.description,
  firstprice:req.body.firstprice,    
  lastprice:req.body.lastprice,
  discount:req.body.discount, 
  color:req.body.color,
  instock:req.body.instock,
  
}})

await Product.updateOne({_id: editid},{$set:{image:images}})  

  res.redirect("/admin/productManagment")



}


// cateogary managment  

exports.addcateogary= async (req,res)=>{
  
  if(!req.body){
      res.status(400).send({message:"hi you entered any thing"})
      return   
   }
  if(await Cateogary.find({categary:req.body.Category})) {
      console.log("hiklo")
      req.session.cateogaryerr="already use this cateogary"
      return res.redirect("/admin/addCateogaryManagment")
  }
const file=req.files
const images=file.map((values)=>`/img/${values.filename}`);
console.log(file);



// save in db       
const cateogary=new Cateogary({ 
  categary:req.body.Category,    
  image:images
})
cateogary
.save(cateogary)    
.then( data=>{
  console.log("correct")
  res.redirect("/admin/cateogaryManagment")  
}) .catch(err=>{
  console.log("heloo") 
  res.status(400).send({
      message:err.message||"some error occured while creating option "
  });  
});

}   


exports.findCateogary=(req,res)=>{

  const page=req.query.page;
  const perPage=2;
  const skip= parseInt(Math.ceil((page -1)*Number(perPage)));
  console.log(skip,page,perPage);
    
Cateogary.find({status:true}).skip(skip).limit(perPage)
    .then(catrogary=>{
      console.log(catrogary)
      res.send(catrogary)
    }).catch(err=>{
      res.status(500).send({message:err.message})
    })

}

exports.editcateogary=async(req,res)=>{ 

  const editid=req.query.id
  const file=req.files
  console.log(file); 
  const images=file.map((values)=>`/img/${values.filename}`);
 try{
  const dd=await Cateogary.updateOne({_id:editid},{$set:{categary:req.body.Category}})

  if(!file){
     console.log("hii")
  }else{
    await Cateogary.updateOne({_id: editid},{$set:{image:images}})  
  }
  
  
  res.redirect("/admin/cateogaryManagment")
 }catch(err){
   res.send("internal error")
 }



}

exports.unlistcateogary=async(req,res)=>{

  const deleteid=req.query.id
  console.log(deleteid);
  const d=await  Cateogary.updateOne({_id:deleteid},{$set:{status:false}})
  console.log(d)
  res.redirect("/admin/cateogaryManagment")
}

exports.findUnlistCateogary=(req,res)=>{
  
  Cateogary.find({status:false})
   .then(catrogary=>{
     res.send(catrogary)
   }).catch(err=>{
     res.status(500).send({message:err.message})
   })

}

exports.unlistrecyclecateogary=async(req,res)=>{

  const recycleid=req.query.id
  const d=await  Cateogary.updateOne({_id:recycleid},{$set:{status:true}})
  res.redirect("/admin/unlistCateogaryManagment")

}

exports.findeditCateogary=async(req,res)=>{

  const cateogaryeditid=req.query.id
  console.log( cateogaryeditid)
  const data=await Cateogary.findOne({_id:cateogaryeditid})
  .then(data=>{
    
    if(!data){
      res.status(404).send({message:`dcannot  user with ${id}.may be not user found`})
    }else{
      res.send(data)                      
    }
  }).catch( err=>{   
    res.status(500).send({message:err.message})
  })


}



// axios user


 exports.finduser=async(req,res)=>{

  const page=req.query.page;
  const perPage=5;
  const skip= parseInt(Math.ceil((page -1)*Number(perPage)));
  console.log(skip,page,perPage);
 
   
  await Userdb.find().skip(skip).limit(perPage)
  .then(user=>{   
    console.log(user)
    res.send(user)
  }).catch(err=>{
    res.status(500).send({message:err.message})
  })

 }

 // blocked user

   exports.blockeduser=async(req,res)=>{
      const blockedid=req.query.id
    try{
      await Userdb.updateOne({_id:blockedid},{$set:{blocked:true}})   
      res.redirect("/admin/UserManagment")
    }catch(err){
      res.send(err)
    }

   }

   //unblocked user 

  exports.unblockUser=async(req,res)=>{
    const unblockid=req.query.id
    try{
      await Userdb.updateOne({_id:unblockid},{$set:{blocked:false}})
      res.redirect("/admin/UserManagment")
    }catch(err){
      res.send(err)
    }
  }
   
  exports.logout=(req,res)=>{
     req.session.admin=true
     res.redirect("/adminlogin")
  }