module.exports=function(app){

    var Evento = require('./models/Eventos')
    /*
        e: String //Evento
        nj: Number //Numero de Jugador
    */

    var isNumJugadorSeted=false
    var numJugadorSeted=-1
    var aCartas=['1o', '2o', '3o', '4o', '5o', '6o', '7o', '10o', '11o', '12o', '1c', '2c', '3c', '4c', '5c', '6c', '7c', '10c', '11c', '12c', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '10b', '11b', '12b', '1e', '2e', '3e', '4e', '5e', '6e', '7e', '10e', '11e', '12e']

    var pie='Nadie'
    var uCJ1=[]
    var uCJ2=[]
    var pinJ1=-10
    var pinJ2=-10
    var njDePinJ1=-11
    var njDePinJ2=-11

    var uSalida=''

    nuevoEvento = function(req, res){
        console.log('Insertando Evento con nombre '+req.query.e)
        Evento.find({
                        //date: {$gt: h }
                        //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                        //date: {$gte: h, $lte: hf }
                        e:req.query.e // Search Filters
                    },
                    ['n'], // Columns to Return
                    {
                        skip:0, // Starting Row
                        limit:1, // Ending Row
                        sort:{
                            n: 1 //Sort by Date Added DESC
                        }
                    },
                    function(err, resultados){
                        if(err) res.status(500).send({mensaje: `Error al buscar mensajes: ${err}`})
                        if(resultados.length===0){
                            console.log('Registrando el dato del Evento '+req.query.e);
                            //res.redirect('/res-add-producto.html?res=no'+mensajes.length)

                            var evento = new Evento()
                            evento.e  = req.query.e
                            evento.nj = req.query.nj
                            console.log('Creando un nuevo evento: '+evento.e+'\nJugador: '+evento.nj)
                            evento.save(function(err, eventoRegistered){
                                if(err){
                                    res.status(500).send(`Error when user register: ${err}`)
                                    return
                                }
                                //res.redirect('/res-add-producto.html?res=El+producto+se+ha+agregado+correctamente&pid='+userRegistered._id)
                                let jsonRes={evento: eventoRegistered, isRec: true}
                                if(req.query.e.indexOf('repartir_')===0){
                                    const cartas = generarNumerosAleatorios();
                                    let ac=[aCartas[cartas[0]], aCartas[cartas[1]], aCartas[cartas[2]], aCartas[cartas[3]], aCartas[cartas[4]], aCartas[cartas[5]]]
                                    uCJ1=[ac[0], ac[1], ac[2]]
                                    uCJ2=[ac[3], ac[4], ac[5]]
                                    console.log('Cartas: '+cartas);
                                    console.log('Cartas ac: '+ac);
                                    jsonRes={evento: eventoRegistered, cartas: ac, isRec: true}
                                    console.log('JSON CARTAS: '+JSON.stringify(jsonRes, null, 2));
                                }
                                if(req.query.e.indexOf('jugarcarta_')===0){
                                    let c=req.query.e.split('_')[1]
                                    if(req.query.nj==='1'){
                                        let pos=uCJ1.indexOf(c)
                                        uCJ1[pos]='vacio'
                                    }else{
                                        let pos=uCJ2.indexOf(c)
                                        uCJ2[pos]='vacio'
                                    }
                                    console.log('Evento jugando: '+req.query.e);
                                    jsonRes={evento: eventoRegistered, cartaJugada: c, isRec: true}
                                }
                                console.log('jsonRes: '+JSON.stringify(jsonRes))
                                res.status(200).send(jsonRes)
                            })
                            return
                        }else{
                            console.log('Se intenta repetir el registro del evento '+req.query.e);
                            //var msg='No+se+ha+registrado+el+productoYa+existe+un+producto+con+el+nombre+'+(''+req.query.n).replace(/ /g, '%20')
                            //res.redirect('/res-add-producto.html?res='+msg)
                            let jsonRes={evento:{}, isRec: false, msg: 'En la base de datos de Truco ya existe un usuario con el evento '+req.query.e+'.'}
                            res.status(200).send(jsonRes)
                        }
                    })
    }

    getEventos = function(req, res){
        //console.log('Listando eventos')
        Evento.find({
                        //date: {$gt: h }
                        //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                        //date: {$gte: h, $lte: hf }
                        //e:req.query.n // Search Filters
                    },
                    [], // Columns to Return
                    {
                        /*skip:0, // Starting Row
                        limit:1, // Ending Row
                        sort:{
                            fechaRegistro: 0 //Sort by Date Added DESC
                        }*/
                    },
                    function(err, resultados){
                        if(err) res.status(500).send({mensaje: `Error al buscar mensajes: ${err}`})
                        if(resultados.length===0){
                            //console.log('No hay eventos ');
                            let jsonRes={evento: resultados, isRec: true}
                            //console.log('jsonRes: '+JSON.stringify(jsonRes))
                            res.status(200).send(jsonRes)
                            return
                        }else{
                            //console.log('Se muestran todos los eventos registrados');
                            let jsonRes={evento: resultados[Object.keys(resultados).length-1], isRec: true}
                            if(JSON.stringify(jsonRes, null, 2) !== uSalida){
                                console.log('jsonRes: '+uSalida)
                            }
                            uSalida=JSON.stringify(jsonRes, null, 2)
                            res.status(200).send(jsonRes)
                        }
                    })
    }

    getCartas = function(req, res){
        let cNJ=req.query.nj
        let dateError= new Date(Date.now())
        let h=dateError.getHours()
        let min=dateError.getMinutes()
        let sec=dateError.getSeconds()
        let she='['+h+':'+min+':'+sec+']'
        console.log('cNJ:'+cNJ)
        console.log(she+': req.query.nj:'+parseInt(req.query.nj)+' pinJ1:'+parseInt(pinJ1)+' req.query.pin:'+req.query.pin+' pinJ2:'+parseInt(pinJ2))
        if(req.query.nj==='-1'){
            let jsonRes={cartas: ['vacio', 'vacio', 'vacio']}
            res.status(200).send(jsonRes)
            return
        }
        if(req.query.nj==='1'){
            let jsonRes={cartas: uCJ1, isRec: true}
            res.status(200).send(jsonRes)
            return
        }
        if(req.query.nj==='2'){
            let jsonRes={cartas: uCJ2, isRec: true}
            res.status(200).send(jsonRes)
            return
        }
    }

    getNuevoNumJugador = function(req, res){
        console.log('getNuevoNumJugador...')
        if(!isNumJugadorSeted){
            console.log('2 getNuevoNumJugador...')
            numJugadorSeted=getNumJugador()
            isNumJugadorSeted=true
            if(numJugadorSeted===1){
                pinJ1=parseInt(req.query.pin);
                njDePinJ1=numJugadorSeted;
                //console.log('1---->pinJ1:'+pinJ1);
            }else{
                pinJ2=parseInt(req.query.pin);
                njDePinJ2=numJugadorSeted;
                //console.log('1---->pinJ2:'+pinJ2);
            }
            let jsonRes={nuevoNumJugador: numJugadorSeted, pin:req.query.pin}
            res.status(200).send(jsonRes)
            return
        }else{
            console.log('3 getNuevoNumJugador...')
            if(numJugadorSeted===1){
                pinJ2=parseInt(req.query.pin);
                njDePinJ2=2
                let jsonRes={nuevoNumJugador: 2, pin:req.query.pin}
                res.status(200).send(jsonRes)
                return
            }else{
                pinJ1=parseInt(req.query.pin);
                njDePinJ1=1;
                let jsonRes={nuevoNumJugador: 1, pin:req.query.pin}
                res.status(200).send(jsonRes)
                return
            }
        }
    }

    consultarNumJugadorPorPin = function(req, res){
        console.log('consultarNumJugadorPorPin...')
        let pin=parseInt(req.query.pin)
        let rnj=-1
        if(pin===pinJ1)rnj=njDePinJ1
        if(pin===pinJ2)rnj=njDePinJ2
        let jsonRes={numJugadorRecuperado: rnj, pin: pin}
        res.status(200).send(jsonRes)
        return

    }
    borrarTodosLosEventos = function(req, res){
        console.log('Limpiando todos los registros...')
        Evento.deleteMany({}, (err) => {
            if (err) {
                console.error("Error al borrar los registros:", err);
            } else {
                console.log("Todos los registros han sido eliminados correctamente.");
            }
        });
    }


//    getEventos = function(res, req){
//        Evento.findOne().sort({ _id: -1 }).exec((err, ultimoDocumento) => {
//                                                    if (err) {
//                                                        console.error('Error al obtener el último documento:', err);
//                                                        return;
//                                                    }

//                                                    // El último documento está almacenado en la variable `ultimoDocumento`
//                                                    let jsonRes={eventos: ultimoDocumento, isRec: true}
//                                                    console.log('jsonRes: '+JSON.stringify(jsonRes))
//                                                    //res.json(jsonRes);
//                                                    res.status(200).send(jsonRes)
//                                                    console.log('Último documento:', ultimoDocumento);
//                                                });
//    }

    function generarNumerosAleatorios() {
      const numeros = [];
      while (numeros.length < 6) {
        const numero = Math.floor(Math.random() * 39) + 1;
        if (!numeros.includes(numero)) {
          numeros.push(numero);
        }
      }
      return numeros;
    }
    function getNumJugador() {
      return Math.floor(Math.random() * 2) + 1;
    }



    app.get('/truco/nuevoEvento', nuevoEvento);
    app.get('/truco/getEventos', getEventos);
    app.get('/truco/getNuevoNumJugador', getNuevoNumJugador);
    app.get('/truco/getCartas', getCartas);
    app.get('/truco/consultarNumJugadorPorPin', consultarNumJugadorPorPin);
    app.get('/truco/borrarTodosLosEventos', borrarTodosLosEventos);
    borrarTodosLosEventos()
}

