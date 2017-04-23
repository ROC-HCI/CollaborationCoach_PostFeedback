#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - Header Correction"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" -codec:v copy -codec:a aac Data/$(basename "${file/.webm}").mp4
done
echo "Finish - Header Correction"

echo "Start - .wav Conversion"
for file in Data/$session_id*.mp4;
	do if [[ $file != *"LENOVO"* ]]
	then
		echo "it's h264"
		ffmpeg -i "$file" -ar 11025 Data/fixed_$(basename "${file/.mp4}").wav
	fi
done
for file in Data/$session_id*.webm;
	do if [[ $file == *"LENOVO"* ]]
	then
    	echo "it's vp8"
    	ffmpeg -i "$file" -ar 11025 Data/fixed_$(basename "${file/.webm}").wav
	fi
done
echo "Finish - .wav Conversion"

echo "Start - Praat"
for file in Data/fixed_$session_id*.wav;
	do ./praat --run auto.praat $file
done
echo "Finish - Praat"

echo "Start - Participation Analysis"
argpath=""
for i in Data/fixed_$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

python fileparser.py $argpath
echo "Finish - Participation Analysis"

echo "Start - average affdex features"
python AffdexParser.py $session_id
echo "Finish - average affdex features"

echo "Start - shared affdex features"
python SharedAffdexDetection.py $session_id
echo "Finish - shared affdex features"

echo "Session Script Terminated..."
