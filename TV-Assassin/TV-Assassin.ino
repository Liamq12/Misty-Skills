/*
 * For the Adafruit Feather M0 Basic Proto board. This board uses Serial for USB communication,
 * and Serial1 for hardware UART. https://www.arduino.cc/reference/en/language/functions/communication/serial/.
 * 
 * For use with Misty II, or really any device that can output UART.
 * 
 * Created by Liam Homburger https://github.com/Liamq12
  */

#define triggerPin 6
#define triggerMessage "go"

int lastByte;

void setup() {
    //One time setup
    Serial1.begin(9600);
    Serial.begin(9600);
    Serial.println("Arduino is ready!");
    pinMode(triggerPin, OUTPUT);
}

void loop() {
  //Gets serial data if avalible
  String message = "";
  if(Serial1.available() > 0){
    String pmessage = getSerialData();
    message = pmessage.substring(0, pmessage.length()-2);
    Serial.println(message + ":got parsed data");
  }
  //If message from misty is equal, send a quick pulse to activate the TV-B-GONE
  if(message.equals(triggerMessage)){
    Serial.println("Transistor Triggered");
    digitalWrite(triggerPin, HIGH);
    delay(2000);
    digitalWrite(triggerPin, LOW);
  }
    
}
String getSerialData(){
  
String final; 
boolean isDone = false;
while (isDone == false) {
char receivedChar;
if (Serial1.available() > 0) {
        receivedChar = Serial1.read();
        Serial.print("This just in ... ");
        Serial.println(receivedChar);
        final += receivedChar;
        lastByte = 0;
    }else{
      lastByte += 1;
      delay(1);
      //Serial.println(lastByte);
    }
    if(lastByte >= 100){
      isDone = true;
      return final;
    }
  }
}
