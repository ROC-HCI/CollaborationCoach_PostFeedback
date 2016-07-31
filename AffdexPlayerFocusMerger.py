import csv
import json
import sys
import pymongo
from pymongo import MongoClient
import pprint

pp = pprint.PrettyPrinter(indent=2)

client = MongoClient()
database = client['rocconf']
collection = database['affdexmerge']
  
# Opening the CSV & Opening the player focus
f = open(sys.argv[1])
a = open(sys.argv[2])

# get the session key and user for this data
first = sys.argv[1].split('/')
second = first[1].split('_')
third = second[1].split('.')
session_key = second[0]
user_id = third[0]


#Giving the values for the parsed CSV some fieldnames
fieldnames = ("TimeStamp","faceId","InterocularDistance","glasses","gender","dominantEmoji","pitch","yaw","roll","joy","fear","disgust","sadness","anger","suprise","contempt","valence","engagement","smile","InnerBrowRaise","browRaise","browFurrow","noseWrinkle","upperLipRaise","lipCornerDepressor","chinRaise","lipPucker","lipPress","lipSuck","mouthOpen","smirk","eyeClosure","attention","relaxed","smiley","laughing","kissing","dissapointed","rage","smirk","wink","stuckOutTongueWinkingEye","stuckOutTongue","flushed","scream")
reader = csv.DictReader( f, fieldnames)

# Parsing the CSV into JSON
out = json.dumps( [ row for row in reader ], indent = 1)


print "JSON parsed!"

# Saving the JSON
f = open( 'Data/' + session_key + "_" + user_id + 'CSV.json', 'w')
f.write(out)
f.close()

#Reading the newly created JSON for merging with the PlayerFocus JSON
g = open( 'Data/' + session_key + "_" + user_id + 'CSV.json', 'r' )

#Loading the PlayerFocus JSON Content to an array
focus = json.load(a)
#Loading the Affdex content to an array
affdex = json.load(g)

#Creating a counter to increment so we can iterate through the player focus array
count = 0

#Adding the contents from the PlayerFocus array to the Affdex array
for i in range (1,len(focus)):
    affdex[i]['focus'] = focus[count]['focus']
    affdex[i]['timeValue'] = focus[count]['timeValue']
    count+=1
#    print affdex[i]

final_dict = {}
final_dict["session_key"] = session_key
final_dict["user"] = user_id
final_dict["data"] = affdex

#Dumping the contents of the newly adjusted Affdex array into a new array
#final = json.dumps(affdex, indent = 1)

#Creating a new JSON file to store the contents of the final array (the one made right before this comment)
#h = open( 'Final.json', 'w' )

#Writing the contents of the final array to the newly made JSON file
#h.write(final)

pp.pprint(final_dict)

#pp.pprint(collection.insert_one(affdex).inserted_id)
  
print "JSON saved!"


