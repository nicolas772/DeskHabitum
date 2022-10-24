let ID_USER = window.api.get_user_id("")


//--cambiar 2-> postura

const checkobjrec2 = document.getElementById('checkobjrec2');
const checkobjmes2 = document.getElementById('checkobjmes2');
const checkobjanio2 = document.getElementById('checkobjanio2');

const objrec2 = document.getElementById('objrec2');
const objmes2 = document.getElementById('objmes2');
const objanio2 = document.getElementById('objanio2');



checkobjrec2.addEventListener('click', function handleClick() {
  if (checkobjrec2.checked) {
    objrec2.style.display = 'block';
    objmes2.style.display = 'none';
    objanio2.style.display = 'none';
    objrec2.style.visibility = 'visible';
    objmes2.style.visibility = 'hidden';
    objanio2.style.visibility = 'hidden';
    
  } else {
    objrec2.style.display = 'none';
    objrec2.style.visibility = 'hidden';
  }
});

checkobjmes2.addEventListener('click', function handleClick() {
  if (checkobjmes2.checked) {
    objrec2.style.display = 'none';
    objmes2.style.display = 'block';
    objanio2.style.display = 'none';
    objrec2.style.visibility = 'hidden';
    objmes2.style.visibility = 'visible';
    objanio2.style.visibility = 'hidden';
  } else {
    objmes2.style.display = 'none';
    objmes2.style.visibility = 'hidden';
  }
});

checkobjanio2.addEventListener('click', function handleClick() {
  if (checkobjanio2.checked) {
    objrec2.style.display = 'none';
    objmes2.style.display = 'none';
    objanio2.style.display = 'block';
    objrec2.style.visibility = 'hidden';
    objmes2.style.visibility = 'hidden';
    objanio2.style.visibility = 'visible';
    
  } else {
    objanio2.style.display = 'none';
    objanio2.style.visibility = 'hidden';
  }
});

/*
function init4(){
  update_dash_general()
  actualizarNavbar();
}
window.onload = init4;

*/