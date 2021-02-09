//This is only because I could not get the built in TTS to work right, however I saw a patch on the misty website so this method of tts may not be needed anymore. 
misty.RegisterTimerEvent("TTS", 3000, true);
misty.Set("lastValue", "hobbes");
function _TTS() {
    misty.Debug(misty.Get("lastValue") + " is the last value");
    const url = "https://io.adafruit.com/api/v2/{YOUR AIO USERNAME}/feeds/{YOUR FEED NAME}/data?x-aio-key={YOUR AIO KEY}"
    misty.SendExternalRequest("GET", url);
}
function _SendExternalRequest(data) {
    //misty.Debug(data.Result.ResponseObject.Data);
    var json = JSON.parse(data.Result.ResponseObject.Data);
    misty.Debug(json[0].value + " TTSprev " + misty.Get("lastValue"));
    if(json[0].value !== misty.Get("lastValue")){
        var content = json[0].value
        const url = "http://api.voicerss.org/?key={YOUR VOICERSS KEY}&hl=en-us&src=" + content
        misty.SendExternalRequest("GET", url, null, null, "{}", true, true, "downloadAudio.wav");
        misty.Set("lastValue", json[0].value);
        misty.Debug(lastValue);
    }
        
    }
    