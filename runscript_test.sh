#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .webm Header Correction"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" -codec:v libvpx Data/fixedTST6_$(basename "${file/.webm}").webm
done
echo "Finish - .webm Header Correction"

echo "Start - .wav Conversion"
for file in Data/fixedTST6_$session_id*.webm;
	do ffmpeg -i "$file" Data/fixedTST6_$(basename "${file/.webm}").wav
done
echo "Finish - .wav Conversion"

echo "Start - Praat"
for file in Data/fixedTST6_$session_id*.wav;
	do ./praat --run auto.praat $file
done
echo "Finish - Praat"

echo "Start - Participation Analysis"
argpath=""
for i in Data/fixedTST6_$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

#python fileparser.py $argpath
#echo "Finish - Participation Analysis"

#echo "Start - average affdex features"
#python AffdexParser.py $session_id
#echo "Finish - average affdex features"

#echo "Start - shared affdex features"
#python SharedAffdexDetection.py $session_id
#echo "Finish - shared affdex features"

echo "Session Script Terminated..."

