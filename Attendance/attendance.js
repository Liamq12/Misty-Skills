//Based on the sample code from https://github.com/MistyCommunity/JavaScript-SDK

//Pre-Configure Misty. Debounce for face detection, I may have been using the built-in debounce wrong, but I was unable to make it work. 
misty.Debug("Attendance Starting");
misty.Set("debounce", false)
//Register Event and set Misty to base state.
_timeoutToNormal();
registerFaceDetection();
misty.StartFaceDetection();

//Registers Face Detection
function registerFaceDetection() {

    misty.AddPropertyTest("FaceDetect", "Label", "exists", "", "string");

    if(misty.Get("debounce") === false){
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 10000, true);
    }
}

//Callback function for face detection. 
function _FaceDetect(data) {
    misty.Set("debounce", true)
    misty.Debug(JSON.stringify(data));
    var face = data.PropertyTestResults[0].PropertyValue

    //Having issues with facial recognition. For now, attendance tracker activates when a face is detected. On my list is to add an NFC arm for authorization. 
    //if(face === "Liam"){
    //Let user know face detected.
    misty.PlayAudio("s_SystemSuccess.wav", 10);
    misty.ChangeLED(148, 0, 211);
    misty.DisplayImage("e_Joy.jpg");
    misty.MoveArmDegrees("both", -80, 100);

    //Record audio of user for 7 seconds.
    misty.StartRecordingAudio("attendance.mp3");
    misty.Pause(7000);
    misty.StopRecordingAudio();
    //}else{
        //misty.Debug("NO")
        //misty.Pause(2000);
    //}

    //Reset Misty to default position and change debounce.
    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
    //registerFaceDetection();
    misty.Set("debounce", false)
}

//Resting Position
function _timeoutToNormal() {
    misty.Pause(100);
    misty.MoveArmDegrees("both", 70, 100); // Lowers arms
    misty.ChangeLED(0, 255, 0); // Changes LED to green
    misty.DisplayImage("e_DefaultContent.jpg"); // Show default eyes
}