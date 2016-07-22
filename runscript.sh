#!/bin/bash
echo "The script starts now"

echo "Start - Affdex"
#$HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i Data/Ru.webm
echo "Finish - Affdex"

echo "Start - .wav Conversion"

#for file in Data/*.webm;
#	do ffmpeg -i "$file" Data/$(basename "${file/.webm}").wav;
	
echo "Finish - .wav Conversion"

echo "Start - Praat"
#./praat --run auto.praat Data/
#python fileparser.py Data/Ru.wav.TextGrid Data/Luis.wav.TextGrid Data/Yichen.wav.TextGrid
echo "Finish - Praat"

echo "Start - BlueMix"
python ./bluemix_driver.py
echo "Finish - BlueMix"
done
