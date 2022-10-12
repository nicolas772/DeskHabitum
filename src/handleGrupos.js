async function aceptar_solicitud(nombresolicitante){
    
    let myNotification = new Notification(nombresolicitante, {
        body: 'acepta solicitud'
      });
}
async function rechazar_solicitud(id_solicitante){
    var idsolstring=id_solicitante.toString()
    let myNotification2 = new Notification(idsolstring, {
        body: 'rechaza solicitud'
      });
      
}

async function eliminar_miembro(id_miembro){
    
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)
    let myNotification2 = new Notification(id_miembro, {
        body: code
      });
    
    let sacar = await window.api.quitarDelGrupo(id_miembro,code)
    
      
}

async function get_solicitudes(){ 
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)
    var arreglo = await window.api.getSolicitudesGrupo(code)

    

    buildTable(arreglo)
    function buildTable(data)
    {
        var table=document.getElementById('myTable')
        for(var i = 0;i<data.length;i++)
        {
            var row =` <tr>
                            <td>${data[i].nombre}</td>
                            <td>${data[i].apellido}</td>
                            <th scope="row">
                                <span class="material-icons-sharp" style="margin-left:40px;" onclick="aceptar_solicitud('${data[i].nombre}')" >check</span>
                            </th>
                            <td>
                                <span class="material-icons-sharp" style="margin-left:15px;" onclick="rechazar_solicitud('${data[i].id}')">close</span>
                            </td>
                        </tr>`
            table.innerHTML+=row
        }
    }

}

async function get_participantes(){ 
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)
    var arreglo = await window.api.getParticipantesGrupo(code)

            
    buildTable(arreglo)
    function buildTable(data)
    {
        var table=document.getElementById('myTable2')
        for(var i = 0;i<data.length;i++)
        {
            var row =` <tr>
                            <td>${data[i].nombre}</td>
                            <td>${data[i].apellido}</td>
                    
                            <td>
                                <span class="material-icons-sharp" style="margin-left:14px;" onclick="eliminar_miembro('${data[i].id}')">delete</span>
                            </td>
                        </tr>`
            table.innerHTML+=row
        }
    }
}


async function cargar_grupos(){
    get_solicitudes()
    get_participantes()

}





window.onload = cargar_grupos()
