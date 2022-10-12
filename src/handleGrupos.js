async function get_code_grupo(){
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)    
    document.getElementById('codigo_vista_lider').textContent = code       
}



async function aceptar_solicitud(id_user){
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)

    
    let myNotification = new Notification('SOLICITUD', {
        body: 'Participante aceptado'
      });
    let aceptar = await window.api.addParticipante(id_user, code)
    window.location.reload();
}

async function rechazar_solicitud(id_user){
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)
    let myNotification2 = new Notification('SOLICITUD', {
        body: 'Participante rechazado'
      });
    let rechazar = window.api.quitarSolicitud(id_user, code)
    window.location.reload()
      
}

async function eliminar_miembro(id_miembro){
    let ID = await window.api.get_user_id("")
    let code = await window.api.getCodeGrupo(ID)    
    let myNotification2 = new Notification('SOLICITUD', {
        body: 'Participante eliminado'
      });    
    let eliminar = await window.api.quitarDelGrupo(id_miembro,code)
    window.location.reload();     
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
                                <span class="material-icons-sharp" style="margin-left:40px;" onclick="aceptar_solicitud('${data[i].id}')" >check</span>
                            </th>
                            <td>
                                <span class="material-icons-sharp" style="margin-left:15px;" onclick="rechazar_solicitud('${data[i].id}')">delete</span>
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
    get_code_grupo()
    get_solicitudes()
    get_participantes()

}





window.onload = cargar_grupos()
