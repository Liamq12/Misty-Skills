import requests 
import json
import time
import pathlib
import os
import enum
import shutil

from os import path
from pydub import AudioSegment
from compare_mp3 import compare

"""

Make sure to first create 3 files, and put their paths in the temp variables. Ensure to use the propper file extention. 
IBM offers 500 minutes/month for free using their STT service with no card required, the main downside being no option for Base64 input, only mp3, wav, and a few other formats.
Written by Liam Homburger https://github.com/Liamq12
"""

IBMurl = "" #Your IBM url
IBMauth = "" #Your IBM authorization token
MISTYip = "" #Your Misty IP Address
AIOkey = '' #Your Adafruit IO key
AIOfeed = '' #Your AIO feed name
AIOusername = '' #Your AIO username

tempSave = '' #Full path to .wav file
tempHold = '' #Full path to .mp3 file
tempMain = '' #Full path to .mp3 file

def CallIBM(filePath):
    #Opens audio file 
    mp3 = open(filePath, "rb")
    #Sends audio file to IBM Speech to Text
    response = requests.post(IBMurl, auth=('apikey', IBMauth), data=mp3)
    print(response.text)
    d = json.loads(response.text)

    #Attempt to get results. If no results (empty audio file/unrecognizible speech) return "No Data"
    try:
        return d["results"][0]["alternatives"][0]["transcript"]
    except:
        return "No Data"

def CallMistyAudio(fileName):
    debounce = False
    while debounce == False:

        #Get audio file from Misty. Saved as "attendance.wav" by js skill
        MistyGetAudio = 'http://' + MISTYip + '/api/audio?FileName=' + fileName
        r = requests.get(MistyGetAudio)

        #Change saved mp3 to new mp3 from Misty
        with open(tempSave, 'wb') as f:
            f.write(r.content)
            print("Wrote")

            #Convert from wav to mp3. Exeption handling for invalid wav files (Misty sends a void wav when its being recorded to)
            with open(tempMain) as g:
                src = tempSave
                dst = tempMain
                try:
                    sound = AudioSegment.from_file(src)
                    sound.export(dst, format='mp3')
                    debounce = True
                except:
                    print("Could not process, trying again")
                    time.sleep(1)

    #If the new mp3 and the old mp3 are not the same file, get transcription from IBM and write content to adafruit IO.
    if str(compare(tempMain, tempHold)) != "Result.SAME_FILE":
        print("Diff Files, sending to IBM")
        IBM = str(CallIBM(tempMain))
        print(IBM)
        session = requests.session()
        payload = {'value': IBM}
        session.post("https://io.adafruit.com/api/v2/" + AIOusername + "/feeds/" + AIOfeed + "/data?x-aio-key=" + AIOkey + "&value=43", data = payload)

    #Chnage holdover mp3 to current mp3. 
    src = tempMain
    dst = tempHold

    shutil.copyfile(src, dst)

    audioFile = pathlib.Path(tempMain)
    print(audioFile.stat())

CallMistyAudio('attendance.wav')

while 1 == 1:

    #Every 5 seconds, check if attendance.wav was updated and if so get transcription and write to adafruit IO. 
    time.sleep(5)
    print("CYCLE------------------------------------CYCLE")
    CallMistyAudio('attendance.wav')

