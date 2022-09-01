function startCarousels(document) {
    const items = document.querySelectorAll(".carousel__photo");
    let totalItems = items.length;
    let slide = 0;
    let moving = true;

    // To initialise the carousel we'll want to update the DOM with our own classes
    function setInitialClasses() {
      // Target the last, initial, and next items and give them the relevant class.
      // This assumes there are three or more items.
      items[totalItems - 1].classList.add("prev");
      items[0].classList.add("gallery-active");
      items[1].classList.add("next");
    }

    // Set click events to navigation buttons
    function setEventListeners() {
      document.addEventListener("click", function (e) {
        if (e.target.classList.contains("carousel__button--next")) {
          moveNext();
        } else if (e.target.classList.contains("carousel__button--prev")) {
          movePrev();
        }
      });
    }

    // Disable interaction by setting 'moving' to true for the same duration as our transition (0.5s = 500ms)
    function disableInteraction() {
      moving = true;
      setTimeout(function () {
        moving = false;
      }, 500);
    }

    function moveCarouselTo(slide) {
      // Check if carousel is moving, if not, allow interaction
      if (!moving) {
        // temporarily disable interactivity
        disableInteraction();

        // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
        let newPrevious = slide - 1,
          newNext = slide + 1,
          oldPrevious = slide - 2,
          oldNext = slide + 2;

        // Test if carousel has more than three items
        if (totalItems - 1 >= 3) {
          // Checks if the new potential slide is out of bounds and sets slide numbers
          if (newPrevious <= 0) {
            oldPrevious = totalItems - 1;
          } else if (newNext >= totalItems - 1) {
            oldNext = 0;
          }
          // Check if current slide is at the beginning or end and sets slide numbers
          if (slide === 0) {
            newPrevious = totalItems - 1;
            oldPrevious = totalItems - 2;
            oldNext = slide + 1;
          } else if (slide === totalItems - 1) {
            newPrevious = slide - 1;
            newNext = 0;
            oldNext = 1;
          }
        }

          // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.
          
          // Based on the current slide, reset to default classes.
          items[oldPrevious].className = "carousel__photo";
          items[oldNext].className = "carousel__photo";
          
          // Add the new classes
          items[newPrevious].className = "prev" + " carousel__photo";
          items[slide].className = "gallery-active" + " carousel__photo";
          items[newNext].className = " next" + " carousel__photo";
      }
    }

    // Next navigation handler
    function moveNext() {
      // Check if moving
      if (!moving) {
        // If it's the last slide, reset to 0, else +1
        if (slide === totalItems - 1) {
          slide = 0;
        } else {
          slide++;
        }

        // Move carousel to updated slide
        moveCarouselTo(slide);
      }
    }

    // Previous navigation handler
    function movePrev() {
      // Check if moving
      if (!moving) {
        // If it's the first slide, set as the last slide, else -1
        if (slide === 0) {
          slide = totalItems - 1;
        } else {
          slide--;
        }

        // Move carousel to updated slide
        moveCarouselTo(slide);
      }
    }

    // Initialise carousel
    function initCarousel() {
      setInitialClasses();
      setEventListeners();

      // Set moving to false now that the carousel is ready
      moving = false;
    }

    // make it rain
    initCarousel();
}

startCarousels(document);