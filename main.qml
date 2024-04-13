import QtQuick 2.7
import QtQuick.Controls 2.0
import Qt.labs.settings 1.1

ApplicationWindow{
    id: app
    visible: true
    visibility: 'Maximized'
    title: 'Truco'
    color: apps.backgroundColor
    Settings{
        id: apps
        property color backgroundColor: 'black'
        property color fontColor: 'white'
    }
    Item{
        id: xApp
        anchors.fill: parent

    }
}
