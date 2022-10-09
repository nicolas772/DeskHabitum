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
                                <span class="material-icons-sharp" style="margin-left:40px;">check</span>
                            </th>
                            <td>
                                <span class="material-icons-sharp" style="margin-left:15px;">delete</span>
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
                                <span class="material-icons-sharp" style="margin-left:14px;">delete</span>
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
