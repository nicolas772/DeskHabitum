async function init_cam() {

    var img = document.createElement("img");
    img.src = 'https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif';
    img.style.height = '80px';
    img.style.width = '80px';
    document.getElementById("loading-webcam").appendChild(img);

    window.api.init_model().then(() => {
        document.getElementById("loading-webcam").innerHTML = 'Monitoreando webcam!';
      });

}


function stop_cam(){
    window.api.stop_monitoring();
    document.getElementById("loading-webcam").innerHTML = '';
}