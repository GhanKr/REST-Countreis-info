const backButton = document.querySelector("button");
const input = document.querySelector("input");
const body = document.querySelector("body");
const mainBody = document.querySelector(".main-body");
const region = document.querySelector("select");
const searchAndFilterContainer = document.querySelector(".search-filter");
const darkMode = document.querySelector(".dark-mode-option");
const countryDetails = document.querySelector(".country-detail-info");
let initialCountries = [
  "germany",
  "United States",
  "Brazil",
  "Iceland",
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
];

countryDetails.style.display = "none";
backButton.style.display = "none";

//display initial page at initial loading time
initialCountries.forEach((element) => {
  //fetch for each country
  call(`https://restcountries.com/v3.1/name/${element}`).then((data) => {
    const country = countryGenerator(data[0]);
    mainBody.append(country);
  });
});

body.addEventListener("click", (e) => {
  const country = document.querySelectorAll(".country");

  //to display specific country info in details targeted by user
  country.forEach((element) => {
    if (element.contains(e.target)) {
      const mainBody = document.querySelector(".main-body");
      mainBody.style.display = "none";
      document.querySelector(".search-filter").style.display = "none";
      backButton.style.display = "";
      displayCountryInfoInDetail(element);
    }
  });
  // dark mode option
  if (darkMode.contains(e.target)) body.classList.toggle("dark-mode");
  // listen for filter event if happened
  if (region.contains(e.target)) filterByRegion(e);
  // if Go back button clicked
  if (backButton.contains(e.target)) {
    mainBody.style.display = "flex";
    document.querySelector(".search-filter").style.display = "flex";
    document.querySelector(".country-detail-info").style.display = "none";
    backButton.style.display = "none";
  }
});

//listen for search event of a country by user
input.addEventListener("keyup", async (e) => {
  const input = document.querySelector("input");
  const initialCountriesList = await call(
    `https://restcountries.com/v3.1/name/${input.value}`
  );

  //to render list of all the country found;
  display(initialCountriesList, countryGenerator);
});

// generic fetch request to return a json format data
function call(str) {
  return fetch(str)
    .then((jsonData) => jsonData.json())
    .then((data) => data);
}

//Display a single country details only
async function displayCountryInfoInDetail(country) {
  const countryName = country.querySelector(".country-name").textContent;
  //wait for the country data returned
  const data = await call(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

  //to fetch and display all the borders of a country
  countryDetails.querySelector(".borders").textContent = "Border Countries:";
  //check for if borders exists or not
  let borders =
    data[0].borders != null ? Object.values(data[0].borders) : undefined;

  // if border exists
  if (borders != undefined) {
    let bordersPromises = [];

    //fetch all borders and store its promise in array
    for (let i = 0; i < borders.length; i++) {
      let str = borders[i];
      bordersPromises.push(call(`https://restcountries.com/v3.1/alpha/${str}`));
    }

    //after all the promised fetched and fulfilled
    Promise.all(bordersPromises).then((borderArray) => {
      borderArray.forEach((border) => {
        const div = document.createElement("div");
        div.setAttribute("class", "border");
        div.textContent = border[0].name.common;
        countryDetails.querySelector(".borders").append(div);
      });
    });
  } else countryDetails.querySelector(".borders").append(" none");
    //display country general info
    countryDetails.querySelector('.country-flag img').src = `${data[0].flags.svg}`
    countryDetails.querySelector('.name').textContent = countryName;
    countryDetails.querySelector('.country-population').textContent = `Population:  ${getPopulation(data[0].population.toString())}`
    countryDetails.querySelector('.country-region').textContent = `Region: ${data[0].region}`
    countryDetails.querySelector('.sub-region').textContent = `Sub Region: ${data[0].subregion}`
    countryDetails.querySelector('.country-capital').textContent = `Capital: ${data[0].capital}`
    countryDetails.querySelector('.tld').textContent = `Top Level Domain: ${data[0].tld}`
    countryDetails.querySelector('.currency').textContent = `Currency: ${(Object.values(data[0].currencies))[0].name}`
    countryDetails.querySelector('.languages').textContent = `Languages: ${Object.values(data[0].languages)}`;

    mainBody.style.display = 'none'
    document.querySelector('.country-detail-info').style.display = 'flex'
}

//when user wants to filter by region
async function filterByRegion(e) {
  let filterdCountriesList = await call(`https://restcountries.com/v3.1/region/${e.target.value}?fullText=true`);
  display(filterdCountriesList, countryGenerator);
}

// display list of all the countries fetched, accepts list of countries and call back to render it individually
function display(countriesList, cb) {
  mainBody.textContent = "";
  countriesList.forEach((country) => {
    mainBody.append(cb(country));
  });
}

//display a country individually
function countryGenerator(country) {
  const template = document.getElementById("Countries-box");
  const countryContainer = template.content.cloneNode(true);
  const name = countryContainer.querySelector(".country-name");
  const flag = countryContainer.querySelector(".flag");
  const region = countryContainer.querySelector(".region");
  const capital = countryContainer.querySelector(".capital");
  const population = countryContainer.querySelector(".population");
  const img = document.createElement("img");
  img.src = country.flags.svg;
  name.append(`${country.name.common}`);
  flag.append(img);
  capital.append(`Capital: ${country.capital}`);
  population.append(`Population: ${getPopulation(country.population.toString())}`);
  region.append(`Region: ${country.region}`);
  return countryContainer;
}

//display population with comma attached.
function getPopulation(population){
  let populationArray=population.split("");
  populationArray.reverse();
  return populationArray.reduce((result,char,idx) =>{
    if (idx % 3 === 0) result = char + ',' + result;
    else
      result = char + result
     return result;
  })
}
