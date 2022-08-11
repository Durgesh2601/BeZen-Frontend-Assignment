const mongoose = require("mongoose");

module.exports = () => {
    return mongoose.connect("mongodb+srv://dk829445:BPt5WcQAVBYSBRAh@cluster0.yjhix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
}