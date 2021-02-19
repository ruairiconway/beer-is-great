// VARIABLES
const urlBase = 'https://api.punkapi.com/v2/beers'
const filterABV = document.getElementById('filterABV')
const filterIBU = document.getElementById('filterIBU')
const pageNumSpan = document.getElementById('pageNumber')
const prevPageBtn = document.getElementById('prevPage')
const nextPageBtn = document.getElementById('nextPage')
let optionsABV = ""
let optionsIBU = ""
let page = 1


// FILTERS
filterABV.addEventListener('change', e => {
    const value = e.target.value

    switch (value) {
        case "all":
            optionsABV = ""
            break
        case "weak":
            optionsABV = "&abv_lt=4.6"
            break
        case "medium":
            optionsABV = "&abv_gt=4.6&abv_lt=7.6"
            break
        case "strong":
            optionsABV = "&abv_gt=7.5"
            break
    }
    
    page = 1
    getBeers()
})

filterIBU.addEventListener('change', e => {
    const value = e.target.value

    switch (value) {
        case "all":
            optionsIBU = ""
            break
        case "weak":
            optionsIBU = "&ibu_lt=35"
            break
        case "medium":
            optionsIBU = "&ibu_gt=34&ibu_lt=75"
            break
        case "strong":
            optionsIBU = "&ibu_gt=74"
            break
    }

    page = 1
    getBeers()
})


// PAGINATION
function handlePageCount(beerData) {
    pageNumSpan.innerHTML = page

    if (page === 1) {
        prevPageBtn.disabled = true
    } else {
        prevPageBtn.disabled = false
    }

    if (beerData.length < 25) {
        nextPageBtn.disabled = true
    } else {
        nextPageBtn.disabled = false
    }

}

prevPageBtn.addEventListener('click', () => {
    page--
    getBeers()
})

nextPageBtn.addEventListener('click', () => {
    page++
    getBeers()
})


// RENDER
function renderBeerData(beerData) {
    const beersDiv = document.querySelector('.beers')
    let beersHtml = ''
    const genericBottle = 'https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png'


    beerData.forEach(beer => {
        beersHtml += `
        <div class='beer-wrapper card'>
            <div class='beer'>
                <img class='beer__img' src="${beer.image_url ? beer.image_url : genericBottle}">
                <h3>${beer.name}</h3>
                <span class='beer__info'>
                    <span>ABV: ${beer.abv}%</span>
                    <span>IBU: ${beer.ibu}</span>
                </span>
            </div>
            <div class='beer__content'>
                <div class='beer__name'>${beer.name}</div>
                <div class='beer__tagline'>${beer.tagline}</div>
                <div class='beer__description'>${beer.description}</div>
                <div class='beer__food-pairing'>
                    Pair with: ${beer.food_pairing.join(', ' )}
                </div>
            </div>
        </div>`
    });

    beersDiv.innerHTML = beersHtml
}


// FETCH

async function getBeers() {
    let url = `${urlBase}?page=${page}${optionsABV}${optionsIBU}`
    try{
        const beerDataPromise = await fetch(url)
        const beerData = await beerDataPromise.json()
        renderBeerData(beerData)
        handlePageCount(beerData)
    } catch(err) {
        alert('There was a problem with the beers! Try again later.')
        console.error(err)
    }
}


// ON LOAD
getBeers()