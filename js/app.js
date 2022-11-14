/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const FRAGMENT = document.createDocumentFragment();
const NAV_BAR = document.querySelector('.page__header');
const NAV_LIST = document.getElementById('navbar__list');
const SECTIONS = document.querySelectorAll('section');
let backToTopBtn;
let scrollTimeOut = null;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// Deactivate navlinks
function deactivateNavLinks() {
  for (let i = 0; i < NAV_LIST.children.length; i++) {
    NAV_LIST.children[i].classList.remove('active');
  }
}

// Hide navbar
function hideNavBar() {
  NAV_BAR.style.cssText = `transition: opacity 1s ; opacity: 0;`;
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
function buildNavigationMenu() {
  for (let i = 0; i < SECTIONS.length; i++) {
    const NAV_ITEM = document.createElement('li');
    NAV_ITEM.classList.add('menu__link');
    NAV_ITEM.style.cursor = 'pointer';
    // Setting data attribute equal to the section id
    NAV_ITEM.setAttribute('data-nav-target', `${SECTIONS[i].id}`);
    // Setting the inner HTML equal to the text in the data-nav attribute
    NAV_ITEM.innerHTML = `${SECTIONS[i].attributes['data-nav'].nodeValue}`;
    FRAGMENT.appendChild(NAV_ITEM);
  }
  // Appending the fragment holding the navigation items to the navigation unordered list
  NAV_LIST.appendChild(FRAGMENT);
}

// Creating scroll to tob button
function buildScrollToTob() {
  const TO_TOP_BUTTON = document.createElement('span');
  TO_TOP_BUTTON.innerHTML = `&#11165;`;
  TO_TOP_BUTTON.classList.add('backToTop');
  document.body.appendChild(TO_TOP_BUTTON);
  backToTopBtn = document.querySelector('.backToTop');
}

// Add class 'active' to section when near top of viewport
function activateVisibleSection(section, yPositions) {
  // Get the absolute Y postion for the section
  const SECTOIN_POSITION = Math.abs(section.getBoundingClientRect().y);
  // Getting the closest section position to the top of the view port by destructuring the array and getting the minimum value
  const SCROLL_Y = Math.min(...yPositions);
  let activeNavLink;
  // Checking if the section is closest to the top of the viewport
  if (SCROLL_Y === SECTOIN_POSITION) {
    // Adding "active" class if section matches
    section.classList.add('active');
    // Activating the corrosponding nav link
    deactivateNavLinks();
    activeNavLink = document.querySelector(
      `[data-nav-target = ${section.getAttribute('id')}`
    );
    activeNavLink.classList.add('active');
  } else {
    section.classList.remove('active');
  }
}

// Scroll to anchor ID using scrollTO event
function scrollToSection(e) {
  deactivateNavLinks();
  // Getting the section ID based on the data attribute
  const SECTION_ID = e.target.getAttribute('data-nav-target');
  const SECTION = document.getElementById(SECTION_ID);
  window.scrollTo({
    top: SECTION.offsetTop,
    left: 0,
    behavior: 'smooth',
  });
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build navigation menu through invoking the function
buildNavigationMenu();

// Scroll to section on link click
NAV_LIST.addEventListener('click', (event) => {
  if (event.target.nodeName === 'LI') {
    scrollToSection(event);
    event.target.classList.add('active');
  }
});

// Build back to top button
buildScrollToTob();

// Set sections as active
document.addEventListener('scroll', () => {
  const SECTIONS_Y = [];
  for (let i = 0; i < SECTIONS.length; i++) {
    // Adding current sectoins Y positions to the SECTIONS_Y array
    for (let x = 0; x < SECTIONS.length; x++) {
      SECTIONS_Y.push(Math.abs(SECTIONS[x].getBoundingClientRect().y));
    }

    // Passing the current section and all sections Y postions for comparison and activating the closest one to the top of the viewport
    activateVisibleSection(SECTIONS[i], SECTIONS_Y);
  }

  // Check if timeout is not cleared to clear and make the navigation bar visible
  if (scrollTimeOut !== null) {
    clearTimeout(scrollTimeOut);
    NAV_BAR.style.opacity = 1;
  }

  // Setting 1 second timeout for navigation bar then invoking the function to hide it
  scrollTimeOut = setTimeout(hideNavBar, 1000);

  // Setting the visibility of the back to top button based on the current body Y position
  if (document.body.getBoundingClientRect().y < 0) {
    backToTopBtn.style.visibility = 'visible';
  } else {
    backToTopBtn.style.visibility = 'hidden';
  }
});

// Making the navigation bar visible on hover
NAV_BAR.addEventListener('mouseenter', () => {
  if (scrollTimeOut !== null) {
    clearTimeout(scrollTimeOut);
  }
  NAV_BAR.style.opacity = 1;
});

// Hiding the navigatoin bar when mouse leaves it
NAV_BAR.addEventListener('mouseleave', () => {
  NAV_BAR.style.opacity = 0;
});

// Return to top of the page when the back to top button is clicked
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});
