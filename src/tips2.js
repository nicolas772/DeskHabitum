function actualizarTips2(){
    let consejo = window.api.readConsejoFile() //json con el consejo que debo mostrar
    document.getElementById("tips2-titulo").append(consejo['titulo'])
    document.getElementById("tips2-imagen").src = consejo['img']
    document.getElementById("tips2-parrafo").append(consejo['p'])
}

window.onload = actualizarTips2;