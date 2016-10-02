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

echo "Start - .flacc conversion"
for file in Data/fixed_$session_id*.wav;
	do ffmpeg -i "$file" Data/$(basename "${file/.wav}").flac
done
echo "End - .flacc conversion"

echo "Start - Praat"
#./praat --run auto.praat Data/$session_id*
#for file in Data/fixed_$session_id*.wav;
#	do ./praat --run auto.praat $file
#done
echo "Finish - Praat"

echo "Start - Participation Analysis"
#argpath=""
#for i in Data/fixed_$session_id*.wav.TextGrid;
#	do argpath="$argpath $i"
#done

#python fileparser.py $argpath
echo "Finish - Participation Analysis"

echo "Start - average affdex features"
#python AffdexParser $session_id
echo "Finish - average affdex features"

echo "Start - Bluemix Speech Recognition"
for file in Data/fixed_$session_id*.flac;
	do 
		echo "Sending File $file"
		python BluemixSpeech.py $file
	done
echo "Finish - Bluemix Speech Recognition"

echo "Start - Bluemix Tone Analysis"
for file in Data/fixed_$session_id*.flac;
	do python ToneAnalyzer.py $file
done
echo "Finish - Bluemix Tone Analysis"

echo "Session Script Terminated..."

