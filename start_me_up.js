// Get the "shell"
var _WshShell = new ActiveXObject("WScript.Shell");

// Get the command to run
var envt = _WshShell.Environment("VOLATILE");
cmd = envt.Item("CMDTORUN");
//_WshShell.Popup("cmd : " + cmd);

// Run it
var exec = _WshShell.Exec("cmd.exe");
exec.StdIn.WriteLine("prompt .");   // A variable prompt is a bad idea in stdout
exec.StdIn.WriteLine("chcp 1252");  // ISO-8859-1 superset for display
exec.StdIn.WriteLine(cmd);          // Run user script
exec.StdIn.WriteLine("exit");       // Close console

// Report results
envt.Item("STDOUT") = exec.StdOut.ReadAll();
envt.Item("STDERR") = exec.StdErr.ReadAll();

//_WshShell.Popup(envt.Item("STDOUT"));