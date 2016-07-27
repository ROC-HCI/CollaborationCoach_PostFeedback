#!/bin/bash

session_id=$1

echo "Session Script Starting for "+$session_id

echo "Start - Affdex"
#$HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i Data/Ru.webm
echo "Finish - Affdex"

echo "Start - Praat"
#./praat --run auto.praat Data/

py_args=""
for i in Data/session_id_*.wav.TextGrid;
	do $py_args+=" "+i;
done

echo $py_args;
#python fileparser.py Data/Ru.wav.TextGrid Data/Luis.wav.TextGrid Data/Yichen.wav.TextGrid
echo "Finish - Praat"

echo "Start - BlueMix"
#python ./bluemix_driver.py
echo "Finish - BlueMix"

echo "Session Script Terminated..."
done
