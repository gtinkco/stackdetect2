import requests
from bs4 import BeautifulSoup

# Step 1: Define the target URL
URL = "https://facebook.com"

# Step 2: Send an HTTP request
response = requests.get(URL)

# Check for successful request
if response.status_code == 200:
    # Step 3: Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Step 4: Extract desired data (meta tags, scripts, stylesheets)
    tech_stack = []

    # Extract meta tags
    for meta_tag in soup.find_all("meta"):
        tech_stack.append(meta_tag.attrs)

    # Extract JavaScript libraries
    for script_tag in soup.find_all("script"):
        src = script_tag.get("src")
        if src:
            tech_stack.append(src)

    # Extract stylesheets
    for link_tag in soup.find_all("link", rel="stylesheet"):
        href = link_tag.get("href")
        if href:
            tech_stack.append(href)

    # Print extracted technologies
    print("Extracted Technologies:")
    for tech in tech_stack:
        print(f"- {tech}")

else:
    print(f"Failed to fetch the URL: {URL}, Status Code: {response.status_code}")
