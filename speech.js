function Speech(configuration) {
  
  const _configuration = configuration;


  let _init = function() 
  {
    if (!navigator.mediaDevices.getUserMedia)
      return;
    
    const constraints = { audio: true };
    
    let _chunks = [];
    
    const onSuccess = function(stream) {
    
      let recorder = new MediaRecorder(stream);
    
      _configuration.recordBtn.onclick = function() {
        if(recorder.state === 'recording') 
          recorder.stop();
        else 
          recorder.start();
      };
    
      recorder.ondataavailable = function(e) {
        _chunks.push(e.data);
      };
          
      recorder.onstop = function (e) {
        let blob = new Blob(_chunks, { 'type' : 'audio/wav; codecs=pcm' });
        _chunks = [];
        let audioURL = window.URL.createObjectURL(blob);
        _configuration.audio.src = audioURL;
      };
    };
      
    let onError = function(err) {
      console.log('The following error occured: ' + err);
    };
      
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
    
  return {
    startListen: _init,
  };
}
