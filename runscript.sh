#!/bin/bash

session_id=$1

echo "Session Script Starting for: $session_id"

echo "Start - .webm Header Correction"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" -c copy -fflags +genpts Data/fixed_$(basename "${file/.webm}").webm
done
echo "Finish - .webm Header Correction"

# WORKING
echo "Start - .wav Conversion"
for file in Data/$session_id*.webm;
	do ffmpeg -i "$file" Data/$(basename "${file/.webm}").wav
done
echo "Finish - .wav Conversion"

# WORKING
echo "Start - Affdex"
for file in Data/fixed_$session_id*.webm;
	do $HOME/build/video-demo/./video-demo -d $HOME/affdex-sdk/data -l cuzinniko@gmail.com.license -i $file
done
echo "Finish - Affdex"

# WORKING
echo "Start - Praat"
#./praat --run auto.praat Data/$session_id*
for file in Data/$session_id*.wav;
	do ./praat --run auto.praat $file
done
echo "Finish - Praat"

# WORKING - DB REQUIRED
echo "Start - Participation Analysis"
argpath=""
for i in Data/$session_id*.wav.TextGrid;
	do argpath="$argpath $i"
done

python fileparser.py $argpath
echo "Finish - Participation Analysis"

# WORKING - DB REQUIRED
echo "Start - AffdexPlayerFocus Merge"
args=""
for file in Data/fixed_$session_id*.csv;
	do args=$(basename "${file/.csv}").json
	python AffdexPlayerFocusMerger.py "$file" "Data/$args"
done

echo "Finish - AffdexPlayerFocus Merge"

# NOT WORKING - License expired, need move to just tone analysis
# potential here to boost speech recognition using this service as well
# if we find it necessary.
#echo "Start - BlueMix"
#python ./bluemix_driver.py
#echo "Finish - BlueMix"

echo "Session Script Terminated..."

