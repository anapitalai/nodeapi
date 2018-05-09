const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Products = require('../models/product');

router.get('/',(req,res,next)=>{
    Order.find()
    .populate('product','name')
    .exec()
    .then(docs=>{console.log(docs);
         res.status(200).json(docs);
                })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.get('/:orderId',(req,res,next)=>{
   
    const id = req.params.OrderId;
    Product.findById(id)
    .exec()
    .then(doc=>{console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message:'No valid entry'
            });
        }
      
    })
    .catch(err=>{console.log(err);
    res.status(500).json({error:err})})
    
});


router.delete('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  Order.remove({_id:id})
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
//post endpoint
router.post('/',(req,res,next)=>{
    Products.findById(req.body.productId)
    .then(product=>{
           const newOrder = new Order({
        _id : new mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product : req.body.productId 
    });
    return newOrder.save()
  
    
})
  .then(result=>{
        console.log(result);

        res.status(201).json({
        message:'Data has been posted sucessfully.',
        //createdOrder:result
    });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

    //update
    router.patch('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  const updateOps = {};

  for (const ops of req.body){
      updateOps[ops.propName]=ops.value;
  }
  Order.update({_id:id},{$set:updateOps})
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

 
      

});




module.exports = router;