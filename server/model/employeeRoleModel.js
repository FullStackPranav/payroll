import mongoose from "mongoose";
import { type } from "os";

const employeeRoleSchema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    hourlyRate:{type:String,required:true,},
},{timestamps:true});

export default mongoose.model('EmployeeRole',employeeRoleSchema);