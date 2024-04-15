import QtQuick 2.7
import QtQuick.Window 2.0
import QtQuick.Controls 2.0
import Qt.labs.settings 1.1
import ZoolLogView 1.0

ApplicationWindow{
    id: app
    visible: true
    visibility: 'Maximized'
    title: 'Truco'
    width: Screen.width
    height: Screen.height
    color: apps.backgroundColor

    property int fs: 60
    property url host: 'http://localhost'
    property int port: 8200
    property url url: host+':'+port
    Settings{
        id: apps
        property color backgroundColor: 'black'
        property color fontColor: 'white'
        property bool showLog: true
    }
    Item{
        id: xApp
        anchors.fill: parent

        ZoolLogView{id: log}

        Row{
            anchors.right: parent.right
            Button{
                text: 'Repartir'
                onClicked: repartir()
            }
        }
    }
    Timer{
        id: tGetStatus
        running: false//true
        repeat: true
        interval: 5000
        onTriggered: {
            let d=new Date(Date.now())
            let url=app.url

            //Nuevo Evento
            //url+='/truco/nuevoEvento'
            //url+='?e=evento_'+d.getTime()
            //url+='&nj=1'

            //Get Eventos
            url+='/truco/getEventos'



            log.lv('url: '+url)
            app.getRD(url, nuevoEvento)
        }
    }
    //-->HTTP
    QtObject{
        id: nuevoEvento
        function setData(data, isData){
            //if(app.dev){
                //log.lv('nuevoEvento:\n'+JSON.stringify(JSON.parse(data), null, 2))
            //}
            if(isData){
                let dr
                let j=JSON.parse(data)
                if(j.isRec){
                    if(j.evento.e.indexOf('repartir_')===0){
                        let m0=j.evento.e.split('_')
                        dr=new Date(parseInt(m0[1]))
                        let h=dr.getHours()
                        let min=dr.getMinutes()
                        let sec=dr.getSeconds()
                        log.lv('['+h+':'+min+':'+sec+']: Se repartieron cartas.')
                        //log.lv('Evento: '+j.evento.e)
                    }

                    //if(app.dev){
                        //log.lv('New remote params, id: '+j.params._id)
                    //}
                    //app.j.showMsgDialog('Zool Informa', 'Los datos se han guardado.', 'Una copia del archivo '+app.currentNom+' ha sido respaldado en el servidor de Zool.')
                }else{
                    //app.j.showMsgDialog('Zool Informa Error!', 'Los datos no han sido guardados.', j.msg)
                }

            }else{
                //app.j.showMsgDialog('Zool Informa', 'Los datos no se han guardado en el servidor.', 'No se ha copia del archivo '+app.currentNom+'. No ha sido respaldado en el servidor de Zool.\nPosiblemente usted no esté conectado a internet o el servidor de Zool no se encuentra disponible en estos momentos.')
            }
        }
    }
    QtObject{
        id: setEventos
        function setData(data, isData){
            //if(app.dev){
                log.lv('setEventos:\n'+JSON.stringify(JSON.parse(data), null, 2))
            //}
            if(isData){
                let j=JSON.parse(data)
                if(j.isRec){
                    //if(app.dev){
                        log.lv('New remote params, id: '+j.params._id)
                    //}
                    //app.j.showMsgDialog('Zool Informa', 'Los datos se han guardado.', 'Una copia del archivo '+app.currentNom+' ha sido respaldado en el servidor de Zool.')
                }else{
                    //app.j.showMsgDialog('Zool Informa Error!', 'Los datos no han sido guardados.', j.msg)
                }

            }else{
                //app.j.showMsgDialog('Zool Informa', 'Los datos no se han guardado en el servidor.', 'No se ha copia del archivo '+app.currentNom+'. No ha sido respaldado en el servidor de Zool.\nPosiblemente usted no esté conectado a internet o el servidor de Zool no se encuentra disponible en estos momentos.')
            }
        }
    }

    //<--HTTP
    Shortcut{
        sequence: 'Esc'
        onActivated: Qt.quit()
    }
    Component.onCompleted: {
        log.lv('Inicio.')
    }
    //-->Internet
    function getRD(url, item){//Remote Data
        var request = new XMLHttpRequest()
        request.open('GET', url, true);
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status && request.status === 200) {
                    /*let d=request.responseText
                    if(d.indexOf('redirected')>=0&&d.indexOf('</html>')>=0){
                        let m0=d.split('</html>')
                         item.setData(m0[1], true)
                    }else{
                         item.setData(d, true)
                    }*/
                    item.setData(parseRetRed(request.responseText), true)
                } else {
                    item.setData("Url: "+url+" Status:"+request.status+" HTTP: "+request.statusText, false)
                }
            }
        }
        request.send()
    }
    function parseRetRed(d){
        if(d.indexOf('redirected')>=0&&d.indexOf('</html>')>=0){
            let m0=d.split('</html>')
            return m0[1]
        }else{
            return d
        }
    }
    //<--Internet

    //-->Funciones
    function repartir(){
        let d=new Date(Date.now())
        let url=app.url
        url+='/truco/nuevoEvento'
        url+='?e=repartir_'+d.getTime()
        url+='&nj=0'
        //log.lv('url: '+url)
        app.getRD(url, nuevoEvento)
    }
    //<--Funciones
}

