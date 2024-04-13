module.exports=function(app){
    var ZoolDoc = require('./models/ZoolDoc')

    getUZoolandVersion = function(req, res){
        console.log('getUZoolandVersion... ');
        let jsonRes={isData:false}
        const exec = require('child_process').exec;
        exec('ls /root/zool-server/files/*.zip', (err, stdout, stderr) => {
                 if (err) {
                     console.error(err);
                     jsonRes={isData:false, isError:true, error: err}
                     res.status(200).send(jsonRes);
                     return;
                 }
                 let v=0;
                 let m0=stdout.split('\n')
                 let m1=(''+m0[0]).split('/')
                 let zipFileName=m1[m1.length-1]
                 jsonRes={isData:true, isError:false, data: zipFileName}
                 //jsonRes=JSON.parse(stdout);
                 //console.log(JSON.stringify(jsonRes, null, 2));
                 res.status(200).send(jsonRes);
             });
        //res.status(200).send(jsonRes)
        return
    }
    getUZoolandControlVersion = function(req, res){
        console.log('getUZoolandControlVersion... ');
        let jsonRes={isData:false}
        const exec = require('child_process').exec;
        exec('ls /root/zool-server/files/zooland-control/zooland-control-main*.zip', (err, stdout, stderr) => {
                 if (err) {
                     console.error(err);
                     jsonRes={isData:false, isError:true, error: err}
                     res.status(200).send(jsonRes);
                     return;
                 }
                 let v=0;
                 let m0=stdout.split('\n')
                 let m1=(''+m0[0]).split('/')
                 let zipFileName=m1[m1.length-1]
                 jsonRes={isData:true, isError:false, data: zipFileName}
                 //jsonRes=JSON.parse(stdout);
                 //console.log(JSON.stringify(jsonRes, null, 2));
                 res.status(200).send(jsonRes);
             });
        //res.status(200).send(jsonRes)
        return
    }

    app.get('/zool/getUZoolandVersion', getUZoolandVersion);
    app.get('/zool/getUZoolandControlVersion', getUZoolandControlVersion);

    //--> Get Zool Data
    getZoolData = function(req, res){
        console.log('getZoolData... ');
        console.log('Dia: '+req.query.d);
        //res.redirect('/res-add-producto.html?res=no'+mensajes.length)
        //Registra el ZoolUser porque no existe ninguno con ese nombre
        let jsonRes={isData:false}
        const exec = require('child_process').exec;
        exec('python3 "/root/zool-server/py/astrologica_swe_v4.py" '+req.query.d+' '+req.query.m+' '+req.query.a+' '+req.query.h+' '+req.query.min+' '+req.query.gmt+' '+req.query.lat+' '+req.query.lon+' T /root/zool-server '+req.query.alt, (err, stdout, stderr) => {
                 if (err) {
                     console.error(err);
                     jsonRes={isData:false, isError:true, error: err}
                     res.status(200).send(jsonRes);
                     return;
                 }
                 jsonRes={isData:true, isError:false, data: JSON.parse(stdout)}
                 //jsonRes=JSON.parse(stdout);
                 //console.log(JSON.stringify(jsonRes, null, 2));
                 res.status(200).send(jsonRes);
             });
        //res.status(200).send(jsonRes)
        return
    }
    app.get('/zool/getZoolData', getZoolData);
    //<-- Get Zool Data

    //--> Get Zool Data Rev Sol
    getZoolDataRevSol = function(req, res){
        console.log('getZoolDataRevSol... ');
        console.log('Dia: '+req.query.d);
        //res.redirect('/res-add-producto.html?res=no'+mensajes.length)
        //Registra el ZoolUser porque no existe ninguno con ese nombre
        let jsonRes={isData:false}
        const exec = require('child_process').exec;
        //Se espera url entre comillas dobles.
        //curl "http://192.168.1.52:8100/zool/getZoolDataRevSol?d=20&m=6&a=1975&h=23&min=4&gmt=-3&lat=-35.4752134&lon=-69.585934&absGradosSol=89&relMinutosSol=6&relSegundosSol=22&edad=48"

        //python3 "/home/ns/nsp/zool-server/py/astrologica_swe_search_revsol_time_one.py" 20 6 1975 23 4 -3 -35.4752134 -69.585934 89 6 38 48 "/home/ns/nsp/zool-release"
        //python3 "/home/ns/nsp/zool-server/py/astrologica_swe_search_revsol_time_one.py" dia mes año hora minuto gmt lat lon absolutoGradoSol relativoMinutosSol relativoSegundosSol edad "/home/ns/nsp/zool-release"
        exec('python3 "/root/zool-server/py/astrologica_swe_search_revsol_time_one.py" '+req.query.d+' '+req.query.m+' '+req.query.a+' '+req.query.h+' '+req.query.min+' '+req.query.gmt+' '+req.query.lat+' '+req.query.lon+' '+req.query.absGradosSol+' '+req.query.relMinutosSol+' '+req.query.relSegundosSol+' '+req.query.edad+' /root/zool-server', (err, stdout, stderr) => {
                 if (err) {
                     console.error(err);
                     jsonRes={isData:false, isError:true, error: err}
                     res.status(200).send(jsonRes);
                     return;
                 }
                 jsonRes={isData:true, isError:false, data: JSON.parse(stdout)}
                 //jsonRes=JSON.parse(stdout);
                 //console.log(JSON.stringify(jsonRes, null, 2));
                 res.status(200).send(jsonRes);
             });
        //res.status(200).send(jsonRes)
        return
    }
    app.get('/zool/getZoolDataRevSol', getZoolDataRevSol);
    //<-- Get Zool Data Rev Sol

    //--> Retorna un JSON con un array lista de Params
    getZoolandParamsList = function(req, res){
        console.log('Buscando ZoolParamsList con adminId: ['+req.query.adminId+'].')
        let jsonRes={isData:false}
        var regExp= new RegExp(''+(''+req.query.adminId).toUpperCase()+'|'+(''+req.query.adminId).toLocaleLowerCase())
        console.log('Buscando ZoolParamsList regExp:['+regExp+'].')
        ZoolDoc.find({ $or: [ { adminId: regExp } ]},
                        ['params', 'exts'], // Columns to Return
                        {
                            skip:0, // Starting Row
                            //limit:1, // Ending Row
                            sort:{
                                fechaRegistro: 1 //Sort by Date Added DESC
                            }
                        },
                        function(err, resultados){
                            if(err){
                                jsonRes={isData:false, isError:true, error: err}
                                res.status(200).send(JSON.stringify(jsonRes, null, 2));
                            }else{
                                jsonRes={isData:true, isError:false, data: resultados}
                                console.log('Resultado ZoolParamsList: '+JSON.stringify(jsonRes, null, 2)+'')
                                res.status(200).send(JSON.stringify(jsonRes, null, 2));
                            }
                        })
    }
    app.get('/zool/getZoolandParamsList', getZoolandParamsList);
    //<-- Retorna un JSON con un array lista de Params

    //Retorna coords de ciudad
    getZoolandCoords = function(req, res){
        console.log('getZoolandCoords... ');
        console.log('Ciudad: '+req.query.ciudad);
        //res.redirect('/res-add-producto.html?res=no'+mensajes.length)
        //Registra el ZoolUser porque no existe ninguno con ese nombre
        let jsonRes={isData:false}
        const exec = require('child_process').exec;
        exec('python3 "/root/zool-server/py/geoloc.py" "'+req.query.ciudad+'" /root/zool-server', (err, stdout, stderr) => {
                 if (err) {
                     console.error(err);
                     jsonRes={isData:false, isError:true, error: err}
                     res.status(200).send(jsonRes);
                     return;
                 }
                 jsonRes={isData:true, isError:false, ciudad: req.query.ciudad, data: JSON.parse(stdout)}
                 //jsonRes=JSON.parse(stdout);
                 //console.log(JSON.stringify(jsonRes, null, 2));
                 res.status(200).send(jsonRes);
             });
        //res.status(200).send(jsonRes)
        return
    }
    app.get('/zool/getZoolandCoords', getZoolandCoords);

    //--> Test
    app.get('/test',function(req, res) {
        var r=JSON.stringify(req.query)
        var pr=JSON.parse(r)
        console.log(pr.username)
        var ttt = false;
        if (req.query.username === "undefined") ttt = true;
        res.json({query: ttt});
    });
    //<-- Test
}

