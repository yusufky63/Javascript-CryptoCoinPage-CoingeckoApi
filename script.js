const row = document.querySelector('.row')
const updateTime = document.querySelector('.updateTime')
const searchInput = document.querySelector('.search')

const page = document.querySelector('.page')
const buttonName = document.querySelector('.convert')
const ico = document.querySelector('.icoConvert')
currency = 'usd'
currencySign = '$'

buttonName.addEventListener("click", () => {
    if (currency == 'try') {
        currency = 'usd';
        currencySign = '$'
        getDataAll(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100`)
        ico.setAttribute('src', 'img/turkish-lira.png')

    } else {
        currencySign = '₺'
        currency = 'try'
        getDataAll(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100`)
        ico.setAttribute('src', 'img/dollar.png')
    }
})

api = `
https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`;


page.addEventListener('input', function() {
    api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${page.value}`;
    getDataAll(api)
});


//Input listener (getDataSearch)
var input = document.querySelector('input');
input.addEventListener('input', function() {
    if (input.value != '') {
        ClearCard();
        getDataSearch(api, input.value)
    } else if (input.value == '') {
        ClearCard();
        getDataAll(api)
    }
});



//Call Api
getDataAll(api)

//All Data Api Call
function getDataAll(api) {
    ClearCard()
    fetch(api)
        .then((res) => res.json())
        .then((data) => {
            data.forEach(coin => {
                allData(coin, coin.price_change_percentage_24h);
            });
        })
        .catch((err) => console.warn(err));
}
//All Data 
function allData(coin, coinprice24h) {
    card = createCard();
    priceChangeColorAndArrow(coinprice24h);
    designData(card, coin);
}




//Input data Search Api Call
function getDataSearch(api, text) {
    fetch(api)
        .then((res) => res.json())
        .then((data) => {
            coinName = data.find(coin => coin.id == text);
            searchApi(coinName.price_change_percentage_24h);
        })
        .catch((err) => console.warn(err));
}
//Input data Search
function searchApi(coinprice24h) {
    card = createCard();
    priceChangeColorAndArrow(coinprice24h);
    designData(card, coinName);
}


//Create Card
function createCard() {
    const card = document.createElement("div");
    row.append(card);
    card.classList.add('card', 'col-sm-5', 'col-md-4', 'col-lg-3');
    return card;
}
//Card Design
function designData(card, id) {
    updateTime.innerHTML = (id.last_updated).slice(11, 19) + ' GMT+0'
    card.innerHTML = `
               <div class="ms-4"> <span class="rank position-absolute top-0 end-0 ">Rank #${id.market_cap_rank}</span>
                   <div class="align-items-center">
                       <span>
               <img loading="lazy" class="image rounded-pill mb-2" width="32px" height="32px" alt="" src="${id.image}">
           </a>
           <span class="coinName">${id.name}</span>
                       <span class="symbol">(${(id.symbol).toUpperCase()})</span>
                   </div>
                   <div class="card-fiat">
                       <span class="fiat">${currencySign + numberWithCommas(id.current_price)}   </span>
                       <span class="changeColor ${color} ">
                   <i class="fa-solid fa-caret-${arrow} "></i>
                   <span class="change"> ${(id.price_change_percentage_24h).toFixed('2')+'%'}</span>
                       </span>
                   </div>
               </div>
               <hr>
               <div class="d-flex justify-content-around">
               <span class="fiatLow badge rounded-pill bg-danger">${currencySign + numberWithCommas(id.low_24h)}</span>
               <span class="badge bg-warning text-dark">24H</span>
               <span class="fiatHigh badge rounded-pill bg-success">${currencySign + numberWithCommas(id.high_24h)}</span>
           </div>
           <hr>
               <div class="card-body mx-2 ">
                   <ul class="list-group list-group-flush">
                      <li class="list-group-item    ">
                            <div>
                                <div class="fw-bold">ATH</div>
                              </div>
                           <span class="marketCap">${currencySign + numberWithCommas(id.ath)}</span>
                        </li>
                       <li class="list-group-item">
                           <div>
                               <div class="fw-bold">Market Cap</div>
                           </div>
                           <span class="marketCap">${currencySign + numberWithCommas(id.market_cap)}</span>
                       </li>
                       <li class="list-group-item ">
                           <div>
                               <div class="fw-bold">24 Hour Trading Vol</div>
                           </div>
                           <span class="tradingVol24">${currencySign + numberWithCommas(id.total_volume)}</span>
                       </li>
                       <li class="list-group-item ">
                           <div>
                               <div class="fw-bold">Circulating Supply </div>
                           </div>
                           <span class="circulatingSupply">${numberWithCommas(id.circulating_supply)}</span>
                       </li>
                       <li class="list-group-item ">
                           <div>
                               <div class="fw-bold">Total Supply</div>
                           </div>
                           <span class="totalSupply">${id.total_supply}</span>
                       </li>
                       <li class="list-group-item ">
                           <div>
                               <div class="fw-bold">Max Supply</div>
                           </div>
                           <span class="maxSupply">${id.max_supply}</span>
                       </li>
                   </ul>
               </div>
           `;
}




//Binlik Sayı Ayırma(Nokta ve Virgül olarak)
function numberWithCommas(value) {
    var parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
//Price Arrow high and low 
function priceChangeColorAndArrow(e) {
    if (e > 0) {
        color = 'green';
        arrow = 'up';
    } else {
        color = 'red';
        arrow = 'down';
    }
}



//Clear empty Card
function ClearCard() {
    row.innerHTML = '';
}