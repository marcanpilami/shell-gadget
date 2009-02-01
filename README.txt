Windows Vista Shell Command Gadget
================================================================================

Author:                           Marc-Antoine Gouillart
Contact:                          marsu_pilami@msn.com
License:                          GPL v3
Latest revision of this document: 01/02/2009


=================================
== Description
=================================

This is a Windows Vista Gadget (the little widgets that can be placed in the 
Sidebar or onto the Desktop) that periodically runs a shell command and displays
the result.

It automatically resizes itself when moved onto or from the Desktop and Sidebar.

If the standard output of the command contains HTML, the gadget will display it 
as HTML. (the non-HTML part of the message is ignored. Only XHTML allowed.)
If the standard output is not HTML, it will be directly displayed.


=================================
== Installation
=================================

You can either :
- Copy the shell.gadget folder into your directory
%userprofile%\appdata\local\microsoft\windows sidebar\gadgets
- Zip the folder, rename it shell.gadget, right click on it, choose install.

After that, the shell Gadget will appear in your Gadget list: just click the 
little "+" sign on top of the sidebar to show the list of installed gadget and 
drag & drop the shell gadget onto your Sidebar or desktop.


=================================
== Configuration
================================= 

Place the mouse on the Gadget. Click on the little tool icon that then appears.
The configuration box appears. You just have to write the command you wish to 
run, as if you were writing it in the cmd.exe console.
Also choose the periodicity of the command (in minutes).
Click OK, and you're good to go. If you've made a mistake in the command, the 
Gadget will alert you at once. 
The parameters are kept even if you reboot the computer. (the parameters are 
lost if you close the Gadget)

 