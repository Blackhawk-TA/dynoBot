---
--- A file for general functions used in lua modules
---
utils = {}


---
--- Splits a string by a specific separator into a table
---
--- @param  {string} inputStr The string to split
--- @param {string} sep The separator used to split the string
---
--- @return {table} The split string as a table
---
function utils.splitString(inputStr, sep)
	if sep == null then
		sep = "%s"
	end

	local results = {}
	for str in string.gmatch(inputStr, "([^" .. sep .. "]+)") do
		table.insert(results, str)
	end

	return results
end
