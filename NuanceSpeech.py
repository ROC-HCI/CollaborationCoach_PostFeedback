#==================================================================================
# IBM Bluemix Speech Recognition for the RocConf Project
#    - Jeffery A. White - September 2016
#
# Based upon the SpeechRecognition Library
# SpeechRecognition - Zhang, A. (2015). 
# Speech Recognition (Version 3.1) [Software]. 
# Available from https://github.com/Uberi/speech_recognition#readme.
#
# Modified here to take .flac as input since we couldn't get the 
# flac encoder in that library to work. Uses FFMPEG converted .flac files.
#
# Usage - BluemixSpeech.py {Filename}
#==================================================================================
import pymongo
from pymongo import MongoClient
import pprint
import sys
import os, base64, requests
import json

from urllib import urlencode
from urllib2 import Request, urlopen, URLError, HTTPError

class RequestError(Exception): pass

client = MongoClient()
database = client['rocconf']
transcript_collection = database['transcript_bluemix']
raw_data_collection = database['speechrawdata_bluemix']

session_key = ""
user_id = ""

pp = pprint.PrettyPrinter(indent=2)

#==================================================================================
# Access keys for using Nuance.
#==================================================================================
NUANCE_URL = "dictation.nuancemobility.net"
NUANCE_ENDPOINT = "/NMDPAsrCmdServlet/dictation"
NUANCE_APPID = "NMDPTRIAL_jwhite637_gmail_com20161009231933"
NUANCE_APPKEY = "811afaaf29e1ce63dd9c591634233a2a3ca55cdbb1e6a1659d00b180cb93394dad33fcd615ca39f26792089bb643c5f2e821ce9a086fffa56fb0253a435e87f0"
NUANCE_REQUESTORID = "RocConf"

#==================================================================================
# Send the .wav data to Nuance
#==================================================================================
def nuance_call(filename):
	language = "en-US"

	basepath = os.path.dirname(__file__)
	filepath = os.path.abspath(os.path.join(basepath,filename))
	
	analyze_function = read_wav_file_in_chunks(filepath)
	
	hdrs = {
		u"Content-Type": u"audio/x-wav;codec=pcm;bit=16;rate=8000",
		u"Accept-Language": u"en_US",
		u"Transfer-Encoding": u"chunked", 
		u"Accept": u"text/plain",
		u"Accept-Topic": u"Dictation"
	}
		
	url = ret = "%s%s?appId=%s&appKey=%s&id=%s" % (NUANCE_URL, NUANCE_ENDPOINT, NUANCE_APPID, NUANCE_APPKEY, NUANCE_REQUESTORID)

	res = requests.post(url, data=analyze_function, headers=hdrs)
	
	
	pp.pprint(res)
	
	#result = json.loads(response_text)
	
	# Dump to MongoDB for later analysis!
	#final_dict = {}
	#final_dict['session_key'] = session_key
	#final_dict['user'] = user_id
	#final_dict['data'] = result
	
	#raw_data_collection.insert_one(final_dict).inserted_id
	
	#return result
	
def read_wav_file_in_chunks(filepath):
	file_to_play = wave.open(filepath, 'r')
	total_size = os.path.getsize(filepath) - 44 # 44 = wave header size
	print "  Audio File          %s" % filepath
	data = file_to_play.readframes(2048)
	total_chunks = 0
	while data != '':
		total_chunks += len(data)
		stdout.write("\r  Bytes Sent          %d/%d \t%d%% " % (total_chunks,total_size,100*total_chunks/total_size))
		stdout.flush()
		sleep(0.05)
		yield data
		data = file_to_play.readframes(2048)
	stdout.write("\n\n")

#================================================================================================
# Processing a text transcript from bluemix results data
#================================================================================================
def process_transcript(raw_data):
	result = raw_data

	pp.pprint(raw_data)
	
	transcription = []
	for utterance in result["results"]:
		if "alternatives" not in utterance: raise UnknownValueError()
		for hypothesis in utterance["alternatives"]:
			if "transcript" in hypothesis:
				transcription.append(hypothesis["transcript"])
				
	transcript = ". ".join(transcription)

	# Dump transcript into MongoDB for display and later analysis!
	final_dict = {}
	final_dict['session_key'] = session_key
	final_dict['user'] = user_id
	final_dict['transcript'] = transcript
	
	transcript_collection.insert_one(final_dict).inserted_id
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	#final = sys.argv[1].split('_')
	#session_key = final[1]
	#user_id = final[2]
	
	raw_data = bluemix_call(sys.argv[1])
	#process_transcript(raw_data)
