function loginRequest(email, password) {
    var raw = JSON.stringify({
        email: email,
        password: password,
      });
      let login = await $.ajax({
        url: "/api/login",
        method: "post",
        dataType: "json",
        data: raw,
        contentType: "application/json",
      });
      console.log(login);
}

export default loginRequest;




// let points = await $.ajax({
//   url: `/api/points/bb?p1=${st_point1}&p2=${st_point2}`,
//   type: "GET",
//   dataType: "json",
// });

// let changeInfo = await $.ajax({
//   url: "/api/points/update",
//   method: "post",
//   dataType: "json",
//   data: JSON.stringify(sendObject),
//   contentType: "application/json",
// });
