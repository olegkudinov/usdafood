const button = document.querySelector('#find');
const input = document.querySelector('#search');
const resultdiv = document.querySelector('#result');
const calories = document.querySelector('#bycalories');
const spinner = document.getElementsByClassName("spinner")[0];
const _baseUrl = 'https://localhost:44392';
//let _baseUrl = 'https://oktstdevusda.azurewebsites.net';

spinner.className = 'invisible';

function buildNutientHtml(data, bycalories) {

    let nutrients = '';
    data.nutrients.forEach(element => {
        let header = element.nutrient[0] === "*";
        let unitless = element.content.unit === "header";
        let row = '';
        if (header && unitless) {
            row = '<tr><td colspan="3"><strong>' + element.nutrient + '</strong></td></tr>'
        } else if (header) {
            row = '<tr><td><strong>' + element.nutrient + '</strong></td><td><strong>' + element.content.value + '</strong></td><td><strong>' + element.content.unit + '</strong></td></tr>';
        } else {
            row = '<tr><td><em>' + element.nutrient + '</em></td><td><strong>' + element.content.value + '</strong></td><td><strong>' + element.content.unit + '</strong></td></tr>';
        }
        nutrients += row;
    });

    let totals = `
        <div><em>Weight:</em><strong> ` + data.weight.value + ` ` + data.weight.unit + `</strong></div>
        <div><em>Energy:</em><strong> ` + data.energy.value + ` ` + data.energy.unit + `</strong></div>`;
    
    if(bycalories) {
        totals = `
        <div><em>Energy:</em><strong> ` + data.energy.value + ` ` + data.energy.unit + `</strong></div>
        div><em>Weight:</em><strong> ` + data.weight.value + ` ` + data.weight.unit + `</strong></div>`;
    }

    let result = `
        <div><strong>` + data.foodName + `</strong></div>` 
        + totals + `
        <table>
            <thead>
                <th>Nutrition</th>
                <th>Content</th>
                <th>Unit</th>
            </thead>
            <tbody>` +
            nutrients + `
            </tbody>
        </table>`;
    return result;
}

function buildFoodHtml(data) {
    let foodHtml = '';
    data.forEach(element => {
        foodHtml += `
                <tr>
                    <td>` + element.name + `</td>
                    <td><button onclick='getNutrientsFor(` + element.id + `)'>Nutrients</button></td>
                </tr>`;
    });
    let result = `
        <table>
            <thead>
                <th></th>
                <th></th>
            </thead>
            <tbody>` +
        foodHtml + `
            </tbody>
        </table>`;
    return result;
}

const request = new XMLHttpRequest();

request.onload = function (obj) {
    spinner.className = 'invisible';
    let data = request.response;
    if (!data || data === null || data.length === 0) {
        resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
    } else {
        var html = buildFoodHtml(data);
        resultdiv.innerHTML = html;
    }
    console.log(obj)
}

request.onerror = function (obj) {
    spinner.className = 'invisible';
    resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
    console.log(obj)
}

const request2 = new XMLHttpRequest();

request2.onload = function (obj) {
    spinner.className = 'invisible';
    let data = request2.response;
    if (!data || data === null) {
        resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
    } else {
        var html = buildNutientHtml(data);
        resultdiv.innerHTML = html;
    }
    console.log(obj)
}

request2.onerror = function (obj) {
    spinner.className = 'invisible';
    resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
    console.log(obj)
}

button.addEventListener('click', function () {
    let requestURL = _baseUrl + '/api/foods/' + input.value;;
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    spinner.className = '';
});

input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        button.click();
    }
});

function getNutrientsFor(id) {
    let command = 'w';
    if (calories.checked)
        command = 'c';
    let requestURL = _baseUrl + '/api/nutrients/' + command + ',' + id;
    request2.open('GET', requestURL);
    request2.responseType = 'json';
    request2.send();
    spinner.className = '';
}