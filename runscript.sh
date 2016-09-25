#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .webm Header Correction"
#for file in Data/$session_id*.webm;
#	do ffmpeg -i "$file" -c copy -fflags +genpts Data/fixed_$(basename "${file/.webm}").webm
#done
echo "Finish - .webm Header Correction"

echo "Start - .wav Conversion"
#for file in Data/fixed_$session_id*.webm;
#	do ffmpeg -i "$file" Data/$(basename "${file/.webm}").wav
#done
echo "Finish - .wav Conversion"

#CAN WE USE FFMPEG TO DO FLACC CONVERSION?
# YES WE CAN! THIS IS TO COME

echo "Start - Praat"
#./praat --run auto.praat Data/$session_id*
#for file in Data/fixed_$session_id*.wav;
#	do ./praat --run auto.praat $file
#done
echo "Finish - Praat"

echo "Start - Participation Analysis"
argpath=""
for i in Data/fixed_$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

python fileparser.py $argpath
echo "Finish - Participation Analysis"

#SETUP AVERAGES FOR AFFDEX FEATURES HERE

#RUN BLUEMIX TONE ANALYSIS ON SUBMITTED SPEECH

#POSSIBLE RUN BLUEMIX SPEECHRECOGNITION HERE

echo "Session Script Terminated..."

