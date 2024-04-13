'user strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const presupuestoSchema = Schema({
                                     tecnico: String,
                                     cliente: String,
                                     contrato: String,
                                     productos: String,
                                     fechaInstalacion: Date,
                                     fechaRegistro: Date
                                 }, { versionKey: false })

var collectionName='Presupuesto'
module.exports=mongoose.model(collectionName, presupuestoSchema)
