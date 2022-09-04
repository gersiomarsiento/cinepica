// IMDB Rating Plugin Script 
try{
  (function(d,s,id){var js,stags=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}js=d.createElement(s);js.id=id;js.src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";stags.parentNode.insertBefore(js,stags);})(document,"script","imdb-rating-api");
} catch {
  (err)=>{console.log(err)}
}

// Hamburger
const showNav = () => {
  document.getElementById("navbar").classList.toggle("display-navbar");
  document.body.classList.toggle("modal-open");
  //Hamburger turns into Cross
  document.getElementById("bar-1").classList.toggle("rotate45");
  document.getElementById("bar-2").classList.toggle("display-none");
  document.getElementById("bar-3").classList.toggle("rotate135");
};
document.querySelector("#hamburger-container").addEventListener('click', showNav);

// User button
let collapsibles = document.querySelectorAll('.collapsible');

const toggleUserMenu = ()=>{
  collapsibles.forEach(x => x.classList.toggle("collapsible"));
  return false
}
document.querySelector("#user-btn-container").addEventListener('click', toggleUserMenu);
