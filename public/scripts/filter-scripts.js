// Display FILTERS menu
const showFilters = ()=>{
  document.querySelector('.filters-container').classList.toggle("display-active");
  document.querySelector('#filter-button-text-1').classList.toggle("display-none");
  document.querySelector('#filter-button-text-2').classList.toggle("display-none");
  document.body.classList.toggle("modal-open");
}

//Add event listener to button - onclick
const filterButton = document.querySelector("#filter-button")
const filtersContainer = document.querySelector("#filters-container")
filterButton.addEventListener('click', showFilters);
  
//FILTERS functionality (onclick in <A> tag)
const filterFilmsList = (e)=>{
  const selectedFilter = e.target.getAttribute("data-category");
  const filterAttribute = e.target.getAttribute("data-value");
  //Set all films to HIDE
  document.querySelectorAll(".film-list-item").forEach((x) => {
    x.classList.add("hide")
  })
  //Set filtered ones to SHOW
  document.querySelectorAll(`.film-list-item[data-${selectedFilter}*="${filterAttribute}" i]`).forEach((x) => {
    x.classList.remove("hide")
  })
  showFilters()
}

//******FILTERS SCROLLING MENU START**********
// FILTER TYPE CHANGE
const filterTypes = [...document.getElementsByClassName("filter-by")];
let currentFilter = 0;
const nextFilter = () => {
  // PUT ALL DISPLAYED ELEMENTS FROM PREVIOUS FILTER TO NONE
  document.querySelectorAll(".active > div > .current").forEach((x) => {
    x.classList.replace("current", "hide");
    x.classList.remove("animate-bottom", "animate-top");
  });
  filterTypes[currentFilter].classList.remove("active");
  filterTypes.forEach(x=> x.classList.remove("animate-right", "animate-left"));

  if (currentFilter < filterTypes.length - 1) {
    filterTypes[currentFilter + 1].classList.add("active","animate-right");
    currentFilter++;
  } else {
    filterTypes[0].classList.add("active","animate-right");
    currentFilter = 0;
  }
  // Refresh filters and load a few
  getNewFilters();
  scrollDownFilter();
};

const prevFilter = () => {
  // PUT ALL DISPLAYED ELEMENTS FROM PREVIOUS FILTER TO NONE
  document.querySelectorAll(".active > div > .current").forEach((x) => {
    x.classList.replace("current", "hide");
    x.classList.remove("animate-bottom", "animate-top");
  });
  filterTypes[currentFilter].classList.remove("active");
  filterTypes.forEach(x=> x.classList.remove("animate-right", "animate-left"));

    
  if (currentFilter > 0) {
    filterTypes[currentFilter - 1].classList.add("active","animate-left");
    currentFilter--;
  } else {
    filterTypes[filterTypes.length - 1].classList.add("active","animate-left");
    currentFilter = filterTypes.length - 1;
  }
  // Refresh filters and load a few
  getNewFilters();
  scrollDownFilter();
};

// GET NEW FILTER-BY CATEGORY
let getNewFilters = () => {
  allFilterButtons = [
    ...document.querySelectorAll(".active > div > .filter-element"),
  ];
  displayedFilterNames = 0;
};

let allFilterButtons = [
  ...document.querySelectorAll(".active > div >.filter-element"),
];

let displayedFilterNames = 0;
//FILTERS SCROLL UP AND DOWN
const scrollUpFilter = () => {
  allFilterButtons.forEach(x=> x.classList.remove("animate-bottom", "animate-top"));

  for (i = 0; i < 10; i++) {
    //IFS TO HIDE ELEMENTS
    if (
      displayedFilterNames > 0 &&
      displayedFilterNames <= allFilterButtons.length
    ) {
      allFilterButtons[displayedFilterNames - 1].classList.replace(
        "current",
        "hide"
      );
    } else if (displayedFilterNames == 0) {
      //Display none the last element
      allFilterButtons[allFilterButtons.length - 1].classList.replace(
        "current",
        "hide"
      );
      displayedFilterNames = allFilterButtons.length;
    }

    //IFS TO SHOW ELEMENTS
    if (displayedFilterNames > 10) {
      allFilterButtons[displayedFilterNames - 11].classList.replace(
        "hide",
        "current"
      );
      allFilterButtons[displayedFilterNames - 11].classList.add("animate-bottom")
    } else if (displayedFilterNames <= 10) {
      allFilterButtons[
        allFilterButtons.length - 1 - (10 - displayedFilterNames)
      ].classList.replace("hide", "current");
      allFilterButtons[allFilterButtons.length - 1 - (10 - displayedFilterNames)].classList.add("animate-bottom")

    }
    //REDUCE DISPLAYED NUMBER EVERY TIME
    displayedFilterNames--;
  }
};
const scrollDownFilter = () => {
  for (i = 0; i < 10; i++) {
    //IFS TO SHOW ELEMENTS
    if (displayedFilterNames < allFilterButtons.length) {
      allFilterButtons[displayedFilterNames].classList.replace(
        "hide", //maybe -1 here ???
        "current"
      );
      allFilterButtons[displayedFilterNames].classList.add("animate-top")
    } else if (displayedFilterNames == allFilterButtons.length) { // MAYBE CHANGE TO IF?
      displayedFilterNames = 0; //and just put this?
      allFilterButtons[displayedFilterNames].classList.replace(
        "hide",
        "current"
      );
      allFilterButtons[displayedFilterNames].classList.add("animate-top")

    }

    //IFS TO HIDE ELEMENTS
    if (displayedFilterNames > 9) {
      // COMES ONLY ON 2ND ROUND
      allFilterButtons[displayedFilterNames - 10].classList.replace(
        "current",
        "hide"
      );
    } else if (displayedFilterNames < 10) {
      allFilterButtons[
        allFilterButtons.length - 1 - (9 - displayedFilterNames)
      ].classList.replace("current", "hide");
    }
    displayedFilterNames++;
  }
};
scrollDownFilter();

// onclick="filterFilmsList(`<%=category%>`,`<%= value %>`);showFilters()"
// console.log(categoryToPass);


// (`${category}`,`${value}`)
document.querySelectorAll(".filter-toggler").forEach((x)=>{x.addEventListener('click', filterFilmsList)});
document.querySelectorAll(".filter-by-button-prev").forEach((x)=>{x.addEventListener('click', prevFilter)});
document.querySelectorAll(".filter-by-button-next").forEach((x)=>{x.addEventListener('click', nextFilter)});
document.querySelectorAll(".scroll-up-filter").forEach((x)=>{x.addEventListener('click', scrollUpFilter)});
document.querySelectorAll(".scroll-down-filter").forEach((x)=>{x.addEventListener('click', scrollDownFilter)});

let touchYStart = "";
document.querySelectorAll(".filter-elements-container").forEach((x)=>{
  x.addEventListener('touchstart', function(e) {
      touchYStart = e.touches[0].clientY;
    })
  });

document.querySelectorAll(".filter-elements-container").forEach((x)=>{
  x.addEventListener('touchend', function(e) {
      const touchEnd = e.changedTouches[0].clientY;
      if (touchYStart > touchEnd+5) {
          scrollUpFilter()
      } else if (touchYStart < touchEnd-5) {
          scrollDownFilter()
      }
    })
  });
let touchXStart = "";
document.querySelectorAll(".filter-by-title").forEach((x)=>{
  x.addEventListener('touchstart', function(e) {
      touchXStart = e.touches[0].clientY;
    })
  });

document.querySelectorAll(".filter-by-title").forEach((x)=>{
  x.addEventListener('touchend', function(e) {
      const touchEnd = e.changedTouches[0].clientY;
      if (touchXStart > touchEnd) {
          prevFilter()
      } else if (touchXStart < touchEnd) {
          nextFilter()
      }
    })
  });

//******FILTERS SCROLLING MENU END**********
