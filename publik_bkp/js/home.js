function setText(id, newvalue) {
  var s = document.getElementById(id);
  s.innerHTML = newvalue;
}

window.onload = function () {
  let object = JSON.parse(localStorage.getItem("userInfo"));

  // or window.addEventListener("load",function() {
  setText("nome", object.user.firstName);
};
