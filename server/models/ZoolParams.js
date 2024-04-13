'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var zoolParamsSchema = Schema({
                                  tipo: String,
                                  ms: Number,
                                  msmod: Number,
                                  n: String,
                                  d: Number,
                                  m: Number,
                                  a: Number,
                                  h:Number,
                                  min:Number,
                                  gmt: Number,
                                  lat: Number,
                                  lon: Number,
                                  ciudad: String,
                                  adminId: String,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='ZoolParams'
module.exports=mongoose.model(collectionName, zoolParamsSchema)
