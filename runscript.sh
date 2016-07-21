#!/bin/bash

echo "The script starts now"

echo "Start - Affdex"
#$HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i Data/Ru.webm
echo "Finish - Affdex"

echo "Start - .wav Conversion"
for file in Data/*.webm;
	do ffmpeg -i "$file".webm "$file".wav;
done

#echo "Finish - .wav Conversion"

#echo "Start - Praat"

#echo "Finish - Praat"

#echo "Start - BlueMix"

#echo "Finish - BlueMix"
