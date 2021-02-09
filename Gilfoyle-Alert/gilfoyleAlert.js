//For the full experience, use the audio "gilfoyle_alert.mp3"
misty.RegisterTimerEvent("DogePrice", 3000, true);
function _DogePrice() {
    const url = "https://api.cryptonator.com/api/ticker/doge-usd"
    misty.SendExternalRequest("GET", url);
}
function _SendExternalRequest(data) {
    misty.Debug("Before " + data.Result.ResponseObject.Data);
    var json = JSON.parse(data.Result.ResponseObject.Data);
        misty.Debug("After " + json.ticker.price + " price after parse")
        if(json.ticker.price >= 0.03){
            misty.PlayAudio("gilfoyle_alert.mp3");
        }
    }
    