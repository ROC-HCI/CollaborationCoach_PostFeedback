#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .webm Header Correction"
#for file in Data/$session_id*.webm;
#	do ffmpeg -i "$file" -codec:v libvpx -quality good -cpu-used 0 -b:v 500k -qmin 10 -qmax 42 -maxrate 500k -bufsize 1000k -threads 4 -vf scale=-1:480 -codec:a libvorbis -b:a 128k Data/testFixed2_$(basename "${file/.webm}").webm
#done
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" -codec:v copy -codec:a aac Data/testFixed6_$(basename "${file/.webm}").mp4
done
echo "Finish - .webm Header Correction"

echo "Start - .wav Conversion"
for file in Data/testFixed6_$session_id*.mp4;
	do ffmpeg -i "$file" -ar 11025 Data/$(basename "${file/.mp4}").wav
done
echo "Finish - .wav Conversion"

echo "Start - Praat"
for file in Data/testFixed6_$session_id*.wav;
	do ./praat --run auto.praat $file
done
echo "Finish - Praat"

echo "Start - Participation Analysis"
argpath=""
for i in Data/testFixed6_$session_id*.wav.TextGrid;
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
