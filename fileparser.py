import sys
import re
import itertools

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

def printinterval(a):
    print 'min:', a.xmin, 'max: ', a.xmax

print 'Argument', str(sys.argv)
arr1 = []
arr2 = []
merge = []
dict = {}
counter = 0 
overlapcount = 0

for count in range(1,len(sys.argv)):
    for count2 in range(count+1, len(sys.argv)):
        arr1 = readFile(sys.argv[count])
        arr2 = readFile(sys.argv[count2])
        # hash key using label and value is souding arr
        # dict[count] = arr1
        # dict[count2] = arr2
        dict[str(count)+str(count2)] = 0 #eg'12'
        dict[str(count2)+str(count)] = 0 #eg'12'
        for item in itertools.chain(arr1, arr2):
            if()
        #pick the shorter duration as reference
        maxlength = min(arr1[len(arr1)-1].xmax, arr2[len(arr2)-1].xmax)
        for a in arr1:
            for b in arr2:
                if(float(a.xmin)>float(b.xmax)): continue
                elif(float(b.xmin)>float(a.xmax)): continue #uncomparable

                if(overlap(a,b)):
                    overlapcount+=1

print 'Interruption Count: ', overlapcount
# print dict.items()
                
    


   
