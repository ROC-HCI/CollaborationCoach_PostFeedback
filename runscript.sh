#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .webm Header Correction"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" -c copy -fflags +genpts Data/$(basename "${file/.webm}").webm
done
echo "Finish - .webm Header Correction"

# WORKING
echo "Start - .wav Conversion"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" Data/$(basename "${file/.webm}").wav
done
echo "Finish - .wav Conversion"

# NOT WORKING - License expired
echo "Start - Affdex"
#for file in Data/$session_id*.webm;
#	do $HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l sdk_lnova@u.rochester.edu.license -i $file
#done
echo "Finish - Affdex"

# NOT WORKING - Incorrect directory location - To fix...
echo "Start - Praat"
#./praat --run auto.praat Data/$session_id*
for file in Data/$session_id*.wav;
	do ./praat --run auto.praat $file
done
echo "Finish - Praat"

# WORKING - DB ENABLED
echo "Start - Participation Analysis"
argpath=""
for i in Data/$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

#python fileparser.py $argpath
echo "Finish - Participation Analysis"

echo "Start - AffdexPlayerFocus Merge"
#args=""
#for file in Data/$session_id*.csv;
#	do args=$file(basename "${file/.csv}").json
#done
#echo $args
echo "Finish - AffdexPlayerFocus Merge"

# NOT WORKING - License expired, need move to just tone analysis
echo "Start - BlueMix"
#python ./bluemix_driver.py
echo "Finish - BlueMix"

echo "Session Script Terminated..."

