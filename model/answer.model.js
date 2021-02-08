const mongoose=require('mongoose')


const answerSchema= mongoose.Schema ({ 
      user:String,
      question: String,
      questionImg: String,
      type:String,
      response:String,
      responseImg:String,
      surveyId:String,         
  }, {
        timestamps:true
  })


  module.exports=mongoose.model("answer", answerSchema) 