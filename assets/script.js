
var APIKey = "&appid=d53e4da083eaaef89fa9b69a40dc5d8f";
var cityHist = [];

var storeCityHist = JSON.parse(localStorage.getItem("cityHist"));
if (storeCityHist !== null){
  cityHist = storeCityHist;
  renderCityHist();
}

function renderCityHist() {
  $("#search-city").html("")
  for (var i = 0; i < cityHist.length; i++) {
    var oldCity = cityHist[i];
    var li = $("<li>");
    li.attr("class", "list-group-item");
    li.text(oldCity.toUpperCase());
    $("#search-city").prepend(li);
  }
};

$(".btn").on("click", function(event){
  event.preventDefault();
  var city = $("#search").val();
  $("section").attr("class","row ml-4 mt-4")
  if (city === "") {
    return;
  };
  $("#search").val("");
  cityHist.push(city);

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var tempC = response.main.temp;
    var tempF = (tempC - 273.15) * 1.80 + 32;
    var iconVar = "http://api.openweathermap.org/img/w/" + response.weather[0].icon +".png";
    longEl = response.coord.lon;
    latEl = response.coord.lat;
    $("#temperature").text("Temperature: " + tempF.toFixed(2) + " F");
    $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
    $(".City").text(response.name +" "+ (moment().format("(M/D/YYYY)")));
    $(".icon1").attr("src", iconVar);

    UVI();

    function UVI() {
      var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?"+APIKey+"&lat="+latEl+"&lon="+longEl;
      
      $.ajax({
        url: queryUVI,
        method: "GET"
      }).then(function(resp) {
        var UVIndex = resp.value;
        $("#UVindex").text("UV Index: " + UVIndex);
        if (UVIndex >= 11) {
          $("#UVindex").attr("class","badge badge-dark");
        }
        else if (UVIndex >= 8){
          $("#UVindex").attr("class","badge badge-danger");
        }
        else if (UVIndex >= 6){
          $("#UVindex").attr("class","badge badge-warning");
        }
        else if (UVIndex >= 3){
          $("#UVindex").attr("class","badge badge-success");
        }
        else {
          $("#UVindex").attr("class","badge badge-primary");
        }
      })
    };
    forcast();
  });

  function forcast() {
  
    var queryFor = "http://api.openweathermap.org/data/2.5/forecast?q="+city+APIKey;
  
    $.ajax({
      url: queryFor,
      method: "GET"
    }).then(function(resp) {
      var i = 0;
      var d = 1;
      for (var a = 0; a < 5; a++){
        var tempC5 = resp.list[i].main.temp;
        var tempF5 = (tempC5 - 273.15) * 1.80 + 32;
        $("#date1").text((moment().add(d, "days").format("M/D/YYYY")));
        $(".icon2").attr("src", "http://api.openweathermap.org/img/w/"+resp.list[i].weather[0].icon+".png");
        $("#temperature2").text("Temperature: " + tempF5.toFixed(2) + " F");
        $("#humidity2").text("Humidity: " + resp.list[i].main.humidity + " %");
        console.log(d,i)
        i+=9;
        d++;
      }
    })
    storeCity();
  };

  function storeCity() {
    localStorage.setItem("cityHist", JSON.stringify(cityHist));
    renderCityHist();
  };
});



