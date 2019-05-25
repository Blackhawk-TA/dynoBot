---
--- An example for a simple lua based module
---

-- Import lua module helper for splitting strings into arrays
require "src/utils/luaUtils"

local sMessage = arg[1] -- String of input parameters
local sRegexGroups = arg[2] -- String of input regex groups

local aMessage = utils.splitString(sMessage, ",") -- Array of input parameters
local aRegexGroups = utils.splitString(sRegexGroups, ",") -- Array of input regex groups


-- Insert code to handle the input parameters here


--This will be the msg that the bot sends
print("I received these parameters: [" .. tostring(aMessage[1]) .. ", " .. tostring(aMessage[2]) .. "]")

--This is a second message that the bot sends
print("These are the regex groups: [" .. tostring(aRegexGroups[1]) .. "]")
