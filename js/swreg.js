if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('sw is registered', reg))
        .catch(err => console.log('sw registration failed', err));
}

// installation
let _prompter = null;
const installButton = document.querySelector("#install");

async function install(evt) {
    evt.preventDefault();
    installButton.classList.add('invisible');
    if(_prompter !== null) {
        _prompter.prompt();
        _prompter.userChoice.then(choice => {
            console.log('installation - user choice', choice);
            if(choice !== 'accepted')
                installButton.classList.remove('invisible');
        }); 
    }
    _prompter = null;
}

installButton.addEventListener('click', install);

window.addEventListener('beforeinstallprompt', evt => {
    evt.preventDefault();
    installButton.classList.remove('invisible');
    _prompter = evt;
});
