const mongoose = require("mongoose");

const vehicalSchema = new mongoose.Schema({
    vehicalNumber:{
        type:String,
        required:true
    },
    ownerNumber:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    commingTiming:{
        type:Date,
        default:mongoose.now()
    },
    markOutTime:{
        type:Date,
    },

},{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
})

module.exports = mongoose.model("vehical", vehicalSchema)