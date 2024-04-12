const mongoose = require('mongoose');
//const ObjectID = mongoose.Schema.Types.ObjectId
const dataSchema = new mongoose.Schema({
    Category:String,
    Sub_Category:String,
    Name: String,
    Composition: String,
    Uses: String,
    Side_effects: String,
    Image_URL: String,
    Manufacturer: String,
    Price:Number,
    Return_Policy:String,
    Directions_for_Use:String
})
const Data = mongoose.model('Product', dataSchema);
module.exports= Data;
