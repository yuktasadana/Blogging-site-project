const { default: mongoose } = require("mongoose")
const blogsModel = require("../Models/blogsModel")



let validation = async function(req,res,next){

try {

    let {title,body,authorid,category,subcategory} = req.body 

    if (!title){res.status(400).send({status:false ,msg:"tittle is required"})}
    if (!body){res.status(400).send({status:false ,msg:"body is required"})}
    if (!authorid){res.status(400).send({status:false ,msg:"authorid is required"})}
    if (!category){res.status(400).send({status:false ,msg:"category is required"})}
    if (!subcategory){res.status(400).send({status:false ,msg:"subcategory is required"})}

    if (!mongoose.Types.ObjectId.isValid(authorid)){
        return res.status(400).send({satus:false, msg: "authorid is not valid"})
    }
    
    next()  
} catch (error) {
    res.status(500).send({msg: error.message})
}
}

let authorvalidation = async function (req,res,next){

    let {fname,lname,title,email,password} = req.body

   if(!fname || !lname || !title ||  !email || !password){
       res.status(400).send("all fields are mandatory")
   }

    function validName(fname){
       const regex = /^[a-zA-z]+$/;
       return regex.test(fname)}
   
   function validEmail(email){
        const regex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        return regex.test(email)}

   function validpassword(password){
       const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
       return regex.test(password)}


    let checkEmail = validEmail(email)
    let checkname = validName(fname)
    let checkpassword = validpassword(password)
   

   if(!checkname){res.status(400).send("Enter valid name")}
   if(!checkEmail){res.status(400).send("Enter valid email")}
   if(!checkpassword){res.status(400).send("Enter valid password")}

   next()
   
   }   

   module.exports.validation = validation
   module.exports.authorvalidation= authorvalidation

