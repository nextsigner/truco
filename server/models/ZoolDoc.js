'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var zoolDocSchema = Schema({
                                  adminId: String,
                                  params: Object,
                                  exts: Array,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='ZoolDoc'
module.exports=mongoose.model(collectionName, zoolDocSchema)
