console.log("this est")

fetch('https://api.le-systeme-solaire.net/rest/bodies/terre')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const name = data.englishName

    
    document.getElementById("name").innerHTML = name
  });