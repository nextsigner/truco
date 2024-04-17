import QtQuick 2.0

Rectangle{
    id: r
    width: app.fs*4.5
    height: xApp.height*0.35
    radius: app.fs*0.25
    opacity: carta==='vacio'?0.5:1.0
    property string carta: 'vacio'
    property url s: app.url+'/imgs/'+carta+'.png'
    Rectangle{
        width: parent.width-30
        height: parent.height-30
        anchors.centerIn: parent
        Image {
            id: img
            source: r.s
            anchors.fill: parent
        }
    }
}
