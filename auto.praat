form Test
    comment "example praat --run auto.praat ~/Documents/RocConf/"
    sentence Inputdir ./
    sentence Outputdir ./
endform

writeInfoLine: inputdir$, outputdir$

#list = Create Strings as file list: "list", inputdir$ + "*.wav"
#n = Get number of strings
#for i to n
    #selectObject: list
    #filename$ = Get string: i
fileID = Read from file... 'inputdir$'
    #writeInfoLine: filename$
textgrid = To TextGrid (silences): 100, 0.0, -25, 0.1, 0.1, "silent", "sounding"
Save as text file: inputdir$+".TextGrid"
removeObject: fileID
#endfor
#removeObject: list
