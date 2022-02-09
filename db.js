const Mongoose = require("mongoose")

const scanSchema = new Mongoose.Schema({
    url: {
        type: String,
        required: true,
    },

    ip: {
  
      type: String,
      required: true,
  
    },
  
    asn: {
      type: String,
      required: true,
    },

    ssl: {
        type: String,
        required: true,
    },

    html: {
        type: String,
        required: true,
    },

    natural: {
        type: String,
        required: true,
    }
  
  })
  
  Mongoose.model("Scan", scanSchema)