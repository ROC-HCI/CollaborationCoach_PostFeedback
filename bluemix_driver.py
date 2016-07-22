#==================================================================================
# IBM Bluemix Driver for the RocConf Project
#    - Jeffery A. White - July 2016
# SpeechRecognition - Zhang, A. (2015). 
# Speech Recognition (Version 3.1) [Software]. 
# Available from https://github.com/Uberi/speech_recognition#readme.
#
# NOTE: There are dependencies on the above site you need to install to use
# this correctly (required for SpeechRecognition only).
#
# Additionally to get full timestamp information the speech_recognition/__init__.py
# needs to be modified to set timestamps = true in the URL request.
#
#==================================================================================
import os, base64
import json
import pprint
import sys
import speech_recognition as sr

from urllib import urlencode
from urllib2 import Request, urlopen, URLError, HTTPError

class RequestError(Exception): pass

pp = pprint.PrettyPrinter(indent=2)

#==================================================================================
# Access keys for using IBM Bluemix. Generate these through a Bluemix Account
# http://www.ibm.com/cloud-computing/bluemix/
#==================================================================================
IBM_SPEECH_USERNAME = "0f812b9d-e577-4b8a-8bbf-a9b912849c1c"
IBM_SPEECH_PASSWORD = "75lPWzlUvkdH"

IBM_TONE_USERNAME = "459ca71f-efec-4a3c-8313-e07816be33d9"
IBM_TONE_PASSWORD = "yVjLxiSri7As"

#==================================================================================
# Run this on an uncompressed WAV file.
# Returns a JSON data dump from IBM Watson.
#   - Includes timestamps, words, and confidence measurements.
#==================================================================================
def process_speech_ibm(raw_filepath):
    basepath = os.path.dirname(__file__)
    filepath = os.path.abspath(os.path.join(basepath, raw_filepath))

    r = sr.Recognizer()
    with sr.WavFile(filepath) as source:
        audio = r.record(source) 

    try:
        response = r.recognize_ibm(audio, username=IBM_SPEECH_USERNAME, password=IBM_SPEECH_PASSWORD, show_all=True)
        return response
    except sr.UnknownValueError:
        print("IBM Speech to Text could not understand audio")
        return "ERR"
    except sr.RequestError as e:
        print("Could not request results from IBM Speech to Text service; {0}".format(e))
        return "ERR"
    
#----------------------------------------------------------------------------------    
def generate_ibm_simple_transcript(input):
    transcript = ""
    
    json_data = json.loads(input)
    
    for e in json_data:
        data = e['alternatives'][0]
        transcript += data['transcript']
        
    return transcript
        
    
        
#==================================================================================
# Run this on a text based transcript to obtain tone analysis
# Returns a JSON data dump from IBM Watson.
#==================================================================================
def process_tone(transcript_text):
    url = "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?{0}" . format(urlencode({
            "version": "2016-05-19",
            "text": transcript_text
        }))
        
    request = Request(url, headers = {"Content-Type": "application/json"})
        
    if hasattr("", "encode"):
        authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD).encode("utf-8")).decode("utf-8")
    else:
        authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD))
    
    request.add_header("Authorization", "Basic {0}" . format(authorization_value))
    
    try:
        response = urlopen(request)
    except HTTPError as e:
        raise RequestError("tone analysis request failed: {0}".format(getattr(e, "reason", "status {0}".format(e.code)))) # use getattr to be compatible with Python 2.6
    except URLError as e:
        raise RequestError("tone analysis connection failed: {0}".format(e.reason))
        
    response_text = response.read().decode("utf-8")
    result = json.loads(response_text)
    return result

#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
    process_speech_ibm("Data/Luis.wav")
    print "Script terminated"
