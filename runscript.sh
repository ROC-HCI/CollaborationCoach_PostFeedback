#!/bin/bash

session_id=$1

echo "Session Script Starting for:"
echo $session_id

echo "Start - Affdex"
#$HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i Data/Ru.webm
echo "Finish - Affdex"

echo "Start - Praat"
#./praat --run auto.praat Data/

argpath=""
for i in Data/$session_id*.wav.TextGrid;
	do $argpath+=$i;
done

echo $argpath

#python fileparser.py $session_id
echo "Finish - Praat"

echo "Start - BlueMix"
#python ./bluemix_driver.py
echo "Finish - BlueMix"

echo "Session Script Terminated..."

