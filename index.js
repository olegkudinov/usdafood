(function () {
    const button = document.querySelector('#find');
    const input = document.querySelector('#search');
    const resultdiv = document.querySelector('#result');
    const calories = document.querySelector('#bycalories');
    const spinner = document.getElementById("spinner");
    spinner.style.display = 'none';

    function buildHtml(data) {

        let nutrients = '';
        data.nutrients.forEach(element => {
            nutrients += '<div><span class="nutrient">' + element.nutrient + ': </span><strong>' + element.content.value + ' ' + element.content.unit + '</strong></div>';
        });

        let result =
            '<div>' +
            "<div><strong>" + data.foodName + "</strong></div>" +
            "<div><em>Weight:</em><strong> " + data.weight.value + ' ' + data.weight.unit + "</strong></div>" +
            "<div><em>Energy:</em><strong> "  + data.energy.value + ' ' + data.energy.unit + "</strong></div>" +
            "<p>" + nutrients + "</p>";
            '</div>';
        return result;
    }

    const request = new XMLHttpRequest();
    request.onload = function (obj) {
        spinner.style.display = 'none';
        var data = request.response;
        if(!data || data === null) {
            resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
        } else {
            var html = buildHtml(data);
            resultdiv.innerHTML = html;
        }
        console.log(obj)
    }

    request.onerror = function (obj) {
        spinner.style.display = 'none';
        resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
        console.log(obj)
    }

    button.addEventListener('click', function () {
        let command = 'w';
        if (calories.checked)
            command = 'c';
        let search = command + ',' + input.value;

        let requestURL = 'https://oktstdevusda.azurewebsites.net/api/nutrients/' + search;
        //let requestURL = 'https://localhost:44392/api/nutrients/' + search;
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        spinner.style.display = 'block';
    });

    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            button.click();
        }
    });
})();