let app = (function (window) {
    
    const input = document.querySelector('#search');
    const button = document.querySelector('#find');
    const resultdiv = document.querySelector('#result');
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.className = 'invisible';

    //const _baseUrl = 'https://localhost:44392';
    const _baseUrl = 'https://oktest-dev-app-usda.azurewebsites.net';

    const _homeUrl = window.location.href;

    let _lastResult = null;
    let _mfactor = 1;
    let _byCalories = true;

    const _templates = new Templates(resultdiv);
    
    const _request = new Request({
        rootUrl: _homeUrl,
        baseUrl: _baseUrl,
        onStart: () => spinner.className = '',
        onFinish: (data, error, url) => {
            spinner.className = 'invisible';
            if(error)
                resultdiv.innerHTML = "<div><strong>Something's wrong<strong></div>";
            else if(!data || data === null || data.length === 0)
                resultdiv.innerHTML = "<div><strong>Not Found<strong></div>";
            else if (url.startsWith(_baseUrl + '/api/foods/'))
                _templates.foods(data);
            else {
                _lastResult = data;
                _templates.nutrition(data, _mfactor, _byCalories);
            }
        }
    }); 

    function startRequest(url, history) {
        if (history)
            window.history.pushState({ Url: url }, "search", url);
        if (url == '')
            window.location = _homeUrl;
        else 
            _request.get(_baseUrl + url);
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

    function updateView(){
        if(_lastResult) 
        _templates.nutrition(_lastResult, _mfactor, _byCalories);
    }

    _multiply = function () {
        if(++_mfactor > 10)
            _mfactor = 1;
        updateView();
    };

    _toggleBase = function () {
        _byCalories = !_byCalories;
        updateView();
    };

    _getNutrientsFor = function (id) {
        startRequest('/api/nutrients/' + id, true);
    };

    return {
        getNutrientsFor: _getNutrientsFor,
        multiply: _multiply,
        toggleBase: _toggleBase,
    }
}(this));