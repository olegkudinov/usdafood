let app = (function (window) {
    const button = document.querySelector('#find');
    const input = document.querySelector('#search');
    const resultdiv = document.querySelector('#result');
    const calories = document.querySelector('#bycalories');
    const spinner = document.getElementsByClassName("spinner")[0];
    const btncaption = document.getElementById("btncaption");
    const multiplier = document.querySelector('#multiplier');

    //const _baseUrl = 'https://localhost:44392';
    const _baseUrl = 'https://oktstdevusda.azurewebsites.net';
    let _startUrl = window.location.href;

    let _factor = 1;
    let _lastResult = null;

    spinner.className = 'invisible';

    function buildNutientHtml(data, bycalories) {

        let nutrients = '';
        _lastResult = data;
        data.nutrients.forEach(element => {
            let header = element.nutrient[0] === "*";
            let unitless = element.content.unit === "header";
            let row = '';
            if (header && unitless) {
                row = '<tr><td colspan="3"><strong>' + element.nutrient + '</strong></td></tr>'
            } else if (header) {
                row = '<tr><td><strong>' + element.nutrient + '</strong></td><td><strong>' + element.content.value * _factor + '</strong></td><td><strong>' + element.content.unit + '</strong></td></tr>';
            } else {
                row = '<tr><td><em>' + element.nutrient + '</em></td><td><strong>' + element.content.value * _factor + '</strong></td><td><strong>' + element.content.unit + '</strong></td></tr>';
            }
            nutrients += row;
        });

        let totals = `
        <div><em>Weight:</em><strong> ` + data.weight.value * _factor + ` ` + data.weight.unit + `</strong></div>
        <div><em>Energy:</em><strong> ` + data.energy.value * _factor + ` ` + data.energy.unit + `</strong></div>`;

        if (bycalories) {
            totals = `
        <div><em>Energy:</em><strong> ` + data.energy.value * _factor + ` ` + data.energy.unit + `</strong></div>
        <div><em>Weight:</em><strong> ` + data.weight.value * _factor + ` ` + data.weight.unit + `</strong></div>`;
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
            let id = element.id
            foodHtml += `
                <tr>
                    <td>` + element.name + `</td>
                    <td><button onclick='app.getNutrientsFor("` + id + `")'>Nutrients</button></td>
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

    const foodRequest = new XMLHttpRequest();

    foodRequest.onload = function (obj) {
        btncaption.innerText = "Find";
        spinner.className = 'invisible';
        let data = foodRequest.response;
        if (!data || data === null || data.length === 0) {
            resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
        } else {
            var html = buildFoodHtml(data);
            resultdiv.innerHTML = html;
        }
        console.log(obj)
    }

    foodRequest.onerror = function (obj) {
        btncaption.innerText = "Find";
        spinner.className = 'invisible';
        resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
        console.log(obj)
    }

    const nutrientRequest = new XMLHttpRequest();

    nutrientRequest.onload = function (obj) {
        btncaption.innerText = "Back";
        spinner.className = 'invisible';
        let data = nutrientRequest.response;
        if (!data || data === null) {
            resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
        } else {
            var html = buildNutientHtml(data, calories.checked);
            resultdiv.innerHTML = html;
        }
        console.log(obj)
    }

    nutrientRequest.onerror = function (obj) {
        btncaption.innerHTML = "Back";
        spinner.className = 'invisible';
        resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
        console.log(obj)
    }

    function startRequest(url, push) {
        if (push)
            window.history.pushState({ Url: url }, "search", url);
        if (url == '') {
            window.location = _startUrl;
        }
        else {
            let request = url.startsWith('/api/nutrients/') ? nutrientRequest : foodRequest;
            request.open('GET', _baseUrl + url);
            request.responseType = 'json';
            request.send();
            spinner.className = '';
        }
    }

    window.onpopstate = function (evt) {
        if (evt.state)
            startRequest(evt.state.Url, false);
        else
            startRequest('', false);
    };

    button.addEventListener('click', function () {
        startRequest('/api/foods/' + input.value, true);
    });

    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            button.click();
        }
    });

    multiplier.addEventListener('click', function () {
        if(++_factor > 10)
            _factor = 1;
        multiplier.innerText = "x " + _factor;
        if(_lastResult) {
            var html = buildNutientHtml(_lastResult, calories.checked);
            resultdiv.innerHTML = html;
        }
    });

    calories.addEventListener('click', function () {
        if(_lastResult) {
            var html = buildNutientHtml(_lastResult, calories.checked);
            resultdiv.innerHTML = html;
        }
    });

    _getNutrientsFor = function (id) {
        let command = 'w';
        if (calories.checked)
            command = 'c';
        startRequest('/api/nutrients/' + command + ',' + id, true);
    };

    return {
        getNutrientsFor: _getNutrientsFor,
    }
}(this));