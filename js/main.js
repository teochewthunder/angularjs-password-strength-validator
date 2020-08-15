var app = angular.module("passvalApp", []);

app.controller("passvalCtrl", 
function($scope) 
{
	function getWords(password)
	{
		var arr = password.split(/[^A-Za-z]/);
		var newArr = [];

		for (var i = 0; i <arr.length; i++)
		{
			if (arr[i].length > 4)
			{
				newArr.push(arr[i].toLowerCase());
			}
		}

		var tempArr = [];

		for (var i = 0; i < newArr.length; i++)
		{
			if (newArr[i].length > 5)
			{
				for (var j = 0; j < newArr[i].length - 4; j++)
				{
					for (var k = 5; k < newArr[i].length; k++)
					{
						if (j + k <= newArr[i].length)
						{
							if (tempArr.indexOf(newArr[i].substr(j, k).toLowerCase()) == -1)
							tempArr.push(newArr[i].substr(j, k).toLowerCase());	
						}				
					}
				}
			}
		}

		for (var i = 0; i < tempArr.length; i++)
		{
			if (newArr.indexOf(tempArr[i].toLowerCase()) == -1)
			newArr.push(tempArr[i].toLowerCase());
		}

		return newArr;
	}

	function getCode(pts)
	{
		if (pts <= 0) return "weak";	
		if (pts == 1) return "moderate";	
		if (pts == 2) return "strong";	
		if (pts >= 3) return "excellent";
	}

	$scope.checkDictionary = 
	function()
	{
		var possibleWords = getWords($scope.enteredPassword);

		$scope.showDictionaryButton = false;

		var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() 
		{
        	if (this.readyState == 4 && this.status == 200) 
			{
				var result = JSON.parse(this.responseText);
				
				if (result.wordsFound)
				{
					alert("'" + result.word + "' found in dictionary!");
				}
				else
				{
					alert("No word found!");
				}
        	}
    	};

		xmlhttp.open("POST", "validate.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send("words=" +  JSON.stringify(possibleWords) + "&url=https://od-api.oxforddictionaries.com:443/api/v2/entries/en-us/"); 
	}

	$scope.processPassword =
	function()
	{
		if ($scope.enteredPassword.length == 0) return;

		if ($scope.enteredPassword.length < 8)
		{
			$scope.strengthCode = "weak";
			$scope.strengthMessage = "Password is too short. 8 characters or above recommended.";
			return;
		}

		var pts = 1;
		$scope.strengthMessage = "";

		if (/[~`!#$%\_\^&@*+=\-\[\]\\';,/{}|\\":<>\?]/g.test($scope.enteredPassword))
		{
			pts ++;
		}
		else
		{
			$scope.strengthMessage += "Try using special characters in your password.\n";
		}

		if (/[A-Z]/g.test($scope.enteredPassword))
		{
			pts ++;
		}
		else
		{
			$scope.strengthMessage += "Try using a mix of uppercase letter and lowercase letters.\n";
		}

		if (/[0-9]/g.test($scope.enteredPassword))
		{
			pts ++;
		}
		else
		{
			$scope.strengthMessage += "Try including numbers in your password.\n";
		}

		var possibleWords = getWords($scope.enteredPassword);

		$scope.showDictionaryButton = (possibleWords.length > 0);

		$scope.strengthCode = getCode(pts);
		return;
	};

	$scope.strengthCode = "";
	$scope.strengthMessage = "";
	$scope.enteredPassword = "";
	$scope.showDictionaryButton = false;
}
);