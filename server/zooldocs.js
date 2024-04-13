module.exports=function(app){

    var ZoolDoc = require('./models/ZoolDoc')
    nuevoZoolDoc = function(req, res){
        console.log('Registrando el dato del ZoolDoc... ');
        console.log('req.query.adminId:'+req.query.adminId);
        var zoolDoc = new ZoolDoc()
        zoolDoc.adminId = req.query.adminId
        zoolDoc.fechaRegistro = new Date(Date.now())
        zoolDoc.exts=[]
        var json={}
        json.tipo = req.query.tipo
        json.ms = parseInt(req.query.ms)
        json.msmod = parseInt(req.query.msmod)
        json.n  = req.query.n
        json.d = parseInt(req.query.d)
        json.m = parseInt(req.query.m)
        json.a = parseInt(req.query.a)
        json.h = parseInt(req.query.h)
        json.min = parseInt(req.query.min)
        json.gmt = parseInt(req.query.gmt)
        json.lat = parseFloat(req.query.lat)
        json.lon = parseFloat(req.query.lon)
        json.alt = parseInt(req.query.alt)
        json.ciudad = req.query.ciudad
        zoolDoc.params = json
        //console.log('Creando un nuevo ZoolDoc Tipo:'+zoolDoc.params.tipo+'\nMs: '+zoolDoc.params.ms+'\nMsMod: '+zoolDoc.params.msmod+'\nNombre: '+zoolDoc.params.n+'\nDía: '+zoolDoc.params.d+'\nMes: '+zoolDoc.params.m+'\nAño: '+zoolDoc.params.a+'\nHora: '+zoolDoc.params.h+'\nMinuto: '+zoolDoc.params.min+'\nGMT: '+zoolDoc.params.gmt+'\nLatitud: '+zoolDoc.params.lat+'\nLongitud: '+zoolDoc.params.lon+'\nLugar: '+zoolDoc.params.ciudad+'\nAdministrador: '+zoolDoc.params.adminId+'\nFecha de Registro: '+zoolDoc.params.fechaRegistro)
        zoolDoc.save(function(err, paramsRegistered){
            let jsonRes
            if(err){
                jsonRes={isRec: false, msg:"Error! Hubo un error al guardar los parámetros del documento en la base de datos del servidor.\nError: zoolDoc.save(...)."}
                console.log('Error! jsonParamsRes: '+err+' msg:'+jsonRes.msg)
                res.status(200).send(jsonRes)
                return
            }
            jsonRes={params: paramsRegistered, isRec: true}
            console.log('jsonParamsRes: '+JSON.stringify(jsonRes))
            res.status(200).send(jsonRes)
        })
        return
    }
    //    nuevoZoolUser = function(req, res){
    //        console.log('Insertando ZoolUser con nombre '+req.query.nombre)
    //        zoolParams.find({
    //                          //date: {$gt: h }
    //                          //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
    //                          //date: {$gte: h, $lte: hf }
    //                          n:req.query.n // Search Filters
    //                      },
    //                      ['n'], // Columns to Return
    //                      {
    //                          skip:0, // Starting Row
    //                          limit:1, // Ending Row
    //                          sort:{
    //                              n: 1 //Sort by Date Added DESC
    //                          }
    //                      },
    //                      function(err, resultados){
    //                          if(err) res.status(500).send({mensaje: `Error al buscar mensajes: ${err}`})
    //                          if(resultados.length===0){
    //                              console.log('Registrando el dato del ZoolUser '+req.query.nombre);
    //                              //res.redirect('/res-add-producto.html?res=no'+mensajes.length)
    //                              //Registra el ZoolUser porque no existe ninguno con ese nombre

    //                              var zoolParams = new ZoolParams()
    //                              zoolParams.tipo = req.query.tipo
    //                              zoolParams.ms = req.query.ms
    //                              zoolParams.msmod = req.query.msmod
    //                              zoolParams.n  = req.query.n
    //                              zoolParams.d = req.query.d
    //                              zoolParams.m = req.query.m
    //                              zoolParams.a = req.query.a
    //                              zoolParams.h = req.query.h
    //                              zoolParams.min = req.query.min
    //                              zoolParams.gmt = req.query.gmt
    //                              zoolParams.lat = req.query.lat
    //                              zoolParams.lon = req.query.lon
    //                              zoolParams.ciudad = req.query.ciudad
    //                              zoolParams.admin = req.query.admin
    //                              zoolParams.fechaRegistro = new Date(Date.now())
    //                              console.log('Creando un nuevo ZoolUser nombre: Tipo:'+zoolParams.tipo+'\nMs: '+zoolParams.ms+'\nMsMod: '+zoolParams.msmod+'\nNombre: '+zoolParams.n+'\nDía: '+zoolParams.d+'\nMes: '+zoolParams.m+'\nAño: '+zoolParams.a+'\nHora: '+zoolParams.h+'\nMinuto: '+zoolParams.min+'\nGMT: '+zoolParams.gmt+'\nLatitud: '+zoolParams.lat+'\nLongitud: '+zoolParams.lon+'\nLugar: '+zoolParams.ciudad+'\nAdministrador: '+zoolParams.admin+'\nFecha de Registro: '+zoolParams.fechaRegistro)
    //                              zoolParams.save(function(err, userRegistered){
    //                                  if(err){
    //                                      res.status(500).send(`Error when user register: ${err}`)
    //                                      return
    //                                  }
    //                                  res.redirect('/res-add-producto.html?res=El+producto+se+ha+agregado+correctamente&pid='+userRegistered._id)
    //                                  //res.status(200).send({producto: userRegistered})
    //                              })
    //                              return
    //                          }else{
    //                              console.log('Se intenta repetir el registro del ZoolUser '+req.query.n);
    //                              let jsonRes={params:{}, isRec: false, msg: 'En la base de datos de Zool ya existe un usuario con el nombre '+req.query.n+'.'}
    //                              res.status(200).send(jsonRes)
    //                          }
    //                      })
    //    }
    searchZoolUser = function(req, res){
        console.log('Buscando ZoolUser con nombre '+req.query.consulta)
        var regExp= new RegExp(''+(''+req.query.consulta).toUpperCase()+'|'+(''+req.query.consulta).toLocaleLowerCase())
        /*zoolParams.find({
                          //date: {$gt: h }
                          //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                          //date: {$gte: h, $lte: hf }
                          codigo: regExp,
                          descripcion: regExp // Search Filters
                      },*/
        zoolDoc.find({ $or: [ { codigo: regExp }, { descripcion: regExp } ] },
                     ['descripcion', 'codigo', 'precioinstalacion', 'precioabono', 'adicionalriesgo', 'observaciones'], // Columns to Return
                     {
                         skip:0, // Starting Row
                         //limit:1, // Ending Row
                         sort:{
                             codigo: 1 //Sort by Date Added DESC
                         }
                     },
                     function(err, resultados){
                         if(err) res.status(500).send({mensaje: `Error al buscar ZoolUsers: ${err}`})
                         if(resultados.length===0){
                             console.log('No se encontró ningún ZoolUser '+req.query.consulta);
                             res.status(200).send({zoolUsers: false})
                         }else{
                             console.log('Se devolverán datos de ZoolUsers a la consulta: '+req.query.consulta);
                             res.status(200).send({zoolUsers: resultados})
                         }
                     })
    }
    setChatUser = function(req, res){
        var userId = req.query.userId
        var update = req.body
        ZoolDoc.findByIdAndUpdate(userId, update, function(err, userUpdated){
            if(err) res.status(500).send(`Error when user register: ${err}`)
            console.log('setChatUser: '+userUpdated)
            res.status(200).send({'user':userUpdated})
        })
    }
    getChatUser = function(req, res){
        console.log('Receiving get '+req.query.userId)
        var userid= req.query.userId
        ZoolDoc.findById(userid, function(err, user){
            if(err){
                res.status(500).send({user: `Error al buscar usuario: ${err}`})
                return
            }
            if(!user){
                res.status(200).send({'user': false})
                return
            }
            res.status(200).send({'user': user})
        })
    }

    app.get('/zool/saveZoolParams', nuevoZoolDoc);
    //app.get('/zool/searchuser', searchZoolUser);
    //app.get('/chat/set/user', setChatUser);
    //app.get('/chat/get/user', getChatUser);


    //--> SAVE NEW EXT IN DOC
    saveZoolExt = function(req, res){
        console.log('Buscando ZoolUser con nombre '+req.query.consulta)
        ZoolDoc.findById(req.query.docId, function(err, result) {
            if(err){
                console.log("errer!!", err);
                return
            }
            //console.log("res", res);
            console.log("res._id", result._id);
            var json={}
            json.tipo = req.query.tipo
            json.ms = parseInt(req.query.ms)
            json.msmod = parseInt(req.query.msmod)
            json.n  = req.query.n
            json.d = parseInt(req.query.d)
            json.m = parseInt(req.query.m)
            json.a = parseInt(req.query.a)
            json.h = parseInt(req.query.h)
            json.min = parseInt(req.query.min)
            json.gmt = parseInt(req.query.gmt)
            json.lat = parseFloat(req.query.lat)
            json.lon = parseFloat(req.query.lon)
            json.alt = parseInt(req.query.alt)
            json.ciudad = req.query.ciudad
            ZoolDoc.updateOne(
                        { _id: result._id },
                        { $push: { exts: json } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                let jsonRes={isRec: false}
                                res.status(200).send(jsonRes)
                            } else {
                                //console.log(success);
                                console.log('Se han agregado datos externos para el documento con nombre: '+req.query.n);
                                let jsonRes={isRec: true}
                                res.status(200).send(jsonRes)
                            }
                        }
                        );
        });
    }
    app.get('/zool/saveZoolExt', saveZoolExt);
    //<-- SAVE NEW EXT IN DOC
}

