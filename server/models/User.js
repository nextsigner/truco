'user strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
                            name: String,
                            email: String,
                            emailConfirmed: Boolean,
                            phoneNumber: String,
                            phoneNumberConfirmed: String,
                            dateRegistered: Date
                        }, { versionKey: false })

var collectionName='User'
module.exports=mongoose.model(collectionName, userSchema)
