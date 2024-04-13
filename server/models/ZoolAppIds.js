'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var zoolAppIdSchema = Schema({
                                  userId: String,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='ZoolAppIds'
module.exports=mongoose.model(collectionName, zoolAppIdSchema)
