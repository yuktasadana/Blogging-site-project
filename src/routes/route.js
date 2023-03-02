const express = require("express")
const router = express.Router()
const authorcontroller = require("../Controllers/authorController")
const blogsController = require("../Controllers/blogsController")
const validate= require("../validations/validation")
const Middlewares = require("../Middleware/auth")



router.post("/createauthors",validate.authorvalidation,authorcontroller.createauthor)

router.post("/loginauthor",authorcontroller.loginauthor)

router.post("/createblogs",validate.validation,Middlewares.Authentication,blogsController.createblogs)

router.get("/getblogs",Middlewares.Authentication,blogsController.getblogs)

router.put("/updatedblogs/:blogId",Middlewares.Authentication,Middlewares.Authorization,blogsController.updatedblogs)

router.delete("/deleted/:blogId",Middlewares.Authentication,Middlewares.Authorization,blogsController.deleted)

router.delete("/deleteblogs",Middlewares.Authentication,Middlewares.Authorization,blogsController.DeleteBlogByQuery)




module.exports = router