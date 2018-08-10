import sys

msg = sys.argv[1].split(",")  # Array of input parameters
regexGroups = sys.argv[2].split(",")  # Array of input regex groups

# insert code to handle the input parameters here

print("I received these parameters: " + str(msg))  # This will be the msg that the bot sends
print("These are the regex groups: " + str(regexGroups))  # This is a second message that the bot sends
sys.stdout.flush()  # cleanup
