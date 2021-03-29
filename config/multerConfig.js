const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require ('multer-s3')
require('dotenv').config();

module.exports = { 

    storage:multerS3({
        s3: new aws.S3({     
            accessKeyId:process.env.AWS_ACCES_KEY,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
            region:process.env.AWS_DEFAULT_REGION
                }),
        bucket:'survey.images.shopapp.com',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
        key: (req , file , cb) => {
            crypto.randomBytes(16 , (err , hash)=> {
                            if(err) cb(err);
                            const fileName = `${hash.toString('hex')}-${file.originalname}`;
                            cb(null , fileName)
            });
        }
    })
        ,
    limits:{
            fileSize: 2 * 1024 *1024
        },
    fileFilter: (req , file , cb) => {
            const allowedMimes = [
                'image/jpeg', 
                'image/png',
                'image/gift',
        ];
        if (allowedMimes.includes(file.mimetype)){
            cb(null , true);
        }else {
            cb(new Error('invalid file type.'))
        }
    },
    
}