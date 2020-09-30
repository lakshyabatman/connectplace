const mongoose=require('mongoose')
const schema=mongoose.Schema

const question=new schema({
    category:{
        type:String
    },
    content:{   
        type:String
    },
    upvotes:[
        {
        user:{
            type:schema.Types.ObjectId,
            refs:'users'
        }}
    ],
    downvotes:[
        {
        user:{
            type:schema.Types.ObjectId,
            refs:'users'
        }}
    ],
    topic:{
        type:Object
    },
    language:[{
        language:{
            type:schema.Types.ObjectId,
            refs:'languages'
        },
        name:{
            type:String
        }
    }],
    company:[{
       company:{
        type:schema.Types.ObjectId,
        refs:'companys'
       } ,
       name:{
           type:String
       }
    }],
    ques:{
        type:String
    },
    per:{
        person:{
            type:schema.Types.ObjectId,
            ref:'users'        
        },
        name:{
            type:String
        }
    },
    createdAt:{
        type:Date
    },
    comments:[{
        user:{
            type:schema.Types.ObjectId,
            ref:'users'
        },
        text:{
            type:String
        },
        name:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now()
        }
    }]
})
let que=mongoose.model('question',question)
module.exports=que;