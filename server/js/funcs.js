//var host='http://127.0.0.1:8200'
var host='http://192.168.1.39:8200'
//var host='http://127.0.0.1:8200'
const urlParams = new URLSearchParams(window.location.search);
var nj = -1//urlParams.get('nj');
var cC=[]
var uSCartas=''
document.getElementById('titulo').textContent = 'Truco!';

var isGettingCartas=false;
function getNuevoNumJugador() {
    let revNumJugadorCookie=obtenerCookie('nj')
    //alert('revNumJugadorCookie:'+revNumJugadorCookie)
    //return

    const xhr = new XMLHttpRequest();
    let url=host+'/truco/getNuevoNumJugador?nj='+nj
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                if(revNumJugadorCookie!==-1){
                    nj=revNumJugadorCookie
                }else{
                    nj=parseInt(jsonResponse.nuevoNumJugador)
                }
                document.getElementById('titulo').textContent ='Truco! - Jugador N°'+nj;
                document.getElementById('jugador').textContent = 'Jugador N°'+nj;
                guardarCookie("nj", nj, 1);
                if(nj===1){
                    document.getElementById('pieomano').textContent = 'Empieza el partido. Esperando cartas.';
                }else{
                    document.getElementById('pieomano').textContent = 'Empieza el partido. Esperando cartas.';
                }
                setImgs('vacio', 'vacio', 'vacio')
            } else {
                console.error('Error al realizar la solicitud:', xhr.status);
                //alert('Error: '+xhr.status)
                document.getElementById('salida').textContent += 'Error: '+xhr.status+' url: '+url;
            }
            //isGettingCartas=false;
        }
    };
    //isGettingCartas=true;
    xhr.send();
}
function getCartas() {
    if(nj<1){
        document.getElementById('salida').textContent += ' nj='+nj;
        return
    }else{

    }
    const xhr = new XMLHttpRequest();
    let url=host+'/truco/getCartas'
    url+='?nj='+nj
    //document.getElementById('salida').textContent += ' url:'+url;
    //isGettingCartas=true;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                //alert(JSON.stringify(jsonResponse));
                //document.getElementById('salida').textContent += '.. ';
                //document.getElementById('c1').textContent = jsonResponse.cartas[0]
                //document.getElementById('c2').textContent = jsonResponse.cartas[1]
                //document.getElementById('c3').textContent = jsonResponse.cartas[2]
                let nUSCartas=''+jsonResponse.cartas[0]+jsonResponse.cartas[1]+jsonResponse.cartas[2]
                if(nUSCartas!==uSCartas){
                    uSCartas=nUSCartas
                    cC=[]
                    cC.push(jsonResponse.cartas[0])
                    cC.push(jsonResponse.cartas[1])
                    cC.push(jsonResponse.cartas[2])
                    if(nj===1){
                        document.getElementById('pieomano').textContent = 'Empieza el partido. Sos mano.';
                    }else{
                        document.getElementById('pieomano').textContent = 'Empieza el partido. Sos pie.';
                    }
                    //document.getElementById('b0').disabled = false
                    //document.getElementById('b1').disabled = false
                    //document.getElementById('b2').disabled = false
                    setImgs(cC[0], cC[1], cC[2])
                }
            } else {
                console.error('Error al realizar la solicitud:', xhr.status);
                //alert('Error: '+xhr.status)
                document.getElementById('salida').textContent += 'Error: '+xhr.status;
            }
            isGettingCartas=false;
        }
    };
    isGettingCartas=true;
    xhr.send();
}
setInterval(getCartas, 2000);

function jugarCarta(nc) {
    //alert('Has jugado la carta: '+nc);
    sendCartas(cC[parseInt(nc)], nc)
}
function sendCartas(carta, nc) {
    let d=new Date(Date.now())
    let url=host+'/truco/nuevoEvento'
    url+='?e=jugarcarta_'+carta+'_'+d.getTime()
    url+='&nj='+nj
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                const jsonResponse = JSON.parse(xhr.responseText);
                //alert(JSON.stringify(jsonResponse));
                let idDiv='div'+parseInt(nc + 1)
                const div = document.getElementById(idDiv);
                const nuevoContenido = '<img id="c"'+nc+' src="imgs/vacio.png" alt="Carta '+nc+'">';
                div.innerHTML = nuevoContenido;

                document.getElementById('salida').textContent += ' '+JSON.stringify(jsonResponse);

                document.getElementById('b'+nc).disabled = true;
                //document.getElementById('c1').textContent = jsonResponse.cartas[0]
                //document.getElementById('c2').textContent = jsonResponse.cartas[1]
                //document.getElementById('c3').textContent = jsonResponse.cartas[2]
            } else {
                console.error('Error al realizar la solicitud:', xhr.status);
                alert('Error al jugar la carta '+carta+': '+xhr.status)
            }
        }
    };
    xhr.send();
}
function setImgs(i1, i2, i3){
    const div1 = document.getElementById('div1');
    const nuevoContenido1 = '<img id="c1" src="imgs/'+i1+'.png" alt="Carta 1">';
    div1.innerHTML = nuevoContenido1;

    const div2 = document.getElementById('div2');
    const nuevoContenido2 = '<img id="c2" src="imgs/'+i2+'.png" alt="Carta 2">';
    div2.innerHTML = nuevoContenido2;

    const div3 = document.getElementById('div3');
    const nuevoContenido3 = '<img id="c3" src="imgs/'+i3+'.png" alt="Carta 3">';
    div3.innerHTML = nuevoContenido3;
}
function guardarCookie(nombre, valor, expiracionDias) {
  var fecha = new Date();
  fecha.setTime(fecha.getTime() + (expiracionDias * 24 * 60 * 60 * 1000));
  var expiracion = "expires=" + fecha.toUTCString();
  document.cookie = nombre + "=" + valor + ";" + expiracion + ";path=/";
}
function obtenerCookie(nombre) {
  var nombreCookie = nombre + "=";
  var cookies = document.cookie.split(';');

  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(nombreCookie) === 0) {
      return parseInt(cookie.substring(nombreCookie.length, cookie.length));
    }
  }
  return -1;
}

// Ejemplo de uso:
var valorGuardado = obtenerCookie("nj");
console.log("Valor guardado en la cookie 'nj':", valorGuardado);


getNuevoNumJugador()

