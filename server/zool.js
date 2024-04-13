module.exports=function(app){
    var spawn = require('child_process').spawn;
    var spawnEMail = require('child_process').spawn;
    var cp
    var cpEMail

    function setAndSendEmail(v1){
        let d0=new Date(Date.now())
        let sd=''+d0.getDate()+'/'+parseInt(d0.getMonth()+1)+'/'+d0.getFullYear()+' '+d0.getHours()+':'+d0.getMinutes()+':'+d0.getSeconds()
        console.log("Creando presupuesto: "+sd);
        let d='<b>Nombre: </b>'+v1+'<br />'
//                +'<b>Fecha: </b>'+v4+'/'+v3+'/'+v2+'<br />'
//                +'<b>Hora: </b>'+v5+':'+v6+'hs <br />'
//                +'<b>GMT: </b>'+v7+'<br />'
//                +'<b>Latitud: </b>'+v8+'<br />'
//                +'<b>Longitud: </b>'+v9+'<br />'
//                +''
        cpEMail = spawnEMail('sh', ['sendEmail.sh', ''+d+'', "Nuevo presupuesto", 'qtpizarro@gmail.com']);
        cpEMail.on("exit", function(data) {
            console.log('Mail enviado: '+sd);
            console.log('Datos: '+d.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br \/>/g, '\n'));
        });
        cpEMail.stderr.on("data", function(data) {
            console.error(data.toString());
        });
    }

    newPing = function(req, res){
        res.status(200).send({'ping':10})
    }
    newPPres = function(req, res){
        let v1 = req.query.idproducto
        let d0=new Date(Date.now())
        let sd=''+d0.getDate()+'/'+parseInt(d0.getMonth()+1)+'/'+d0.getFullYear()+' '+d0.getHours()+':'+d0.getMinutes()+':'+d0.getSeconds()
        res.status(200).send('correo enviado! '+sd)
        setAndSendEmail(v1)
    }
    app.get('/getpres', newPPres);
    app.get('/ping', newPing);
}
