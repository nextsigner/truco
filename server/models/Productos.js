'user strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productoSchema = Schema({
                                  categoria: String,
                                  nombre: String,
                                  precio: Number,
                                  fechaRegistro: Date
                              }, { versionKey: false })

var collectionName='Productos'
module.exports=mongoose.model(collectionName, productoSchema)
