		//output = exec.StdOut.ReadAll();
		
		// Charset conversion
// 		var adoStreamWin = new ActiveXObject("ADODB.Stream");
// 		var adoStreamUTF = new ActiveXObject("ADODB.Stream");
		
		// Streams init
// 		sp.innerHTML = "0";
// 		adoStreamWin.Type = 2;                  // Text
// 		adoStreamWin.LineSeparator = -1;        // CR LF 
// 		adoStreamWin.Charset = "ISO-8859-1";
// 		adoStreamWin.Open();
// 		
//     sp.innerHTML = "1";
//     adoStreamUTF.Type = 2;                  // Text
// 		adoStreamUTF.LineSeparator = -1;        // CR LF 
//     adoStreamUTF.Charset = "UTF-8";
//     adoStreamUTF.Open();
// 		
// 		sp.innerHTML = "2";
//     adoStreamWin.WriteText(exec.StdOut.ReadAll());
// 		
//     sp.innerHTML = "3";
// 		adoStreamWin.Position = 0;
//     
//     sp.innerHTML = "4";
// 		adoStreamUTF.WriteText(adoStreamWin.ReadText());
// 		
// 		sp.innerHTML = "5";
// 		adoStreamUTF.Position = 0;
// 		
//     sp.innerHTML = "6";
// 	  //sp.innerHTML = adoStreamUTF.ReadText();
// 	  sp.innerHTML = exec.StdErr.ReadAll() + "\n" + adoStreamUTF.ReadText();
\n// 		adoStreamUTF.Close();
// 		adoStreamWin.Close();