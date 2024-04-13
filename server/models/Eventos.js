'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var eventosSchema = Schema({
                                  e: String,
                                  nj: Number,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='Eventos'
module.exports=mongoose.model(collectionName, eventosSchema)
