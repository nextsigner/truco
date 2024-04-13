module.exports=function(app){

    var ZoolAppId = require('./models/ZoolAppIds')
    setNewAppId = function(req, res){
        console.log('setNewAppId...')

        console.log('Registrando el dato del nuevo app id...');
        var zoolAppId = new ZoolAppId()
        zoolAppId.save(function(err, appRegistered){
            let jsonRes
            if(err){
                jsonRes={isRec: false}
                console.log('jsonRes: '+JSON.stringify(jsonRes))
                res.status(200).send(jsonRes)
                return
            }
            jsonRes={app: appRegistered, isRec: true}
            console.log('jsonRes: '+JSON.stringify(jsonRes))
            res.status(200).send(jsonRes)
        })
        return

    }

    setUserId = function(req, res){
        var appId = req.query.appId
        var userId = req.query.userId

        console.log('setUserId... appId: '+appId+' userId: '+userId)

        ZoolAppId.findById(appId, function (err, jsonAppId) {
            if (err){
                console.log(err);
                res.status(200).send({isRec: false})
            }else{
                console.log("Result : ", jsonAppId);
                jsonAppId.userId=userId
                var jsonUpdate=jsonAppId
                ZoolAppId.findByIdAndUpdate(appId, jsonUpdate, function(err, jsonUpdated){
                    if(err) res.status(500).send(`Error when user register: ${err}`)
                    console.log('Updated appId and userId: '+jsonUpdated)
                    res.status(200).send({app:jsonUpdated, isRec: true})
                })
            }
        });


    }
    app.get('/zool/setNewAppId', setNewAppId);
    app.get('/zool/setUserId', setUserId);

}

