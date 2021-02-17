const express = require('express');
const router = express.Router();
const Survey= require('../model/survey.model')
const Answer= require('../model/answer.model')
const multer = require('multer')
const multerConfig = require('../config/multerConfig.js')
const aws = require ('aws-sdk');
const s3=new aws.S3({     
  accessKeyId:"AKIAZYXQ555RAI7HZQDG",
  secretAccessKey:"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",
  region:'sa-east-1'
  });





//mostrar
router.get('/survey', function (req, res) {
  Survey.find().sort({createdAt: -1}).then((surveys)=>res.json(surveys)) 
});

router.get('/survey/:id', function (req, res) {
  Survey.findOne({_id: req.params.id}).then((survey)=>res.json(survey)) 
});

//subir imagen s3
router.post('/s3' , multer(multerConfig).single('file') , async (req , res)=> {
const {originalname: name , size , key , location: url = ''} = req.file 
return res.send({url ,key })
})

//eliminar imagen S3

router.delete('/s3/:key' , async (req , res)=>{
s3.deleteObject({
  Bucket:'survey.images.shopapp.com',
  Key: req.params.key
})
res.send('delete');

})

//agregar
router.post('/survey', function (req, res) {
const data=req.query

 data.questions =data.questions.map((q)=>{
  return JSON.parse(q)
 })  
  
  if (!data){
      return res.status(400).json({
        message: "Error"
      })
  } 
  
    const survey=new Survey (data) 



    survey.save().then(()=>{
      res.status(200).json({
        survey: survey
      })
    }).catch(err =>{
      res.status(500).json({
        message:err
      })
    })   
});

router.delete('/delete/:id', function(req,res){
  Survey.deleteOne({
      _id:req.params.id
  }).then(()=> res.send('delte'))
})

router.put('/edit' , function (req , res) {
const data=req.query
const _id=req.query._id

 data.questions =data.questions.map((q)=>{
  return JSON.parse(q)
 })  
 Survey.replaceOne({_id }, data).then(()=> res.send('editado'));
})

router.get('/answers/:id' , function(req , res){
  Answer.find({surveyId:req.params.id}).then((answers)=>res.json(answers)) 
})

router.post('/answer' , function(req , res){
req.query.responses =req.query.responses.map((r)=>{
  return JSON.parse(r)
 }) 
 
 let data=req.query.responses  

 if (!data){
  return res.status(400).json({
    message: "Error"
  })
} 
 Answer.insertMany(data).then(()=> res.send('ok')).catch(err => res.send('error'))
})


module.exports = router;