import sys
import re
import itertools
import functools

class Item(object):
    xmin = ""
    xmax = ""
    intervals = []
    
class Interval(object):
    index = 0
    xmin = 0
    xmax = 0
    text = ""

def make_item(size,xmin,xmax):
    item = Item()
    item.xmin = xmin
    item.xmax = xmax
    item.intervals = [size]
    return item

# def make_interval(index,xmin,xmax,text):
#     interval = Interval()
#     interval.index = index
#     interval.xmin = xmin
#     interval.xmax = xmax
#     interval.text = text
#     return interval

def make_interval(index,xmin,xmax,text,name):
    interval = Interval()
    interval.index = index
    interval.xmin = xmin
    interval.xmax = xmax
    interval.text = text
    interval.name = name
    return interval

def add_interval(item, interval):
    item.intervals[interval.index] = interval

def isfloat(value):
    try: 
        float(value)
        return True
    except ValueError:
        return False

def extractMin(inputfile):
    match = re.search(r'\s+xmin = (\d+\.?\d*)', inputfile)
    if(match): return match.group(1)

def extractMax(inputfile):
    match = re.search(r'\s+xmax = (\d+\.?\d*)', inputfile)
    if(match): return match.group(1)

def isSound(str):
    return re.search(r'sounding',str)    

def readFile(file):
    inputfile = open(file)
    # size = sum(1 for line in inputfile)
    count = 0
    size = 0
    items = [] # a list of item object 
    intervals = []
    sounds = []
    for line in inputfile:
        if count<3: next(inputfile)
        elif count==3: size = int(filter(str.isdigit, line)) 
        else: 
            # print line
            match = re.search(r'\s+item \[(\d+)\]', line)
            match_interval = re.search(r'\s+intervals \[(\d+)\]', line)

            if(match_interval):
                xmin = extractMin(next(inputfile))
                xmax = extractMax(next(inputfile))
                text = re.search(r'\s+text = (.+)',next(inputfile))
                name = file.split('.')[0]
                interval = make_interval(int(match_interval.group(1)),xmin,xmax,text.group(1),name)
                intervals.insert(int(match_interval.group(1)),interval)
        count+=1
    
    for interval in intervals:
        if(isSound(interval.text)):
            sounds.append(interval)
    # print len(sounds)
    return sounds

def overlap(a,b):
    # interval a min, max, interval b min, max
    return a.xmin <= b.xmax and b.xmin <= a.xmax

def sameSegment(max,min):
    return max == min

def compare(item1, item2):
    if float(item1.xmin)<float(item2.xmin): return -1
    elif float(item1.xmin)>float(item2.xmin): return 1
    else: return 0 

def length(a):
    return float(a.xmax)-float(a.xmin)

def adds(sounds):
    total = 0
    for s in sounds:
        total+=length(s)
    return total 

print 'Argument', str(sys.argv)
files = []
dict = {}
counter = 0 
overlapcount = 0
user = readFile(sys.argv[1])[0].name
print 'user: ', user
dict['interrupted'] = 0
dict['interrupt'] = 0

for count in range(1,len(sys.argv)):
    for count2 in range(count+1,len(sys.argv)):
        #merge intervals
        files.append(readFile(sys.argv[count]))
        files.append(readFile(sys.argv[count2]))
        #initiate turntakingkeys
        dict[readFile(sys.argv[count])[0].name+readFile(sys.argv[count2])[0].name] = 0
        dict[readFile(sys.argv[count2])[0].name+readFile(sys.argv[count])[0].name] = 0
        dict[readFile(sys.argv[count])[0].name+readFile(sys.argv[count])[0].name] = None
        dict[readFile(sys.argv[count2])[0].name+readFile(sys.argv[count2])[0].name] = None
        #total sounding duration
        dict[readFile(sys.argv[count])[0].name] = adds(readFile(sys.argv[count]))
        dict[readFile(sys.argv[count2])[0].name] =  adds(readFile(sys.argv[count2]))

        #checking for overlap by comparing intervals in each audio
        for a in readFile(sys.argv[count]):
            for b in readFile(sys.argv[count2]):
                if(float(a.xmin)>float(b.xmax)): continue #uncomparable
                elif(float(b.xmin)>float(a.xmax)): continue #uncomparable
                
                if(overlap(a,b)):
                    # print a.name,a.xmin, a.xmax, b.name,b.xmin, b.xmax 
                    if(a.xmin>b.xmin and user==a.name): 
                        dict['interrupting'] += 1   
                    elif(b.xmin>=a.xmin and user==a.name):
                        dict['interrupted'] += 1
                    else:
                        dict['interrupt'] += 1 
                        
                    overlapcount+=1

arr3 = []
flag = []

for afile in files:
    for a in afile:
        arr3.append(a)

arr3.sort(cmp=compare)
# # initial flagged interval
flag.append(arr3[0])
# print 'turn', flag[0].name, flag[0].xmin, flag[0].xmax, '*'
for a in  arr3:
    prevname = flag[0].name
    if(float(a.xmax) <= float(flag[0].xmax) and float(a.xmin)>=float(flag[0].xmin)): 
        continue
    else: 
        flag[0] = a
        # print 'turn', flag[0].name, flag[0].xmin, flag[0].xmax
        if(dict[prevname+flag[0].name]!=None):
            dict[prevname+flag[0].name] +=1
            
for key in sorted(dict,key=len):
    if(dict[key]!=None):
        print key, dict[key]   



   
