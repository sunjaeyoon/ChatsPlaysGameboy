import pyautogui as pag
import time
import sys

keys = ['a', 'b', 'x', 'y', 'e', 's', 'right', 'left', 'up', 'down']



def press(key):
	if key in keys:
		#time.sleep(3)
		pag.keyDown(key)
		time.sleep(0.000000001)
		pag.keyUp(key)
	
if __name__ == "__main__":
	press(sys.argv[1])
	
	
