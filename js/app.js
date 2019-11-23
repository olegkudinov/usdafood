const app = (function (window) {
    
    const input = document.querySelector('#search');
    const button = document.querySelector('#find');
    const resultdiv = document.querySelector('#result');
    //const voice  = document.querySelector('#voice');
    //const playback = document.querySelector('#playback');
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.className = 'invisible';

    //const _baseUrl = 'https://localhost:44392';
    const _baseUrl = 'https://oktest-dev-app-usda.azurewebsites.net';

    const _homeUrl = window.location.href;

    let _lastResult = null;
    let _mfactor = 1;
    let _measure = 'calories';

    const _formatter = new Formatters(resultdiv);
    
    const _requester = new Request({
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
                _formatter.foods(data);
            else {
                _lastResult = data;
                _formatter.nutrition(data, _mfactor, _measure);
            }
        }
    }); 

    const _startRequest = (url, history) => {
        if (history)
            window.history.pushState({ Url: url }, "search", url);
        if (url == '')
            window.location = _homeUrl;
        else 
            _requester.get(_baseUrl + url);
    };

    const _updateView = () => {
        if(_lastResult) 
        _formatter.nutrition(_lastResult, _mfactor, _measure);
    };

    const _multiply = function () {
        if(++_mfactor > 10)
            _mfactor = 1;
        _updateView();
    };

    const _toggleBase = () => {
        if(_measure === "calories")
            _measure = "grams";
        else if(_measure == "grams")
            _measure = "ounces";
        else if(_measure === "ounces")
            _measure = "calories";
        _updateView();
    };

    const _getNutrientsFor = id => {
        _startRequest('/api/nutrients/' + id, true);
    };

    /*
    const _speech = new Speech({
        recordBtn: voice,
        audio: playback
    });
    _speech.startListen();
    */

   window.onpopstate = function (evt) {
    if (evt.state)
        _startRequest(evt.state.Url, false);
    else
        _startRequest('', false);
    };

    button.addEventListener('click', function () {
        _startRequest('/api/foods/' + input.value, true);
    });

    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            button.click();
        }
    });

    return {
        getNutrientsFor: _getNutrientsFor,
        multiply: _multiply,
        toggleBase: _toggleBase,
    }
}(this));
