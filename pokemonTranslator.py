from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from datetime import datetime
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
import pyautogui
import time
import keys

commands = { "a": "a", "b": "b", "right": "right", "left": "left", "up": "up", "down": "down", "start": "s", "select": "e" }

def connect(website_url):
    chrome_options = Options()  
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(executable_path="./chromedriver.exe", chrome_options=chrome_options)
    driver.get(website_url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "messages")))
    reloadPage = time.time()  
    while True:
        timeNow = time.time()
        if timeNow - reloadPage >= 60: ## to flush the page of new messages
            driver.refresh()
            reloadPage = time.time() 
        messages = driver.execute_script(
            "var messages = document.getElementsByClassName('message-another'); \
             var counter = 1; \
             var message_result = []; \
             while (counter < 100) {\
                index = messages.length - counter; \
                if (index <= 0){ \
                    break; \
                } else { \
                    message_result.unshift({content: messages[index].querySelector('.content').innerHTML, clientTime:messages[index].querySelector('.clientTime').innerHTML}); \
                    counter += 1; \
                } \
             } \
             return message_result; \
            "
        )
        print(f"reading {len(messages)} messages")
        for i in range(len(messages)-1):
            command = messages[i]["content"]
            timestamp = float(messages[i]["clientTime"])/1000
            if command in commands and (time.time() - timestamp) <= 1:
                print(timestamp)
                print(time.time())
                print(f"pressing {command}")
                keys.press(commands[command])
        time.sleep(1)

connect("http://localhost:8080")