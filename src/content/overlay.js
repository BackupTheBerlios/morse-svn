/*
*	Morse - learn morse code
*	Copyright (C) 2006 Jan Kechel
*
*	This program is free software; you can redistribute it and/or
*	modify it under the terms of the GNU General Public License 
*	as published by the Free Software Foundation; either version 2
*	of the License, or (at your option) any later version.
*
*	This program is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty of
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*	GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public License
*	along with this program; if not, write to the Free Software
*	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*
*/

var Morse = 
{
	onSettings: function()
	{
		var setdiag = window.openDialog("chrome://morse/content/settings.xul", "Morse preferences", "chrome,centerscreen,modal");
		setdiag.focus();

	}, // onSettings

	onLicense: function()
	{
		var setdiag = window.openDialog("chrome://morse/content/license.xul", "Morse License", "chrome,centerscreen,modal");
		setdiag.focus();

	}, // onLicense

	onHelp: function()
	{
		var setdiag = window.openDialog("chrome://morse/content/help.xul", "Morse Help", "chrome,centerscreen,modal");
		setdiag.focus();

	}, // onHelp

	onStart: function(event)
	{
		morse_prefs = Components.classes["@mozilla.org/preferences-service;1"].
			getService(Components.interfaces.nsIPrefBranch).
			getBranch("extensions.morse.");

		Morse.player = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
		Morse.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		Morse.ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);

		Morse.player.init();

		Morse.dot = Morse.myGetURL("extensions.morse.settings.dot");
		Morse.dash = Morse.myGetURL("extensions.morse.settings.dash");

		Morse.displayletter = document.getElementById("morse-letter");

		Morse.code = new Array();
		Morse.letter = new Array();

		Morse.code[0] = ".-"; // A
		Morse.code[1] = "-..."; // B
		Morse.code[2] = "-.-."; // C
		Morse.code[3] = "-.."; // D
		Morse.code[4] = "."; // E
		Morse.code[5] = "..-."; // F
		Morse.code[6] = "--."; // G
		Morse.code[7] = "...."; // H
		Morse.code[8] = ".."; // I
		Morse.code[9] = ".---"; // J
		Morse.code[10] = "-.-"; // K
		Morse.code[11] = ".-.."; // L
		Morse.code[12] = "--"; // M
		Morse.code[13] = "-."; // N
		Morse.code[14] = "---"; // O
		Morse.code[15] = ".--."; // P
		Morse.code[16] = "--.-"; // Q
		Morse.code[17] = ".-."; // R
		Morse.code[18] = "..."; // S
		Morse.code[19] = "-"; // T
		Morse.code[20] = "..-"; // U
		Morse.code[21] = "...-"; // V
		Morse.code[22] = ".--"; // W
		Morse.code[23] = "-..-"; // X
		Morse.code[24] = "-.--"; // Y
		Morse.code[25] = "--.."; // Z

		Morse.letter[0] = "A"; // A
		Morse.letter[1] = "B"; // B
		Morse.letter[2] = "C"; // C
		Morse.letter[3] = "D"; // D
		Morse.letter[4] = "E"; // E
		Morse.letter[5] = "F"; // F
		Morse.letter[6] = "G"; // G
		Morse.letter[7] = "H"; // H
		Morse.letter[8] = "I"; // I
		Morse.letter[9] = "J"; // J
		Morse.letter[10] = "K"; // K
		Morse.letter[11] = "L"; // L
		Morse.letter[12] = "M"; // M
		Morse.letter[13] = "N"; // N
		Morse.letter[14] = "O"; // O
		Morse.letter[15] = "P"; // P
		Morse.letter[16] = "Q"; // Q
		Morse.letter[17] = "R"; // R
		Morse.letter[18] = "S"; // S
		Morse.letter[19] = "T"; // T
		Morse.letter[20] = "U"; // U
		Morse.letter[21] = "V"; // V
		Morse.letter[22] = "W"; // W
		Morse.letter[23] = "X"; // X
		Morse.letter[24] = "Y"; // Y
		Morse.letter[25] = "Z"; // Z

		if( !Morse.running)
		{
			Morse.running = true;
			
			pref_letterpause = morse_prefs.getIntPref("settings.letterpause");
			pref_dotdashpause = morse_prefs.getIntPref("settings.dotdashpause");
			Morse.morse();
		}
	}, // onStart

	onStop: function(event)
	{
		Morse.running = false;
		Morse.displayletter.setAttribute("value", "Morse");
	}, // onStop

	myGetURL: function(p) 
	{
	  	try 
	  	{
			var file = Morse.prefs.getComplexValue(p, Components.interfaces.nsILocalFile);
			return Morse.ios.newFileURI(file);
	  	} 
		catch(e) 
		{
		  	try 
			{
			  	var str = Morse.prefs.getComplexValue(p, Components.interfaces.nsISupportsString).data;

				if(str == "")
				{
					return null;
				}
				return Morse.ios.newURI(str, null, null);
		  	} 
			catch(e2) 
			{
			  	alert("\nMorse Extension: " + e2);
		 	}
	  	}
	},

	morse: function()
	{
		if( Morse.running)
		{
			// select random letter
			Morse.morsenowindex = Math.round((Morse.code.length - 1)*Math.random());

			// show in background
			var morse_mybodys = window.content.document.getElementsByTagName("body");
			if( morse_mybodys.length > 0)
			{
				// foreach body
				for( var morse_i = 0; morse_i < morse_mybodys.length; morse_i++)
				{
					if( morse_mybodys[morse_i])
					{
						morse_mybodys[morse_i].setAttribute("background", "chrome://morse/skin/" + Morse.letter[Morse.morsenowindex] + ".png");
					}
				}
			}

			// try to change each frame's background image
			var morse_myframes = window.content.frames;
			if( morse_myframes)
			{
				if( morse_myframes.length > 0)
				{
					// foreach frame
					for( var morse_j = 0; morse_j < morse_myframes.length; morse_j++)
					{
						var morse_myframebodys = morse_myframes[morse_j].document.getElementsByTagName("body");
						// foreach 'body'
						for( var morse_k = 0; morse_k < morse_myframebodys.length; morse_k++)
						{
							if( morse_myframebodys[morse_k])
							{
								morse_myframebodys[morse_k].setAttribute("background", "chrome://morse/skin/" + Morse.letter[Morse.morsenowindex] + ".png");
							}
						}
					}
				}
			}

	
			// show in toolbar
			Morse.displayletter.setAttribute("value", Morse.letter[Morse.morsenowindex] + " " + Morse.code[Morse.morsenowindex]);


			// start beeping
			Morse.morseletter(Morse.code[Morse.morsenowindex]);

			// time next letter
			setTimeout("Morse.morse()", pref_letterpause);
		}
	},

	morseletter: function(topeep)
	{
		if( Morse.running && topeep.length > 0)
		{
			var morse_now = topeep.substr(0,1);
			if( morse_now == '.')
			{
				Morse.player.play(Morse.dot);
			}
			else
			{
				Morse.player.play(Morse.dash);
			}
			if( topeep.length > 1)
			{
				setTimeout("Morse.morseletter(\"" + topeep.substr(1) + "\")", pref_dotdashpause);
			}
		}
	}

}; // Morse

// EOF
