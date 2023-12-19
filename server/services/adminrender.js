
const axios=require("axios")


exports.adminloginRoutes=(req,res)=>{
    res.render("adminlogin")
}   

exports.admindashRoutes=(req,res)=>{       
    res.render("admindashboard")
}
   
exports.adminProductManagment=(req,res)=>{
    const pagination=Number(req.query.page);
    axios.get(`http://localhost:${process.env.PORT}/admin/findproduct?page=${pagination}`)   
    .then((response)=>{      
        res.render("adminProductManagment",{Product:response.data.product, count: response.data.countDoc,cN: pagination});
    }).catch(err=>{  
        res.send(err)   
    })        
}
 
exports.adminaddproduct=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findCateogary`)   
    .then((response)=>{      
       
        res.render("adminaddproduct",{Cateogary:response.data}) 
         
    }).catch(err=>{ 
   
        res.send(err)   
    }) 
      
}
  
  
exports.admineditproduct=(req,res)=>{


         

   const id=req.query.id
   axios.all([
    axios.get(`http://localhost:${process.env.PORT}/admin/editproductAxios?id=${id}`) ,
    axios.get(`http://localhost:${process.env.PORT}/admin/findCateogary`) 
 ])
 .then(axios.spread((data1,data2)=>{
    res.render("admineditproduct",{Product:data1.data,cateogary:data2.data}) 
 })).catch(err=>{
    res.send(err)
 })
 
}   


exports.adminunllistproduct=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/unlistProductaxios`)   
    .then((response)=>{      
        console.log("pppp");
        res.render("adminunlistproduct",{Product:response.data}) 
    }).catch(err=>{
        console.log("hii")    
        res.send(err)   
    })      
    
}

  
exports.admincateogarymanagment=(req,res)=>{

    const pagination=Number(req.query.page);
    
    axios.get(`http://localhost:${process.env.PORT}/admin/findCateogary?page=${pagination}`)   
    .then((response)=>{      
        console.log("pppp");
        res.render("adminCateogaryManagment",{Cateogary:response.data}) 
    }).catch(err=>{
        console.log("hii")    
        res.send(err)   
    }) 
    
}

exports.adminAddCateogarymanagment=(req,res)=>{

    res.render("adminaddCateogary",{message: req.session.cateogaryerr},(err,html)=>{
        if(err){
            console.log('render err',err);
            return res.send('Internal server  err');
        }
        delete req.session.cateogaryerr;
        res.send(html);
    })
}

exports.adminUnlistCateogarymanagment=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/findUnlistCateogary`) 
    .then((response)=>{      
        res.render("adminunlistCateogary",{Cateogary:response.data}) 
    }).catch(err=>{  
        res.send(err)   
    }) 
}


exports.admineditcateogary=(req,res)=>{
    const id=req.query.id
    axios.get(`http://localhost:${process.env.PORT}/admin/editcateogaryAxios?id=${id}`) 

    .then((response)=>{      
        res.render("admineditcateogary",{Cateogary:response.data}) 
    }).catch(err=>{  

        res.send(err)

    }) 
}
//  usermanagment    

exports.adminUserManagment=(req,res)=>{

    const pagination=Number(req.query.page) 
    console.log(pagination);
    axios.get(`http://localhost:${process.env.PORT}/admin/usermanagmentAxios?page=${pagination}`) 
    .then((response)=>{      
        res.render("adminUsermanagment",{Userdb:response.data}) 
    }).catch(err=>{  
        res.send(err)   
    }) 

}