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
    property int ncjJ1: 1
    property int ncjJ2: 1
    property string uEvento: ''
    Settings{
        id: apps
        property color backgroundColor: 'black'
        property color fontColor: 'white'
        property bool showLog: true
    }
    Item{
        id: xApp
        anchors.fill: parent

        ZoolLogView{
            id: log
            //width: xApp.width*0.5
        }
        Item{
            id: mesa
            height: col.height
            //anchors.horizontalCenter: parent.horizontalCenter
            anchors.centerIn: parent
            Column{
                id: col
                spacing: app.fs*0.5
                anchors.centerIn: parent
                Text{color: 'white'; text:'Jugador 1'; font.pixelSize: app.fs; anchors.horizontalCenter: parent.horizontalCenter}
                Row{
                    spacing: app.fs*0.25
                    Carta{id: c1j1}
                    Carta{id: c2j1}
                    Carta{id: c3j1}
                }
                Row{
                    spacing: app.fs*0.25
                    Carta{id: c1j2}
                    Carta{id: c2j2}
                    Carta{id: c3j2}
                }
                Text{color: 'white'; text:'Jugador 2'; font.pixelSize: app.fs; anchors.horizontalCenter: parent.horizontalCenter}
            }


        }

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
        running: true
        repeat: true
        interval: 2000
        onTriggered: {
            getEventos()
        }
    }
    //-->HTTP
    QtObject{
        id: nuevoEvento
        function setData(data, isData){
            //if(app.dev){
            //log.lv('nuevoEvento:\n'+JSON.stringify(JSON.parse(data), null, 2))
            //}
            /*c1j1.carta='3c'
            c2j1.carta='3c'
            c3j1.carta='3c'
            c1j2.carta='3c'
            c2j2.carta='3c'
            c3j2.carta='3c'*/
            if(isData){
                let dr
                let j=JSON.parse(data)
                if(j.isRec){
                    //log.lv('isREC:'+JSON.stringify(j, null, 2))
                    if(j.evento.e===app.uEvento)return
                    app.uEvento=j.evento.e
                    if(j.evento.e.indexOf('repartir_')===0){
                        let m0=j.evento.e.split('_')
                        dr=new Date(parseInt(m0[1]))
                        let h=dr.getHours()
                        let min=dr.getMinutes()
                        let sec=dr.getSeconds()
                        log.lv('['+h+':'+min+':'+sec+']: Se repartieron cartas.')
                        c1j1.carta='vacio'
                        c2j1.carta='vacio'
                        c3j1.carta='vacio'
                        c1j2.carta='vacio'
                        c2j2.carta='vacio'
                        c3j2.carta='vacio'
                        ncjJ1=1
                        ncjJ2=1
                        //log.lv('Evento: '+j.evento.e)
                    }
                    if(j.evento.e.indexOf('jugarcarta_')===0){
                        //Qt.quit()
                        let m0=j.evento.e.split('_')
                        dr=new Date(parseInt(m0[3]))
                        var numCartaJudada=parseInt(m0[2])
                        let h=dr.getHours()
                        let min=dr.getMinutes()
                        let sec=dr.getSeconds()
                        if(j.evento.nj===1){
                            if(ncjJ1===1){
                                c1j1.carta=m0[1]
                            }
                            if(ncjJ1===2){
                                c2j1.carta=m0[1]
                            }
                            if(ncjJ1===3){
                                c3j1.carta=m0[1]
                            }
                            ncjJ1++
                        }else{
                            if(ncjJ2===1){
                                c1j2.carta=m0[1]
                            }
                            if(ncjJ2===2){
                                c2j2.carta=m0[1]
                            }
                            if(ncjJ2===3){
                                c3j2.carta=m0[1]
                            }
                            ncjJ2++
                        }
                        let scj='?'
                        if(numCartaJudada===1)scj='Primera'
                        if(numCartaJudada===2)scj='Segunda'
                        if(numCartaJudada===3)scj='Tercera'
                        log.lv('['+h+':'+min+':'+sec+']: J'+j.evento.nj+' juega su '+scj+' carta: '+m0[1])
                        log.lv('['+h+':'+min+':'+sec+']: Evento juganto carta numero: '+numCartaJudada)
                        //log.lv('['+h+':'+min+':'+sec+']: Evento juganto carta: '+j.evento.nj)
                        //log.lv('['+h+':'+min+':'+sec+']: Evento: '+JSON.stringify(j.evento))
                        //log.lv('['+h+':'+min+':'+sec+']: Se repartieron cartas.')
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
    Shortcut{
        sequence: 'Up'
        onActivated: repartir()
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
    function getEventos(){
        let d=new Date(Date.now())
        let url=app.url
        url+='/truco/getEventos'
        app.getRD(url, nuevoEvento)
    }
    //<--Funciones
}

