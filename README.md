# AngularJS Password Strength Validator

This is a little segment of code that will accept input from a user on the fly, and calculate its strength according to a few factors...
- Length
- Mix of Upper and Lower case characters
- Presence of Special characters
- Presence of Numbers
- Not words found in a dictionary (requires API, interface written in PHP)

## HTML
There are placeholders to signal the strength of a password - Weak, Moderate, Strong and Excellent. There is also a text box for filling in the password.

## CSS
There are color codes for each password strength category. The CSS styling is part of the templating and is bound to the strength of the password.

## JavaScript
Upon entering text in the text box, the string is parsed for length. If the password is 0 characters, the function returns immediately and does not process further.

There is a number of points determined by the variable `pts`. It is incremented when the password entered passes the length, upper/lower case, special characters, numbers and dictionary test. (One point for each test).

Recommendations for password strength are added to the `strengthMessage` variable for every test failed.

For the API that facilitates the dictionary check, an AJAX call is made to the PHP script.

## PHP
This script uses an external API that will scan "whole" (meaning, strings that don't have special characters in them) and return their dictionary meanings.

The script "chops" up the given password string by special characters and numbers, and eliminates all strings less than 5 characters in length. For every string more than 5 characters in length, it parses its length for all possible words within that substring, and adds them to an array.

Example: "stillwater5woods_eee" gives "stillwater", "woods" and "eee" if we chop them up by special characters and numbers. "eee" is eliminated because it is less than 5 characters, thus we process "stillwater" and "woods". 

This gives us (from "stillwater"):
- stillwater
- stillwate, tillwater
- stillwat, tillwate, illwater
- stillwa, tillwat, illwate, llwater
- stillw, tillwa, illwat, llwate, lwater
- still, tillw, illwa, llwat, lwate, water

From "woods", no further processing is necessary. We simply add "woods" to the array.

That array is then parsed. Each time, CURL is used to call the URL of the API.

**Note:** This works in theory, but since this is an asynchronous operation with a large amount of possible transactions, it is also rather inefficient and can be improved.

**Note:** This branch separates the dictionary check from the other checks by use of a button. Also, the API has been updated.