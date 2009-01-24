/* Set global vars */
var _Cmd = "";
var _Prm = "";
var _Rfr = 10;
var _WshShell = new ActiveXObject("WScript.Shell");

/* Default values */
//var default_Cmd = "dir";
//var default_Prm = "%userprofile%";
var default_Cmd = "C:\\Python25\\python.exe C:\\yokadi\\yokadi.py";
var default_Prm = '--db %USERPROFILE%\\.yokadi.db "t_list -f html"';
var default_Rfr = 10;

/* Envt vars (init once and for all)*/
var envt = _WshShell.Environment("VOLATILE");
envt.Item("STDOUT") = "none";
envt.Item("STDERR")="none";
envt.Item("STDIN")="none";
envt.Item("CMDTORUN")="none";

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
  msg = "Erreur non gérée dans le gadget\n\n";
  msg += "Une erreur est survenue dans le traitement\n";
  msg += "Pressez OK pour continuer\n\n";
  msg += "Erreur : " + errorMessage + "\n";
  msg += "URL: " + url + "\n";
  msg += "Ligne #: " + line;
  _WshShell.Popup(msg, 0, "Erreur du gadget", 16);
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
  //_WshShell.Popup(cmd);
	target_body.innerHTML = cmd;
	//_WshShell.Popup("1");


  // OK, now don't laugh. The only way in Windows to run a command line
  // minimized AND have access to stdout/err/in is to use a subscript called
  // via WshShell.Run (which allows hidden launch). The subscript in turn uses
  // WshShell.Exec (which gives access to the stdio, but cannot run hidden).
  // The subscript then returns the stdout to the main script via an 
  // environment variable. 
  // Note that we MUST specify cscript as the interpretor for the second
  // script, or else it would choose wsh which always shows up front!
  // (we could also use file redirection, but we don't want any files here) 
  
  // Volatile vars are not written in the registry and are passed to 
  // subprocesses.		
  //envt.Item("STDOUT") = "none";
  //envt.Item("STDERR") = "none";
  envt.Item("CMDTORUN") = cmd;
  //_WshShell.Popup("2");
  
  // Subscript launch
  var toRun = "\"cscript\" \"" + System.Gadget.path + "\\start_me_up.js\"";    
  var res = _WshShell.Run(toRun, 0, true);
  if (res != 0)
  {
    _WshShell.Popup("Erreur de ligne de commande");
    return 1;
  }
  //_WshShell.Popup("3");
  // get results
  output = envt.Item("STDOUT");
  errors = envt.Item("STDERR");
  
  // Error "handling"
  if (errors.length != 0)
  {
    _WshShell.Popup(errors, 0, "Erreurs commande shell", 16);
  }
  //_WshShell.Popup(output);
  //_WshShell.Popup("4");
  
  if (output.search(/<html>/i) != -1)
  {
    // Replace whole web page by the one returned      
    var start = output.search(/<html>/i);
    output = output.substr(start);
    var stop = output.search(/<.html>/i) + 7;
    output = output.substr(0,stop);
    //_WshShell.Popup(output);
    
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
    
    // replace HTML with new document      
    var new_body = xmlDoc.getElementsByTagName("body")[0];
    //_WshShell.Popup(new_body.childNodes.length);
    
    // target div is all_body, empty it first
    while (target_body.hasChildNodes()) {target_body.removeChild(target_body.firstChild);}
  
  
    target_body.innerHTML = new_body.xml;   // No you're not dreaming... the 
          // only way to put an XML DOM node into an HTML DOM node in IE is 
          // to use the text properties... 
    target_body.style.fontFamily="Segoe UI"
    target_body.style.fontSize="10pt";
    //document.innerHTML = xmlDoc.documentElement.xml;
    
    //var d = output.substr(start, stop);
    //_WshShell.Popup(output);
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
    
    // remove first lines of stdio (windows console garbage)
    for (i=0; i<9; i++)
    {
      output = output.substr(output.indexOf("<br/>") + 5);
    } 
    // remove last line (exit)
    output = output.replace(/.exit/g, "");
    
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