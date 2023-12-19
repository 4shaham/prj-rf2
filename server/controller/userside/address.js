
const Address=require('../../model/address.schema')

exports.addAddress= async(req,res)=>{

    if(! req.body.name & !req.body.phoneNumber & !req.body.pinCode & !req.body.address){ 
        req.session.addressErr="The fields is required "
        return res.redirect("/addAddress")
    }
   
    const userId = req.session.userId
    let checkAddress= await Address.findOne({userId: userId})
    if(!checkAddress){
      checkAddress = new  Address({
          userId: userId,
                address: [{
                    name: req.body.name,
                    postalCode:req.body.pinCode,
                    address:req.body.address,
                    phoneNumber:req.body.phoneNumber,  
                    city:req.body.city,
                    defaultAddress:true,
                }]
          })
   }else{
    console.log(req.body.city)
    checkAddress.address.push({
        name: req.body.name,
        postalCode:req.body.pinCode,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber, 
        city:req.body.city,
    })
  }
    // save user in bd     
   checkAddress
     .save()
      .then(data => {
        res.redirect("/address")
      })
      .catch(err => {
        res.status(400).send({
          message: err.message || "some error occured while creating option "
        });
      });

}


exports.deleteAddress=async(req,res)=>{

  const userID=req.session.userId
  const addressId=req.query.id
 try{
 
   const d=await Address.findOne({ userId:userID})
   
   const index = d.address.findIndex((value) => {
    
     return value._id.toString() === addressId;
       
   });
   console.log(index)
  
   d.address.splice(index,1)
   await d.save()   
   res.redirect('/address')
 }catch(err){  
   res.status(500).send(err)
 }

}


exports.makeDefault=async(req,res)=>{
  const userId=req.session.userId
  const addresId=req.query.id
  console.log(addresId)
  console.log(userId)
  try{
    console.log("hiiii")
     const a=await Address.updateOne({userId:userId,'address.defaultAddress':true},{$set:{'address.$.defaultAddress':false}})
     const d = await Address.updateOne({ userId: userId, "address._id": addresId },{$set:{'address.$.defaultAddress':true}});
     console.log(d)
    res.redirect('/address')
  }catch(err){
      res.status(500).send(err)
  }

}


exports.checkoutChangeAddress=async(req,res)=>{

  console.log("hiikl");
  const userId=req.session.userId  
  const id=req.query.id   

try{

  const b=await Address.updateOne({userId:userId,'address.defaultAddress':true},{$set:{'address.$.defaultAddress':false}})
  const a=await Address.updateOne({'address._id':id},{$set:{'address.$.defaultAddress':true}})
  res.redirect("/checkoutPage")
  console.log(b);
  console.log(a);
}catch(err){

   res.send(err)
   
}

}


// axios 

exports.address=async(req,res)=>{
    const id=req.query.id
    console.log(id)
  try{
    const addresData= await Address.findOne({userId:id})
    if( addresData==null ){
      return res.redirect('/address')
    }
    const address = addresData.address
    res.send(address)
  }catch(err){
    res.status(500).send(err)
  }
}


