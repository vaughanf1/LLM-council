import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv('OPENROUTER_API_KEY')

if not api_key:
    print("ERROR: OPENROUTER_API_KEY not found in .env file")
    exit(1)

print("✓ API key loaded successfully")
print(f"✓ API key starts with: {api_key[:15]}...")
print("\nMaking API call to OpenRouter...\n")

# OpenRouter API endpoint
url = "https://openrouter.ai/api/v1/chat/completions"

# Headers for the API request
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Request payload
data = {
    "model": "meta-llama/llama-3.2-3b-instruct:free",  # Using a free model for testing
    "messages": [
        {
            "role": "user",
            "content": "Say 'Hello! I am a real API response from OpenRouter.' and nothing else."
        }
    ]
}

try:
    # Make the API request
    response = requests.post(url, headers=headers, json=data)

    # Check if request was successful
    if response.status_code == 200:
        result = response.json()
        message = result['choices'][0]['message']['content']

        print("=" * 60)
        print("SUCCESS! Real API Response Received:")
        print("=" * 60)
        print(f"\nModel: {result.get('model', 'N/A')}")
        print(f"\nResponse: {message}")
        print("\n" + "=" * 60)
        print("✓ This is a REAL response from OpenRouter API")
        print("✓ Your integration is working correctly!")
        print("=" * 60)
    else:
        print(f"ERROR: API request failed with status code {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"ERROR: {str(e)}")
