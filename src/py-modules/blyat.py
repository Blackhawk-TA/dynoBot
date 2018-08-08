import sys
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

msg = sys.argv[1].split(",")            # Array of input parameters
url = 'https://bly.at/a'                # Set destination URL here
post_fields = {'url': msg[1]}      # Set POST fields here

request = Request(url, urlencode(post_fields).encode())
jsonS = urlopen(request).read().decode()

print("Shortened url: " + str(json.loads(jsonS)['url']))  # This will be the msg that the bot sends
sys.stdout.flush()  # cleanup