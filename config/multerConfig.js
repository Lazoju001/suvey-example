const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require ('multer-s3')


module.exports = { 
    // storage: multer.diskStorage({
    //     dest:'path de destino',
    //     destination= (req , file , cb) => {
    //         cb(null , 'path de destino')
    //     },
    //     filename = () => {
    //         crypto.randomBytes(16 , (err , hash)=> {
    //             if(err) cb(err);
    //             const fileName = `${hash.toString('hex')}-${file.originalname}`;
    //             cb(null , fileName)
    //         })
    //     } 
    //     })
    storage:multerS3({
        s3: new aws.S3({     
                accessKeyId:"AKIAZYXQ555RAI7HZQDG",
                secretAccessKey:"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",
                region:'sa-east-1'
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