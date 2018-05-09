const express = require('express');
const router = express.Router();
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Products = require('../models/product');


router.post('/signup',(req,res,next)=>{
User.find({email:req.body.email})
.exec()
.then((user)=>{
    if(user.length >= 1){
        return res.status(409).json({message:'Email exists'});
    }else{
       bc.hash(req.body.password,10,(err,hash)=>{
    if(err){
      return res.status(500).json({
          error:err
      });
    }else{
        const user = new User({
            _id : new mongoose.Types.ObjectId(),
            email:req.body.email,
            password:hash
        });
        user.save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message:'user created'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });
     }
});  
    }
});
});//end of first route




router.post('/login',(req,res,next)=>{
   
  User.find({email:req.body.email})
   .exec()
   .then((user)=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Email not found'
            });
        }//end if
        
    
            bc.compare(req.body.password,user[0].password,(err,result)=>{
        
             if(err){
                    return res.status(401).json({
                    message:'Auth fail'
                       });
            }//end if
            if(result){
                const token = jwt.sign({email:user[0].email,
                    id:user[0]._id},'secretpass',{expiresIn:"1h"}
            );

               return  res.status(200).json({
                message:'Auth sucessful',
                token:token
                       });
            } //end if

            res.status(401).json({

            message:'Auth failing'
        });
     });//end of bc
          
   })//end bracket of then

   .catch(err=>{
       console.log(err);
      res.status(500).json({
        error:err
      });//end status
   })//end of catch
   ;//end of user.find
});//end route



//delete route
/**router.delete('/:userId',(req,res,next)=>{
  
  const id = req.params.userId;
  User.remove({_id:id})
  .exec()
  .then(result=>{
    res.status(200).json({
      message:'user deleted'
    });
    })
    .catch(err=>{
    console.log(err);
      res.status(500).json({
          error:err
      });
   });

  
});

//delete route
/**router.delete('/:userId',(req,res,next)=>{
  
  const id = req.params.userId;
  User.remove({_id:id})
  .exec()
  .then(result=>{
    res.status(200).json({
      message:'user deleted'
    });
    })
    .catch(err=>{
    console.log(err);
      res.status(500).json({
          error:err
      });
   });


});
//login route
/**router.post('/login',(req,res,next)=>{
   
  User.find({email:req.body.email})
   .exec()
   .then((user)=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Auth faile'
            });
        }//end if
    
            bc.compare(req.body.password,user[0].password,(err,result)=>{
             if(err){
                    return res.status(401).json({
                    message:'Auth fail'
                       });
            }//end if
            if(result){
               return  res.status(200).json({
                message:'Auth sucessful'
                       });
            } //end if

            res.status(401).json({
            message:'Auth failing'
        });
     });//end of bc      
   })//end bracket of then

   .catch(err=>{
       console.log(err);
      res.status(500).json({
        error:err
      });//end status
   })//end of catch
   ;//end of user.find
});//end route

**/
//delete route
/**router.delete('/:userId',(req,res,next)=>{
  
  const id = req.params.userId;
  User.remove({_id:id})
  .exec()
  .then(result=>{
    res.status(200).json({
      message:'user deleted'
    });
    })
    .catch(err=>{
    console.log(err);
      res.status(500).json({
          error:err
      });
   });

  
});//end of fx
**/




module.exports = router;