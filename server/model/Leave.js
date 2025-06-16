import mongoose from "mongoose";

const leaveSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, ref:'User',required:true
    },
    type:{ 
        type:String, enum:['Sick','Privelage','Maternity','Other'],required:true
    },
    fromDate:{type:Date,required:true},
    toDate:{type:Date,required:true},
    status:{
        type:String,enum:['Pending','Approved','Rejected'],
        default:'Pending'
,    }
},{timestamps:true});

export default mongoose.model('Leave',leaveSchema)