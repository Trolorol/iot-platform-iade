async function login() {
  let email = document.getElementById("email").value;

  let password = document.getElementById("password").value;

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    email: email,
    password: password,
  });

  //   var raw = JSON.stringify({
  //     email: "kobe@blackmamba.com",
  //     password: "123456",
  //   });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let response = await fetch("http://localhost:3000/api/login", requestOptions);

  let result = await response.json();

  console.log(result);

  if (response.status === 200) {
    localStorage.setItem("userInfo", JSON.stringify(result));
    window.location.href = "./html/home.html";
  } else {
    alert("Invalid credentials");
  }
}
