Installtion

Demo: 			http://87.106.111.229:8080/

1. Vorbereitung

	-Installieren Sie Nodes.js auf dem Server (https://nodejs.org)
	-Installieren Sie den Nodes Packet Manager (https://docs.npmjs.com/)
	-Installieren Sie einen MongoDB-Server (https://www.mongodb.com/)
	-Kopieren Sie das Programm (https://github.com/TimoFesseler/JS-TeamProjekt)
	-Die Datei "SBFspot-user.json" ist nicht auf GitHub und enthält 
	 Verbindungsdaten zur PV-Daten-Datebank und den API-Key der openWeatherMap
	-Für den Test empfielt es sich den eingetragenen MongoDB-Server zu verwenden, da dieser bereits Wetterdaten enthält. Dieser ist aktuell frei zugänglich.
	 Dies kann in der Datei DB.js ggf. geändert werden.
	-Der Serverport des Webservers kann in der Datei config.json geändert werden
	
2. Installation

	-Sind die gewünschten Parameter angepasst begeben sie sich über die Commandline bitte in das Root-Verzeichnis des Programms.
	 Dort können Sie über "npm install" die vorhandene package.json bequem alle module installieren. Führen Sie dazu folgenden Befehl aus:
	 
	
3. Start

	- Starten Sie den MongoDB-Server
	- Begeben Sie sich in das Root-Verzeichnis des Programms und führen Sie den Befehl "node server.js" aus.
	  Nun wird der Webservers sich automatisch starten. 
	  
	  --> Der Server läuft nun unter http://127.0.0.1:8080/
	  --> Mongoose default connection open to mongodb://localhost/test