// all code that interacts with index.html lives here

var timeoutTimer;
runTranslator = function()
{
	// retrieves MATLAB code from input field
	var input = document.getElementById("inputField").value;
	
	// retrieves advanced options input
	functionNamesInput = document.getElementById("functionNamesField").value;
	nonFunctionNamesInput = document.getElementById("notFunctionNamesField").value;
	removeSemicolons = document.getElementById("removeSemicolonsCheckbox").checked;
	nonanonymousOneLiners = document.getElementById("nonanonymousOneLinersButton").checked;
	
	// kills translation if it hasn't finished in 3 seconds
	timeoutTimer = setTimeout(respondToTimeout, 3000);
	
	// translates MATLAB code to Julia
	var output = translate(input);
	clearTimeout(timeoutTimer);

	// moves translated code to output field
	document.getElementById("outputField").value = output;
	
	// makes output field editable and copy button clickable
	document.getElementById("outputField").disabled = false;
	document.getElementById("copyToClipboardButton").disabled = false;
}

// handles timeout
var commonErrorMessage = "\n\nPlease consider sending a bug report with your MATLAB code so that the bug causing this timeout can be fixed."
		+ " You can file an issue on GitHub at the following URL:"
		+ "\nhttps://github.com/lakras/matlab-to-julia/issues/"
		+ "\n\nIf you prefer, you can alternatively fill out a Google form by copy/pasting the following URL:"
		+ "\nhttps://docs.google.com/forms/d/e/1FAIpQLScvH5sN-TLk69V5hipx9Afk54Srn8muBrhJuoV59KkLEeza-Q/viewform?usp=sfLink"
		+ "\n\nIn the meantime, I recommend breaking your code into pieces and translating each piece separately "
		+ "so that you can get what you can from this translator and get on with your work."
		+ "\n\nSorry this happened. Thank you!";
respondToTimeout = function()
{
	document.getElementById("outputField").value = "Translation timed out."
		+ commonErrorMessage;
}

// handles errors
respondToError = function(errorMessage)
{
	clearTimeout(timeoutTimer);
	if(!inputFieldIsEmpty())
	{
		document.getElementById("outputField").value = "Translation failed with error: " + errorMessage
			+ commonErrorMessage;
	}
}
window.onerror = function(errorMessage, url, lineNumber)
{
	respondToError(errorMessage);
}
window.addEventListener("error", function(error)
{
	respondToError(error.message);
});

inputFieldIsEmpty = function()
{
	var contents = document.getElementById("inputField").value;
	if(contents.length == 0)
	{
		return true;
	}
	if(contents === "Enter MATLAB code here.")
	{
		return true;
	}
	return false;
}

copyToClipboard = function()
{
	var textToCopy = document.getElementById("outputField").value;
	document.getElementById("outputField").select();
	document.execCommand('copy');
	setTimeout(deselectOutputField,300);
}

deselectOutputField = function()
{
	document.getElementById("outputField").blur();
}

clearInputField = function()
{
	if(document.getElementById("inputField").value == "Enter MATLAB code here.")
	{
		document.getElementById("inputField").value = "";
	}
}

enableTranslateButton = function()
{
	document.getElementById("translateButton").disabled=false;
}

clearFunctionNamesField = function()
{
	if(document.getElementById("functionNamesField").value == defaultFunctionNamesFieldValue)
	{
		document.getElementById("functionNamesField").value = "";
	}
}
clearNotFunctionNamesField = function()
{
	if(document.getElementById("notFunctionNamesField").value == defaultNotFunctionNamesFieldValue)
	{
		document.getElementById("notFunctionNamesField").value = "";
	}
}

var optionsElementIDs = ["functionNamesField", "notFunctionNamesField", "optionsLabel1",
	"optionsLabel2", "optionsLabel3", "optionsLabel4", "optionsLabel5", "optionsLabel6",
	"optionsLabel7", "optionsLabel8", "optionsLabel9", "optionsLabel10"];
hideOrExposeOptions = function()
{
	// currently hidden, so switch to visible
	if(document.getElementById(optionsElementIDs[0]).style.visibility == "hidden")
	{
		for(var i = 0; i < optionsElementIDs.length; i++)
		{
			document.getElementById(optionsElementIDs[i]).style.visibility = "visible";
		}
		document.getElementById("advancedOptionsLabel").innerHTML = "&#9660;&nbsp;&nbsp;<u>Advanced options:</u>";
	}
	
	// currently visible, so switch to hidden
	else
	{
		for(var i = 0; i < optionsElementIDs.length; i++)
		{
			document.getElementById(optionsElementIDs[i]).style.visibility = "hidden";
		}
		document.getElementById("advancedOptionsLabel").innerHTML = "<span class=\"spooky\">&#9650;&nbsp;&nbsp;<u>Advanced options:</u></span>";
	}
}

var demoCode =
		"A = B + C %{block\n" +
		"comment\n" +
		"blocky comment%} h = @(x, y) x * y\n" +
		"\n" +
		"%a comment\n" +
		"\n" +
		"h = @(x, y) x * y\n" +
		"h=@(x,y)x*y\n" +
		"h=@ (x,y)x*y\n" +
		"h = @ (x, y, z) x * y\n" +
		"\n" +
		"%{\n" +
		"    comments here\n" +
		"    more comments here\n" +
		"%}\n" +
		"\n" +
		"mod(5,3)\n" +
		"mod(5, 3)\nmod (5, 3)\n" +
		"\n" +
		"h = @ (x, y) mod (x, y)\n" +
		"h=@(x, y)mod(x,y)\n" +
		"\n" +
		"fprintf('My age is %d and my decimal is %.2f\\n', age, decimal)\n" +
		"sqrt(-1)\n" +
		"bitxor(a + b, c + d)\n" +
		"bitand(a + b, c + d)\n" +
		"bitor(a, b)\n\nfunction [c f] = temperature(x, y)\n" +
		"	f = x + y;\n" +
		"	c = x * y;\n" +
		"end\n" +
		"\n" +
		"function [c f] = temperature(x, y)\n" +
		"	f = x + y; c = x * y; end\n" +
		"\n" +
		"\n" +
		"function[c f]=temperature(x,y)\n" +
		"	f = x + y; c = x * y;end\n" +
		"\n" +
		"A(2)\n" +
		"A(0:2)\n" +
		"A(1:2:10)\n" +
		"h(1)\n" +
		"temperature(2)\n" +
		"temperature(2,3)\n" +
		"temperature\n" +
		"temperature\n" +
		"exp(blarg(8))\n" +
		"a(exp(c(d*y)))\n" +
		"fg(exp(rt(7)+er(6+exp(9)))+hi(jk(lm(13+temperature(6+8, 9)))))\n" +
		"\n" +
		"function [c f] = temperature(x, y)\n" +
		"	f = x + y;\n" +
		"	c = x * y;\n" +
		"	hello\n" +
		"\n" +
		"	hi";
insertDemoCode = function()
{
	document.getElementById("inputField").value = demoCode;
}