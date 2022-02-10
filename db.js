const Mongoose = require("mongoose")

const scanSchema = new Mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  url: {
      type: String,
      required: true
  },
  ip: {
    type: String,
    required: true
  },
  asn: {
    type: String,
    required: true
  },
  ssl: {
      type: String,
      required: true
  },
  html: {
      type: String,
      required: true
  },
  natural: {
      type: String,
      required: true
  }
})

module.exports = Mongoose.model("Scan", scanSchema)