function Request(configuration) {
    let _onStart = () => { };
    let _onFinish = (data, error, url) => { };

    if(configuration) {
        if(configuration.onStart) {
            _onStart = configuration.onStart;
        }
        if(configuration.onFinish) {
            _onFinish = configuration.onFinish;
        }
    }
    const _request = new XMLHttpRequest();
    
    _request.onload = function (obj) {
        _onFinish(obj.srcElement.response, false, obj.srcElement.responseURL);
        console.log(obj)
    }

    _request.onerror = function (obj) {
        _onFinish(null, true);
        console.log(obj)
    }

    const _get = function(url) {
        _onStart();
        _request.open('GET', url);
        _request.responseType = 'json';
        _request.send();
    };

    return {
        get: _get,
    }
};
