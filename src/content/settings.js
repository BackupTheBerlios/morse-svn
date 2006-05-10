/*
*	Morse - learn morse code
* 	Copyright (C) 2006 Jan Kechel
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
*
*/

// Settings OK-Button
var MorseSettings =
{
	onSettingsOK: function()
	{
		ab_prefs.setIntPref("settings.dotdashpause", document.getElementById("morse-dotdashpause").value);
		ab_prefs.setIntPref("settings.letterpause", document.getElementById("morse-letterpause").value);
		return true;
	}, //onSettingsOK

	// Settings Cancel-Button
	onSettingsCancel: function()
	{
		return true;
	}, // onSettingsCancel

	// Settings-Dialog gets loaded
	onSettingsLoad: function()
	{
		ab_prefs = Components.classes["@mozilla.org/preferences-service;1"].
			getService(Components.interfaces.nsIPrefService).
			getBranch("extensions.morse."); // this declares the global variable

		// Get the settings and insert em into the text-fields
		var letterpause = ab_prefs.getIntPref("settings.letterpause");
		var letterpausebox = document.getElementById("morse-letterpause");
		letterpausebox.value = letterpause;

		var dotdashpause = ab_prefs.getIntPref("settings.dotdashpause");
		var dotdashpausebox = document.getElementById("morse-dotdashpause");
		dotdashpausebox.value = dotdashpause;


	}, // onSettingsLoad

};


