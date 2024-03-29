const express = require('express');
const router = express.Router();
const Survey= require('../model/survey.model')
const Answer= require('../model/answer.model')
const multer = require('multer')
const multerConfig = require('../config/multerConfig.js')
const aws = require ('aws-sdk');
require('dotenv').config();
const s3=new aws.S3({     
  accessKeyId:process.env.AWS_ACCES_KEY,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_DEFAULT_REGION
  });



//mostrar
router.get('/survey', function (req, res) {
  console.log('/survey')
  Survey.find().sort({createdAt: -1}).then((surveys)=>res.json(surveys)) 
});

router.get('/survey/type/:type', function (req, res) {
  console.log('/survey/type/:type')
  Survey.find({type: req.params.type}).sort({createdAt: -1}).then((surveys)=>res.json(surveys)) 
});

router.get('/survey/:id', function (req, res) {
  console.log('/survey/:id')
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
const data=req.body
  
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

const data=req.body
const _id=req.body._id

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