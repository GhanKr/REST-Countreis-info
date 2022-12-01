const backButton = document.querySelector('button')
const input = document.querySelector('input');
const body = document.querySelector('body');
const mainBody = document.querySelector('.main-body');
const region = document.querySelector('select');
const searchAndFilterContainer = document.querySelector('.search-filter')
const darkMode = document.querySelector('.dark-mode-option')
const countryDetails = document.querySelector('.country-detail-info')
let initialCountries = ['germany', 'United States', 'Brazil', 'Iceland', 'Afghanistan', 'Åland Islands', 'Albania', 'Algeria']

countryDetails.style.display = 'none';
backButton.style.display = 'none';

initialCountries.forEach(async (element) => {
    const data = await call(`https://restcountries.com/v3.1/name/${element}`);
    const country = countryGenerator(data[0])
    mainBody.append(country)
})

body.addEventListener('click', e => {
    const country = document.querySelectorAll('.country');
    country.forEach(element => {
        if (element.contains(e.target)) {
            const mainBody = document.querySelector('.main-body')
            mainBody.style.display = 'none'
            document.querySelector('.search-filter').style.display = 'none'
            backButton.style.display = '';
            displayCountryInfoInDetail(element)
        }

    })
    if (darkMode.contains(e.target))
        body.classList.toggle('dark-mode')

    if (region.contains(e.target))
        filterByRegion(e)

    if (backButton.contains(e.target)) {
        mainBody.style.display = 'flex';
        document.querySelector('.search-filter').style.display = 'flex';
        document.querySelector('.country-detail-info').style.display = 'none';
        backButton.style.display = 'none'
    }
})

input.addEventListener('keyup', async (e) => {
    const input = document.querySelector('input');
    const str = `https://restcountries.com/v3.1/name/${input.value}`;
    const data = await call(str);
    display(data)
})

async function call(str) {
    const respnse = await fetch(str);
    const data = await respnse.json();
    return data;
}

async function displayCountryInfoInDetail(country) {
    const countryName = country.querySelector('.country-name').textContent;
    const data = await call(`https://restcountries.com/v3.1/name/${countryName}`);
    countryDetails.querySelector('.borders').textContent = 'Border Countries:'
    let borders = data[0].borders != null ? Object.values(data[0].borders) : undefined;
    if (borders != undefined) {
        for (let i = 0; i < borders.length; i++) {
            let str = borders[i]
            const data = await call(`https://restcountries.com/v3.1/alpha/${str}`);
            console.log(data[0].population)
            const div = document.createElement('div');
            div.setAttribute('class', 'border')
            div.textContent = data[0].name.common;
            countryDetails.querySelector('.borders').append(div);
        }
    }
    else
        countryDetails.querySelector('.borders').append(' none')
    countryDetails.querySelector('.country-flag img').src = `${data[0].flags.svg}`
    countryDetails.querySelector('.name').textContent = countryName;
    countryDetails.querySelector('.country-population').textContent = `Population: ${data[0].population}`
    countryDetails.querySelector('.country-region').textContent = `Region: ${data[0].region}`
    countryDetails.querySelector('.sub-region').textContent = `Sub Region: ${data[0].subregion}`
    countryDetails.querySelector('.country-capital').textContent = `Capital: ${data[0].capital}`
    countryDetails.querySelector('.tld').textContent = `Top Level Domain: ${data[0].tld}`
    countryDetails.querySelector('.currency').textContent = `Currency: ${Object.values(data[0].currencies)}`
    countryDetails.querySelector('.languages').textContent = `Languages: ${Object.values(data[0].languages)}`;

    mainBody.style.display = 'none'
    document.querySelector('.country-detail-info').style.display = 'flex'

}

async function filterByRegion(e) {
    const str = `https://restcountries.com/v3.1/region/${e.target.value}`;
    let data = await call(str);
    display(data);
}

function display(data, respnse) {
    mainBody.textContent = "";
    data.forEach(element => {
        const country = countryGenerator(element);
        mainBody.append(country);
    });
}

function countryGenerator(element) {
    const template = document.getElementById('Countries-box');
    const country = template.content.cloneNode(true)
    const name = country.querySelector('.country-name')
    const flag = country.querySelector('.flag')
    const region = country.querySelector('.region');
    const capital = country.querySelector('.capital')
    const population = country.querySelector('.population')
    const img = document.createElement('img')
    img.src = element.flags.svg;
    name.append(`${element.name.common}`)
    flag.append(img);
    capital.append(`Capital: ${element.capital[0]}`)
    population.append(`Population: ${element.population}`)
    region.append(`Region: ${element.region}`)
    return country;
}