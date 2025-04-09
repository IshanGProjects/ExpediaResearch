import json
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import tempfile
from webdriver_manager.chrome import ChromeDriverManager
import sys
import os

def scrape_google_maps(location, search_term):
    try:
        # Output the installed ChromeDriverManager version
        from webdriver_manager import __version__ as webdriver_manager_version
        print(f"webdriver_manager version: {webdriver_manager_version}")
        
        # Setup the webdriver
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--remote-debugging-port=9222")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Specify a unique user data directory
        user_data_dir = tempfile.mkdtemp()
        chrome_options.add_argument(f"--user-data-dir={user_data_dir}")
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Open Google Maps
        print("Opening Google Maps...")
        driver.get("https://www.google.com/maps")
        time.sleep(5)
        
        # Enter the location
        print(f"Entering location: {location}")
        search_box = driver.find_element(By.ID, "searchboxinput")
        search_box.send_keys(location)
        search_box.send_keys(Keys.ENTER)
        
        
        # Enter the search term
        print(f"Entering search term: {search_term}")
        search_box = driver.find_element(By.ID, "searchboxinput")
        search_box.clear()
        search_box.send_keys(search_term)
        search_box.send_keys(Keys.ENTER)
        time.sleep(10)
        
        # Get the entire page's HTML content
        print("Getting page source...")
        page_source = driver.page_source
        
        # Close the driver
        driver.quit()
        
    except Exception as e:
        print(f"An error occurred: {e}")

    try:
        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Find the 'a' elements with class "hfpxzc" and extract their aria-label attributes
        a_content = soup.find_all('a', class_='hfpxzc')
        aria_labels = [tag.get('aria-label') for tag in a_content if tag.get('aria-label')]
        a_content = "\n".join(aria_labels)

        # Find the 'div' elements with class "W4Efsd" and extract their aria-label attributes
        div_content = [div.get_text(strip=True) for div in soup.find_all('div', class_='W4Efsd')]
        div_content = "\n".join(div_content)
        
        # Add an endline character before lines that start with a number, except for the first number in the data
        lines = div_content.split("\n")
        modified_lines = [aria_labels[0]+"\n"+lines[0]]  # Include first line
        i_temp =1
        for line in lines[1:]:
            if line and line[0].isdigit():
                modified_lines.append(aria_labels[i_temp]+"\n"+line)
                i_temp+=1
            else:
                modified_lines.append(line)
        div_content = "\n".join(modified_lines)
        
        # Ensure the 'data' directory exists before writing files
        os.makedirs('data', exist_ok=True)

        if a_content:
            # Save the extracted div content to an HTML file in the 'data' folder
            with open(os.path.join('data', f"{location}_{search_term}_names.html"), "w", encoding="utf-8") as f:
                f.write(str(a_content))
        else:
            print("No div with class 'hfpxzc' found.")

        if div_content:
            # Save the extracted div content to an HTML file in the 'data' folder
            with open(os.path.join('data', f"{location}_{search_term}_additional.html"), "w", encoding="utf-8") as f:
                f.write(str(div_content))
        else:
            print("No div with class 'W4Efsd' found.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

from flask import Flask, jsonify, request

app = Flask(__name__)

# POST
@app.route('/api/gmaps', methods=['POST'])
def echo():
    data = request.get_json()
    scrape_google_maps(data['location'], data['search'])
    return jsonify({"message": "Data received", "data": data}), 200

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
