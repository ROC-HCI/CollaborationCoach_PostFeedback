#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .wav Conversion"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" Data/$(basename "${file/.webm}").wav
done
echo "Finish - .wav Conversion"

echo "Start - Affdex"
#$HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i Data/Ru.webm
echo "Finish - Affdex"

echo "Start - Praat"
#./praat --run auto.praat Data/$session_id*

echo "Start - Participation Analysis"
argpath=""
for i in Data/$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

python fileparser.py $argpath
echo "Finish - Participation Analysis"

echo "Start - BlueMix"
#python ./bluemix_driver.py
echo "Finish - BlueMix"

echo "Session Script Terminated..."

