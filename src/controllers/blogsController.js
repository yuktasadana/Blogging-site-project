const blogsModel = require("../Models/blogsModel");
const blogsmodel = require("../Models/blogsModel")


const createblogs = async function (req,res){

try {

    let data = req.body

    let blog = await blogsmodel.create(data)

    return res.status(201).send({status: true , data: blog})

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

const getblogs = async function (req,res){

    try {

        let dataa = req.query

        dataa.isdeleted = false
        dataa.isPublished = true

        let filtered = await blogsmodel.find(dataa).populate("authorid")

        console.log(filtered);

        if (filtered){
        return res.status(200).send ({status: true , data: filtered})

        }else return res.status(404).send ("data not found") 
        
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

const updatedblogs = async function (req, res) {
    
    try {
        let dataa = req.body;
        let blogId = req.params.blogId;

        if (Object.keys(dataa).length == 0)
            return res.status(404).send({ status: false, msg: 'Enter blog Details' })
        if (!blogId)
            return res.status(404).send({ status: false, msg: 'BlogId is missing' })

        let findBlogId = await blogsModel.findById(blogId);

        if (findBlogId.isdeleted == true) {
            return res.status(404).send({ status: false, msg: "Blog is deleted" })

        }
        let updatedblogs = await blogsModel.findOneAndUpdate({ _id: blogId }, {
            $set: {
                tittle: dataa.tittle,
                body: dataa.body,
                publishedAt: new Date(),
                isPublished: true,
            },
            $push: { tags: req.body.tags, subcategory: req.body.subcategory },
        },
            { new: true, upsert: true },
        );
        return res.status(200).send({ status: true, data: updatedblogs });
        
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const deleted = async function (req,res){

    try {
        let blogId = req.params.blogId;

        if (!blogId)
            return res.status(404).send({ status: false, msg: 'BlogId is missing' })
    
        let blog = await blogsModel.findById({_id:blogId})

        if(!blog){return res.status(404).send({ status: false, msg: "Blogid dont exit" })}

        if (blog.isdeleted==true) {
            return res.status(404).send({ status: false, msg: "Blogs is already deleted" })
        }
        
        await blogsModel.findOneAndUpdate({ _id: blogId }, {
            $set: {
                deletedAt: new Date(),
                isdeleted: true,
            }
        },
            { new: true, upsert: true },
        );

        return res.status(200).send({status:true,msg: "deleted succesfully"})
        
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

    
const DeleteBlogsByQuery = async function (req, res) {

try {

      let dataa = req.query;
      
      if (Object.keys(dataa).length == 0) {

        return res.status(404).send({ status: false, msg: "query is required" });}

      const deleteData = await blogsModel.updateMany(
        { $and: [dataa, { isdeleted: false }] },
        { $set: { isdeleted: true ,deletedAt : new Date()}}
      );


    if (deleteData.modifiedCount == 0)
        return res.status(404).send({ status: false, msg: "No blog are found for Update" });
  
    res.status(200).send({status: true, data : deleteData});

    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };

module.exports.createblogs = createblogs
module.exports.getblogs = getblogs
module.exports.updatedblogs = updatedblogs
module.exports.deleted = deleted
module.exports.DeleteBlogByQuery = DeleteBlogsByQuery

