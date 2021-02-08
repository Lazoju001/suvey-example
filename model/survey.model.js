const mongoose=require('mongoose')



const actionSchema = mongoose.Schema({
      name:String , 
      metadata:String
})

const answerSchema = mongoose.Schema({
      id:String,
      actions: actionSchema, 
      imageUrl:String,
      postAdImageUrl:String,
      response:String, 

})

const questionSchema = mongoose.Schema({ 
            id:String ,     
            imageUrl:String ,
            title:String , 
            type:String,
            answers:[answerSchema]
})

const surveySchema= mongoose.Schema ({ 
      description:String,
      expire: Date,
      image:String,
      points:String,
      type:String,
      questions:[questionSchema]      
  }, {
        timestamps:true
  })


  module.exports=mongoose.model("survey", surveySchema) 