
import requests
import json
import time

def verify_monte_carlo():
    url = "http://127.0.0.1:8000/monte-carlo/sp500?simulations=100&horizon=10"
    print(f"Testing {url}...")
    
    # Wait for server to start
    max_retries = 5
    for i in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            print(f"Connection failed, retrying in 2s ({i+1}/{max_retries})...")
            time.sleep(2)
    else:
        print("Failed to connect to API.")
        return False

    if response.status_code != 200:
        print(f"Error: Status code {response.status_code}")
        print(response.text)
        return False

    data = response.json()
    print("Response received.")
    
    # Check for new fields
    required_fields = ["var95", "var99", "expectedReturn", "volatility", "returnDistribution"]
    missing = [f for f in required_fields if f not in data]
    
    if missing:
        print(f"Error: Missing fields: {missing}")
        return False
        
    # Check values
    print(f"VaR 95%: {data['var95']}")
    print(f"Expected Return: {data['expectedReturn']}")
    print(f"Distribution bins: {len(data['returnDistribution'])}")
    
    if not isinstance(data['returnDistribution'], list):
        print("Error: returnDistribution is not a list")
        return False
        
    if len(data['returnDistribution']) == 0:
        print("Error: returnDistribution is empty")
        return False
        
    print("Verification SUCCESS!")
    return True

if __name__ == "__main__":
    verify_monte_carlo()
