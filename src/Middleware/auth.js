let jwt = require('jsonwebtoken')
const blogsModel = require("../Models/blogsModel")
const mongoose = require("mongoose")

//---------------------Authentication------------------------------//

const Authentication = function (req,res,next){
    try{
    
    let token = req.headers["x-api-key"]

    if(!token)

    return res.status(400).send({status:false,msg:"Token must be present"})

    //---verify----//

    // const decodedToken = jwt.verify(token,"lithiumproject1")

    // if(!decodedToken)

    // return res.status(400).send({status:false,msg:"Token is invalid"})

     jwt.verify(token,"lithiumproject1",(err, decode) => {if (err) {let msg = err.message === "jwt expired"? "Token is expired": "Token is invalid"
            return res.status(400).send({ status: false, message: msg })
          }
          req.decode = decode
        })
        
    next();

}catch(err){
    res.status(500).send({status:false,msg: err.message})
}
};

const Authorization = async function (req,res,next){
    try{

        // token = req.headers["x-api-key"] 

        // const decodedToken = jwt.verify(token,"lithiumproject1")

        let authorLoggedIn = req.decode.authorid

        let blogid = req.params.blogId

        let isvalid = mongoose.Types.ObjectId.isValid(blogid)

        if (isvalid){

        let blog = await blogsModel.findById(blogid)

        if(!blog){res.status(404).send({status:false,msg:"blogid does not exit"})}

        if(blog.authorid != authorLoggedIn) return res.status(401).send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
        
        }
    }catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }

    next()
}

module.exports.Authentication = Authentication
module.exports.Authorization = Authorization