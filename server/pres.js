module.exports=function(app){

    var Presupuesto = require('./models/Presupuesto')
    var spawn = require('child_process').spawn;
    var spawnEMail = require('child_process').spawn;
    var cp
    var cpEMail

    function setAndSendEmail(devSending, vdev, v1, v2, v3, v4, v5){
        //setAndSendEmail(req.body.devSending, req.body.vdev, presupuesto.tecnico, req.body.cliente, presupuesto.productos, presupuesto.fechaInstalacion, d.getTime())
        var d0=new Date(parseInt(v5))
        var sd=''+d0.getDate()+'/'+parseInt(d0.getMonth()+1)+'/'+d0.getFullYear()+' '+d0.getHours()+':'+d0.getMinutes()+':'+d0.getSeconds()
        //console.log('v5: '+v5)
        var d1=new Date(parseInt(v4.getTime()))
        var sd1=''+d1.getDate()+'/'+parseInt(d1.getMonth()+1)+'/'+d1.getFullYear()+' '+d1.getHours()+':'+d1.getMinutes()+':'+d1.getSeconds()
        console.log("Creando presupuesto: "+sd);
        var html1='<!DOCTYPE html><html><head><title>Zool.ar</title></head><html><body>'
        console.log("JSON TEC: "+v1+"\n\n\n")
        console.log("JSON CLI: "+v2+"\n\n\n")
        var jsonTec=JSON.parse(v1)
        var jsonCli=JSON.parse(v2)
        var d=''
            +'<img src="https://github.com/pizarromario/pizarromario.github.io/blob/master/imgs/logo_cabecera.png?raw=true" style="width: 100%"/><br />'

            +'<h2>Técnico</h2>'
            +'<b>Nombre: </b>'+jsonTec.tecnico.nombre+'<br />'
            +'<b>Teléfono: </b>'+jsonTec.tecnico.telefono+'<br />'
            +'<b>E-Mail: </b>'+jsonTec.tecnico.email+'<br />'

            +'<h2>Cliente</h2>'
            +'<b>Nombre y Apellido: </b>'+jsonCli.cliente.nombre+'<br />'
            +'<b>Dirección: </b>'+jsonCli.cliente.direccion+'<br />'
            +'<b>Teléfono: </b>'+jsonCli.cliente.telefono+'<br />'
            +'<b>E-Mail: </b>'+jsonCli.cliente.email+'<br />'
            +'<b>Contrato: </b>'+jsonCli.cliente.contrato+'<br />'

        console.log('JSON PRODS: '+v3+"\n\n\n\n")
        var json=JSON.parse(v3)
        d+='<h2>Productos/Servicios</h2>'
        d+='<table border="2"><tr>'
                +'<td><b>Descripción</b></td>'
                +'<td><b>Código</b></td>'
                +'<td><b>Cantidad</b></td>'
                +'<td><b>Precio de Instalación</b></td>'
                +'<td><b>Precio de Abono</b></td>'
                +'<td><b>Adicional Riesgo</b></td>'
                +'<td><b>Total Parcial</b></td>'
                +'</tr>'
        for(var i=0;i<Object.keys(json).length-1;i++){
            var precioSubTotalInst=0
            if((''+json['item'+i].precioinstalacion).indexOf('-')<0&&parseInt( json['item'+i].cant)>0){
                precioSubTotalInst=parseFloat(json['item'+i].precioinstalacion * json['item'+i].cant)
                if (isNaN(precioSubTotalInst)) {
                    precioSubTotalInst=0
                }
            }
            var precioPA=0.00
            if((''+json['item'+i].precioabono).indexOf('-')<0&&parseInt( json['item'+i].precioabono)>0){
                precioPA=parseFloat(json['item'+i].precioabono)
                if (isNaN(precioPA)) {
                    precioPA=0.00
                }
            }
            var precioAR=0.00
            if((''+json['item'+i].adicionalriesgo).indexOf('-')<0&&parseInt( json['item'+i].adicionalriesgo)>0){
                precioAR=parseFloat(json['item'+i].adicionalriesgo)
                if (isNaN(precioAR)) {
                    precioAR=0.00
                }
            }
            d+='<tr>'
            d+='<td>'+json['item'+i].descripcion+'</td>'
            d+='<td style="text-align:center">'+json['item'+i].codigo+'</td>'
            d+='<td style="text-align:center">'+json['item'+i].cant+'</td>'
            d+='<td style="text-align:center">$'+parseFloat(json['item'+i].precioinstalacion).toFixed(2)+'</td>'
            d+='<td style="text-align:center">$'+parseFloat(precioPA).toFixed(2)+'</td>'
            d+='<td style="text-align:center">$'+parseFloat(precioAR).toFixed(2)+'</td>'
            d+='<td style="text-align:center">$'+parseFloat(precioSubTotalInst).toFixed(2)+'</td>'
            d+='</tr>'
        }
        d+='<tr>'
                +'<td colspan=6></td>'
                +'<td style="text-align:center"><b>Total</b></td>'
                +'</tr>'
        d+='<tr>'
                +'<td colspan=5></td>'
                +'<td style="text-align:center">Total Sin IVA</td>'
                +'<td style="text-align:center">$'+parseFloat(json['valores'].totalSinIVA).toFixed(2)+'</td>'
                +'</tr>'
        d+='<tr>'
                +'<td colspan=5></td>'
                +'<td style="text-align:center">Total Con IVA</td>'
                +'<td style="text-align:center">$'+parseFloat(json['valores'].totalConIVA).toFixed(2)+'</td>'
                +'</tr>'
        d+='<tr>'
                +'<td colspan=5></td>'
                +'<td style="text-align:center">Descuento</td>'
                +'<td style="text-align:center">%'+json['valores'].descuento+'</td>'
                +'</tr>'
        d+='<tr>'
                +'<td colspan=5></td>'
                +'<td style="text-align:center">Total</td>'
                +'<td style="text-align:center">$'+parseFloat(json['valores'].totalConDescuento).toFixed(2)+'</td>'
                +'</tr>'
        d+='</table>'
        d+='<br />'
        d+='<b>Fecha de Presupuesto: </b>'+sd+' <br />'
        d+='<b>Fecha de Instalación: </b>'+sd1+' <br />'

        d+='<p nombre="normal5">Aprovechamos la ocasión para saludarlo cordialmente.</p>'
        var asunto=''
        var from='Zool.ar - '+v1
        var vdevSending=''+devSending
        //console.log('DS:'+vdevSending+' vdev:'+vdev+' email cliente: '+jsonCli.cliente.email)
        if(vdevSending==='true'){
            asunto='Prueba '+vdev
            from='Programador Prueba '+vdev
        }else{
            asunto='Nuevo Usuario'
        }
        var html2='</html></body></html>'
        var df=html1+d+html2
        cpEMail = spawnEMail('sh', ['sendEmail.sh', ''+df+'', ""+asunto+"", 'qtpizarro@gmail.com', from, "<"+jsonCli.cliente.email+">"]);
        cpEMail.on("exit", function(data) {
            console.log('Mail enviado: '+sd);
            console.log('Datos: '+d.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br \/>/g, '\n'));
        });
        cpEMail.stderr.on("data", function(data) {
            console.error(data.toString());
        });
    }
    nuevoPresupuesto = function(req, res){
        console.log('Insertando nuevo presupuesto de usuario '+req.query.usuario)
        var d = new Date(Date.now())
        var presupuesto = new Presupuesto()
        presupuesto.tecnico = req.body.tecnico
        presupuesto.cliente = req.body.cliente
        presupuesto.productos = req.body.productos
        presupuesto.fechaInstalacion = req.body.fechaInstalacion
        presupuesto.fechaRegistro = d

        //console.log('Creando un nuevo presupuesto de técnico: '+presupuesto.tecnico+' Productos: \n'+presupuesto.productos)
        presupuesto.save(function(err, presRegistered){
            if(err){
                res.status(500).send(`Error al crear presupuesto: ${err}`)
                return
            }
            setAndSendEmail(req.body.devSending, req.body.vdev, presupuesto.tecnico, req.body.cliente, presupuesto.productos, presupuesto.fechaInstalacion, d.getTime())
            res.status(200).send({presupuesto: presRegistered}) })
    };
    app.post('/ppres/nuevopresupuesto', nuevoPresupuesto);
}

