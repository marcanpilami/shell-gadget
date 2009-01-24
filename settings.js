

function init() 
{
	var temp = System.Gadget.Settings.read("txtCmd");
	txtCmd.innerText = temp;
	
	var temp = System.Gadget.Settings.read("txtArgs");
	txtArgs.innerText = temp;
	
	var temp = System.Gadget.Settings.read("intPrd");
	intPrd.innerText = temp;
}

// Delegate for the settings closing event. 
System.Gadget.onSettingsClosing = SettingsClosing;

function SettingsClosing(event)
{
    // Save the settings if the user clicked OK.
    if (event.closeAction == event.Action.commit)
    {
        System.Gadget.Settings.write("txtCmd", txtCmd.value);
		    System.Gadget.Settings.write("txtArgs", txtArgs.value);
		    System.Gadget.Settings.write("intPrd", intPrd.value);
    }
	
    // Allow the Settings dialog to close.
    event.cancel = false;
}