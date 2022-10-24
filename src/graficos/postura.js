let ID_USER = window.api.get_user_id("")
//---------------GRAFICO-----------





//---------------------------

//--cambiar 2-> postura

const tricorec2 = document.getElementById('tricorec2');
const tricomes2 = document.getElementById('tricomes2');
const tricoanio2 = document.getElementById('tricoanio2');

const checktricorec2 = document.getElementById('checktricorec2');
const checktricomes2 = document.getElementById('checktricomes2');
const checktricoanio2 = document.getElementById('checktricoanio2');

checktricorec2.addEventListener('click', function handleClick() {
  if (checktricorec2.checked) {
    tricorec2.style.display = 'block';
    tricomes2.style.display = 'none';
    tricoanio2.style.display = 'none';
    tricorec2.style.visibility = 'visible';
    tricomes2.style.visibility = 'hidden';
    tricoanio2.style.visibility = 'hidden';
    
  } else {
    tricorec2.style.display = 'none';
    tricorec2.style.visibility = 'hidden';
  }
});

checktricomes2.addEventListener('click', function handleClick() {
  if (checktricomes2.checked) {
    tricorec2.style.display = 'none';
    tricomes2.style.display = 'block';
    tricoanio2.style.display = 'none';
    tricorec2.style.visibility = 'hidden';
    tricomes2.style.visibility = 'visible';
    tricoanio2.style.visibility = 'hidden';
  } else {
    tricomes2.style.display = 'none';
    tricomes2.style.visibility = 'hidden';
  }
});

checktricoanio2.addEventListener('click', function handleClick() {
  if (checktricoanio2.checked) {
    tricorec2.style.display = 'none';
    tricomes2.style.display = 'none';
    tricoanio2.style.display = 'block';
    tricorec2.style.visibility = 'hidden';
    tricomes2.style.visibility = 'hidden';
    tricoanio2.style.visibility = 'visible';
    
  } else {
    tricoanio2.style.display = 'none';
    tricoanio2.style.visibility = 'hidden';
  }
});


/*
function init4(){
  update_dash_general()
  actualizarNavbar();
}
window.onload = init4;

*/