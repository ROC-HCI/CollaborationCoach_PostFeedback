var json = 
[
    {"title": "intro_1","tags": "","body": "Hi, I'm your personal feedback assistant!\\nI've analyzed your performance of the previous session. Let's walk you through it.\n[[Sounds great!|participation_1]]","position": {"x": 740,"y": 378},"colorID": 0},
    
    {"title": "participation_1","tags": "","body": "First, let's move to participation\n[[Okay1|participation_2]]","position": {"x": 319,"y": 328},"colorID": 0},
    {"title": "participation_2","tags": "1","body": "\n[[go to|participation_3]]","position": {"x": 676,"y": 209},"colorID": 1},
    {"title": "participation_3","tags": "","body": "Wanna know more about it?\n[[Sure|participation_4]]\n[[No Thanks|overlap_1]]","position": {"x": 674,"y": 479},"colorID": 1},
    {"title": "participation_4","tags": "","body": "Extra info link for participation\n[[Got it!|overlap_1]]","position": {"x": 1090,"y": 123},"colorID": 1},
   
    {"title": "overlap_1","tags": "1","body": "\n[[next|overlap_2]]","position": {"x": 294,"y": 316},"colorID": 0},
    {"title": "overlap_2","tags": "","body": "overlaps aren't always a bad thing, they can add to a conversation. But they can also take away from one. Just something to keep in mind.\n[[Got it|finish_1]]","position": {"x": 617,"y": 159},"colorID": 0},
    {"title": "finish_1","tags": "","body": "This is all, good job expressing!\\nHope you have a great team discussion next time.\n[[Thanks, bye!|]]","position": {"x": 1001,"y": 154},"colorID": 0 }
]