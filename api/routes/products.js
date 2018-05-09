const express = require('express');
const router = express.Router();




const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/auth-check');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
});
const upload = multer({storage:storage});


const Product = require('../models/product');


router.get('/',(req,res,next)=>{
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs=>{
         //console.log(docs);
         const response={
             count:docs.length,
             products:docs.map(doc=>{
                 return {
                     name:doc.name,
                     price:doc.price,
                     _id:doc._id,
                     productImage:'http://localhost:3005/'+doc.productImage,
                     request:{
                         type:'GET',
                         url:'http://localhost:3005/products/' + doc._id 
                     }
                 }
             })
         };
         res.status(200).json(response);
                })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.get('/:productId',(req,res,next)=>{
   
    const id = req.params.productId;
    Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc=>{console.log(doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:'GET',
                    url:'http://localhost:3005/products'
                }
            });
        }else{
            res.status(404).json({
                message:'NO valid entry'
            });
        }
      
    })
    .catch(err=>{console.log(err);
    res.status(500).json({error:err})})
    
});

router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const newProduct = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage:req.file.path 
    });
    newProduct.save().then(result=>{
        console.log(result);

        res.status(201).json({
        message:'Data has been posted sucessfully.',
        createdProduct:result
    });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    
      

});




router.delete('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  Product.remove({_id:id})
  .exec()
  .then(result=>{
      res.status(500).json(result);
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({
          error:err
      });
  });

});

router.patch('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  const updateOps = {};

  for (const ops of req.body){
      updateOps[ops.propName]=ops.value;
  }
  Product.update({_id:id},{$set:updateOps})
  .exec()
  .then(result=>{
      console.log(result);
      res.status(200).json({result});
  })
  .catch(err=>{
     console.log(err);
     res.status(500).json({
         error:err
     });
  });

});



module.exports = router;