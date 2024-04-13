'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var zoolUserSchema = Schema({
                                  n: String,
                                  c: String,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='ZoolUsers'
module.exports=mongoose.model(collectionName, zoolUserSchema)
