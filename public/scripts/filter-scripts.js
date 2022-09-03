// Display FILTERS menu
const showFilters = ()=>{
  document.querySelector('.filters-container').classList.toggle("display-active");
  document.querySelector('#filter-button-text-1').classList.toggle("display-none");
  document.querySelector('#filter-button-text-2').classList.toggle("display-none");
}
//Add event listener to button - onclick
const filterButton = document.querySelector("#filter-button")
const filtersContainer = document.querySelector("#filters-container")
filterButton.addEventListener('click', showFilters);
// const checkModal = (e)=>{
//   if(e.target!==(filtersContainer)) {
//     console.log(e);
//     showFilters()
//   }}
  // document.body.addEventListener('click', checkModal);

  
//FILTERS functionality (onclick in <A> tag)
const filterFilmsList = (e)=>{
  const selectedFilter = e.target.getAttribute("data-category");
  const filterAttribute = e.target.getAttribute("data-value");
  //Set all films to HIDE
  document.querySelectorAll(".film-list-item").forEach((x) => {
    x.classList.add("display-none")
  })
  //Set filtered ones to SHOW
  document.querySelectorAll(`.film-list-item[data-${selectedFilter}*="${filterAttribute}" i]`).forEach((x) => {
    x.classList.remove("display-none")
  })
  showFilters()
}

//******FILTERS SCROLLING MENU START**********
// FILTER TYPE CHANGE
const filterTypes = [...document.getElementsByClassName("filter-by")];
let currentFilter = 0;
const nextFilter = () => {
  // PUT ALL DISPLAYED ELEMENTS FROM PREVIOUS FILTER TO NONE
  document.querySelectorAll(".active > div > .display-block").forEach((x) => {
    x.classList.replace("display-block", "display-none");
  });
  filterTypes[currentFilter].classList.remove("active");
  if (currentFilter < filterTypes.length - 1) {
    filterTypes[currentFilter + 1].classList.add("active");
    currentFilter++;
  } else {
    filterTypes[0].classList.add("active");
    currentFilter = 0;
  }
  // Refresh filters and load a few
  getNewFilters();
  scrollDownFilter();
};
const prevFilter = () => {
  // PUT ALL DISPLAYED ELEMENTS FROM PREVIOUS FILTER TO NONE
  document.querySelectorAll(".active > div > .display-block").forEach((x) => {
    x.classList.replace("display-block", "display-none");
  });
  filterTypes[currentFilter].classList.remove("active");
  if (currentFilter > 0) {
    filterTypes[currentFilter - 1].classList.add("active");
    currentFilter--;
  } else {
    filterTypes[filterTypes.length - 1].classList.add("active");
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
  for (i = 0; i < 10; i++) {
    //IFS TO HIDE ELEMENTS
    if (
      displayedFilterNames > 0 &&
      displayedFilterNames <= allFilterButtons.length
    ) {
      allFilterButtons[displayedFilterNames - 1].classList.replace(
        "display-block",
        "display-none"
      );
    } else if (displayedFilterNames == 0) {
      //Display none the last element
      allFilterButtons[allFilterButtons.length - 1].classList.replace(
        "display-block",
        "display-none"
      );
      displayedFilterNames = allFilterButtons.length;
    }

    //IFS TO SHOW ELEMENTS
    if (displayedFilterNames > 10) {
      allFilterButtons[displayedFilterNames - 11].classList.replace(
        "display-none",
        "display-block"
      );
    } else if (displayedFilterNames <= 10) {
      allFilterButtons[
        allFilterButtons.length - 1 - (10 - displayedFilterNames)
      ].classList.replace("display-none", "display-block");
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
        "display-none", //maybe -1 here ???
        "display-block"
      );
    } else if (displayedFilterNames == allFilterButtons.length) {
      displayedFilterNames = 0;
      allFilterButtons[displayedFilterNames].classList.replace(
        "display-none",
        "display-block"
      );
    }

    //IFS TO HIDE ELEMENTS
    if (displayedFilterNames > 9) {
      // COMES ONLY ON 2ND ROUND
      allFilterButtons[displayedFilterNames - 10].classList.replace(
        "display-block",
        "display-none"
      );
    } else if (displayedFilterNames < 10) {
      allFilterButtons[
        allFilterButtons.length - 1 - (9 - displayedFilterNames)
      ].classList.replace("display-block", "display-none");
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
//******FILTERS SCROLLING MENU END**********
