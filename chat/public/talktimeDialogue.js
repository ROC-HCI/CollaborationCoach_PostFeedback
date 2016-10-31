var json = 
[
    {
    	"title": "intro_1",
    	"tags": "",
    	"body": "Hi, I'm your personal feedback assistant!\\nI've analyzed your performance of the previous session. Let's walk you through it.\n[[Sounds great!|participation_1]]",
    	"position": {"x": 740,"y": 378},"colorID": 0
    },
    {
    	"title": "participation_1",
    	"tags": "",
    	"body": "First, let's move to participation\n[[Okay1|participation_2]]",
    	"position": {"x": 319,"y": 328},"colorID": 0
    },
    {
    	"title": "participation_2",
    	"tags": "1",
    	"body": "\n[[go to|participation_3]]",
    	"position": {"x": 676,"y": 209},"colorID": 1
    },
    {
    	"title": "participation_3",
    	"tags": "",
    	"body": "Wanna know more about it?\n[[Sure|participation_4]]\n[[No Thanks|overlap_1]]",
    	"position": {"x": 674,"y": 479},"colorID": 1},
    {
    	"title": "participation_4",
    	"tags": "",
    	"body": "Extra info link for participation\\n\n[[Got it!|overlap_1]]",
    	"position": {"x": 962,"y": 58},"colorID": 0},
    {
		"title": "overlap_1",
		"tags": "",
		"body": "Now moving onto overlaps.\\nOn average you overlapped with others for ______ seconds and about ___ times [[what's this mean?|overlap_2]]",
		"position": {
			"x": -47,
			"y": 140
		},
		"colorID": 0
	},
	{
		"title": "overlap_2",
		"tags": "",
		"body": "Overlaps are when you are speaking at the same time as another person. \\n They can add or take away from a conversation. Just something to keep in mind.[[Good to know|turntaking_1]] [[Explain more|overlap_3]]",
		"position": {
			"x": 179,
			"y": 141
		},
		"colorID": 0
	},
	{
		"title": "turntaking_1",
		"tags": "",
		"body": "While we're on overlaps, they have a lot to do with turn-taking. They can help decide who speaks next.\n [[Interesting|turntaking_2]]",
		"position": {
			"x": -36,
			"y": 395
		},
		"colorID": 0
	},
	{
		"title": "overlap_3",
		"tags": "",
		"body": "Overlaps can sometimes be called interruptions, when you break someone off before they are done.\\nBut they are also good for showing that you are engaged in the conversation.[[Cool|turntaking_1]]",
		"position": {
			"x": 393,
			"y": 138
		},
		"colorID": 0
	},
	{
		"title": "turntaking_2",
		"tags": "turntaking_graph",
		"body": "[[neutral|turntaking_3]][[good|turntaking_4]]",
		"position": {
			"x": 191,
			"y": 399
		},
		"colorID": 0
	},
	{
		"title": "turntaking_3",
		"tags": "",
		"body": "You spoke after ____ the most and ___ the least. [[Okay|finish_1]]",
		"position": {
			"x": 636,
			"y": 413
		},
		"colorID": 0
	},
	{
		"title": "turntaking_4",
		"tags": "",
		"body": "You spoke after everyone about equally. Looks like it was an involved conversation [[Yup!|finish_1]]",
		"position": {
			"x": 643,
			"y": 173
		},
		"colorID": 0
	},
	{"title": "finish_1","tags": "","body": "This is all, good job expressing!\\nHope you have a great team discussion next time.\n[[Thanks, bye!|]]","position": {"x": 1001,"y": 154},"colorID": 0 }
]
