import sys
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

url = 'https://bly.at/a'                # Set destination URL here
post_fields = {'url': sys.argv[1]}      # Set POST fields here

request = Request(url, urlencode(post_fields).encode())
jsonS = urlopen(request).read().decode()

print("Shortened url: " + json.loads(jsonS)['url'])  # This will be the msg that the bot sends
sys.stdout.flush()  # cleanup