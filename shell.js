/*
  Main gadget script
  
  @copyright: Marc-Antoine Gouillart, 2009
  @licence: GPLv3
*/



/* Set global vars */
var _Cmd = "";
var _Prm = "";
var _Rfr = 10;

var _WshShell = new ActiveXObject("WScript.Shell");
var _FSO  = new ActiveXObject("Scripting.FileSystemObject"); 

var tmpFileOut = System.Gadget.path + "\\gadgettempout.txt"
var tmpFileErr = System.Gadget.path + "\\gadgettemperr.txt"

/* Default values */
var default_Cmd = "dir";
var default_Prm = "%userprofile%";
//var default_Cmd = "C:\\Python25\\python.exe C:\\yokadi\\yokadi.py";
//var default_Prm = '--db %USERPROFILE%\\.yokadi.db "t_list -f html"';
var default_Rfr = 10;

/* Gadget inits */
System.Gadget.settingsUI = "settings.html";      // we have a settings page
System.Gadget.onSettingsClosed = SettingsClosed; // call this when params change


////////////////////////////////////////////////////////////////////////////////
// Generic error handling, with debug information
//
onerror = handleErrors;
var msg = null;
function handleErrors(errorMessage, url, line)
{
  msg = "Unhandled error\n\n";
  msg += "An error occured during processing\n";
  msg += "Press OK to continue\n\n";
  msg += "Error : " + errorMessage + "\n";
  msg += "URL: " + url + "\n";
  msg += "Line #: " + line;
  _WshShell.Popup(msg, 0, "Shell gadget error", 16);
  return true
}
//
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// Main function
//
function refresh()
{
  var target_body = document.getElementById('all_body');
  target_body.style.fontFamily="Lucida Console";  // Why doesn't it work in the CSS?
                                                  // (We need a fixed-width font)
  // Command line to run
  var cmd = _Cmd + " " + _Prm;
	target_body.innerHTML = cmd;

  toRun="cmd.exe /D /U /C chcp 65001 && " + cmd + " >\"" + tmpFileOut + "\" 2>\"" + tmpFileErr + "\"";
  //_WshShell.Popup(toRun);
  // Script launch
  var res = _WshShell.Run(toRun, 0, true);
  
  // Get result outputs
  var errors = "";
  var output = "no output";
  
  /* NOTE: here, we cannot test the length of the file befoire opening it, as
  the file may not already have been flushed to disk... So we use try/catch 
  instead */
  try
  {
    var of = _FSO.OpenTextFile(tmpFileOut, 1, true, -2);
    output = of.ReadAll();
    of.Close();
  }
  catch(err) {}
  
  try 
  {
    var of = _FSO.OpenTextFile(tmpFileErr, 1, true, -2);
    errors = of.ReadAll();
    of.Close();
  }
  catch(err) {}
  
  
  // Error "handling"
  if (errors.length != 0 || res != 0)
  {
    _WshShell.Popup(errors, 0, "An error occured while running the command", 16);
    return 1;
  }
  
  if (output.search(/<html>/i) != -1)
  {
    ////////////////////////////////////////////////////////////////////////////
    // HTML -> HTML formatting : Replace whole web page by the one returned 
    // 
    var start = output.search(/<html>/i);
    output = output.substr(start);
    var stop = output.search(/<.html>/i) + 7;
    output = output.substr(0,stop);
    
    // Remove legacy ANSI HTML codes in favor of XML parsable Unicode codes
    output = output.replace(/&nbsp;/g, "&#160;");
    
    // Load & parse the string as a XML object
    var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async="false";
    xmlDoc.loadXML(output);   
    if (xmlDoc.parseError.errorCode != 0)
    {
      var errormsg = "Error code: " + xmlDoc.parseError.errorCode + "\n";
      errormsg = errormsg + "Error reason: " + xmlDoc.parseError.reason + "\n";
      errormsg = errormsg + "Error line: " + xmlDoc.parseError.line + "\n\n";
      errormsg = errormsg + "La page ne sera pas affichée par le gadget.";
      _WshShell.Popup(errormsg, 0, "Document XHTML invalide", 16);
    }
    var new_body = xmlDoc.getElementsByTagName("body")[0];
    
    // Target div is all_body, empty it first...
    while (target_body.hasChildNodes()) {target_body.removeChild(target_body.firstChild);} 
  
    // ... then fill it again
    target_body.innerHTML = new_body.xml;   // No you're not dreaming... the 
          // only way to put an XML DOM node into an HTML DOM node in IE is 
          // to use the text properties... 
    target_body.style.fontFamily="Segoe UI"
    target_body.style.fontSize="10pt";
    //
    ////////////////////////////////////////////////////////////////////////////
  }
  else
  { 	
    ////////////////////////////////////////////////////////////////////////////
    // STDOUT -> HTML formatting
    //
    output = output.replace(/\u00a0/g, "&nbsp;");      // Insecable space
    output = output.replace(/\u0020/g, "&nbsp;");      // Normal space
    output = output.replace(/\u003c/g, "&lt;");        // < sign
    output = output.replace(/\u003e/g, "&gt;");        // > sign
    output = output.replace(/\u000d\u000a/g, "<br/>"); // CL+CR
    
    // Update gadget web page
    target_body.innerHTML = output;
    //
    ////////////////////////////////////////////////////////////////////////////
  }
}
//
////////////////////////////////////////////////////////////////////////////////




/*******************************************************************************
 ** Docking/undocking handling
 *************************************************************************** */
System.Gadget.onUndock = WhenUndocked;
System.Gadget.onDock = WhenDocked;

function WhenUndocked()
{
   System.Gadget.beginTransition();
   with(document.body.style)
   { 
        width=700;
        height=500;
    } 
    System.Gadget.endTransition(System.Gadget.TransitionType.morph,0.1);
}

function WhenDocked()
{
   System.Gadget.beginTransition();
   with(document.body.style)
   { 
        width=120;
        height=160;
    } 
    System.Gadget.endTransition(System.Gadget.TransitionType.morph,0.1);
}



/*******************************************************************************
 ** Init/reinit
 *************************************************************************** */

function SettingsClosed(event)
{
    if (event.closeAction == event.Action.commit)
    {
      init();
    }
    else if (event.closeAction == event.Action.cancel)
    {
      SetContentText("Cancelled");
    }
}

function init()
{
	_Cmd = System.Gadget.Settings.readString("txtCmd");
	if (_Cmd == "")
	{
		System.Gadget.Settings.write("txtCmd", default_Cmd);
		_Cmd =  default_Cmd;
	}
	_Prm = System.Gadget.Settings.readString("txtArgs");
	if (_Prm == "")
	{
		System.Gadget.Settings.write("txtArgs", default_Prm);
		_Prm =  default_Prm;
	}
	_Rfr = System.Gadget.Settings.readString("intPrd");
	if (_Rfr == "")
	{
		System.Gadget.Settings.write("intPrd", default_Rfr);
		_Rfr =  default_Rfr;
	}
	
	refresh();
	window.setInterval("refresh()", _Rfr * 60 * 1000);
}