document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector("#txtSearch").value;
    getCountry(text);

});

function getCountry(country) {
    const request = new XMLHttpRequest();

    request.open('GET', 'https://restcountries.com/v3.1/name/' + country);;
    request.send();

    request.addEventListener('load', () => {
        const data = JSON.parse(request.responseText);

        if(request.status === 404 || data.status === 404 || data.length === 0){
            document.querySelector("#countryDetails").innerHTML = `<p class="text-danger">Country is not found. Please enter a valid country name.</p>`;
            document.querySelector("#neighbors").innerHTML = "";
            return;
        }
        renderCountry(data[0]);


        let countries = data[0].borders.toString();

        console.log(countries);

        const requestNeighbors = new XMLHttpRequest();
        requestNeighbors.open('GET', "https://restcountries.com/v3.1/alpha?codes=" + countries)
        requestNeighbors.send();

        requestNeighbors.addEventListener("load", function () {
            const data = JSON.parse(requestNeighbors.responseText)
            renderNeighbors(data);
            console.log(data)
        })
    });
}


function renderCountry(data) {
    let html = `
    <div class="card-header">
                Search Response
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <img src="${data.flags.png}" alt="" class="img-fluid">
                    </div>
                    <div class="col-8">
                        <h3 class="card-title">${data.name.common}</h3>
                        <hr>
                        <div class="row">
                            <div class="col-4">Population: </div>
                            <div class="col-8">${(data.population / 1000000).toFixed(1)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">formal language: </div>
                            <div class="col-8">${Object.values(data.languages)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Capital: </div>
                            <div class="col-8">${data.capital[0]}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Currencie: </div>
                            <div class="col-8">${Object.values(data.currencies)[0].name} ${Object.values(data.currencies)[0].symbol}</div>
                        </div>
                    </div>
                </div>
            </div>
    `;

    document.querySelector("#countryDetails").innerHTML = html;

}


function renderNeighbors(data) {
    let html = "";
    for(let country of data){
        html += `
        <div class="col-2 mt-2">
            <div class="card">
                <img src="${country.flags.png}" class="card-img-top">
                <div>
                    <h6 class="card-title">${country.name.common}</h6>
                </div>
            </div>
        </div>
        `;

        document.querySelector("#neighbors").innerHTML = html;
    }
}
