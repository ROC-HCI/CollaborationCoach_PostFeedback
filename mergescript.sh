ffmpeg
	-i Data/fixed_bd3f7530-89b4-11e6-9414-799760e2546b_vivian_1.webm -i Data/fixed_bd3f7530-89b4-11e6-9414-799760e2546b_ssmumu_1.webm -i Data/fixed_bd3f7530-89b4-11e6-9414-799760e2546b_Ru_1.webm	
	-filter_complex "
		nullsrc=size=640x480 [base];
		[0:v] setpts=PTS-STARTPTS, scale=320x240 [upperleft];
		[1:v] setpts=PTS-STARTPTS, scale=320x240 [upperright];
		[2:v] setpts=PTS-STARTPTS, scale=320x240 [lowerleft];
		[base][upperleft] overlay=shortest=1 [tmp1];
		[tmp1][upperright] overlay=shortest=1:x=320 [tmp2];
		[tmp2][lowerleft] overlay=shortest=1:y=240 [tmp3];
	"
	-c:v libx264 Data/gamesession.webm