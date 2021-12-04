






// Selectors creation
var texture = document.getElementById("texture");
var textures = ["Creamy", "Firm", "Hard", "Medium", "Smooth", "Soft"];
insertSelectors(texture, textures);

var source = document.getElementById("source");
var sources = ["Buffalo", "Cow", "Donkey", "Ewe", "Goat", "Sheep"];
insertSelectors(source, sources);

var region = document.getElementById("region");
var regions = ["Belgium", "France", "Guernsey", "Italy", "Jersey", "Netherlands", "United_Kingdom", "United_States", "Scotland", "Spain"];
insertSelectors(region, regions);

function insertSelectors(place, tab) {
  for (var x = 0; x < tab.length; x++) {
    place.innerHTML += "<div class='selectinpannel'><input type='checkbox' id='" + tab[x] + "' name='" + tab[x] + "' /><label for='" + tab[x] + "'>" + tab[x].substring(0, 12) + "</label></div>"
  }
}



// SPARQL Research 
var main = document.getElementById("main");
main.addEventListener("click", (e) => {
  console.log(e)
});