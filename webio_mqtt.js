var hostname = 'localhost';
var port = 9001;
var clientId = "webclient";
clientId += new Date().getUTCMilliseconds();;
var username = "";
var password = "";
var subscription1 = "light1st";
var subscription2 = "light2st";
var subscription3 = "temp";

mqttClient = new Paho.MQTT.Client(hostname, port, clientId);
mqttClient.onMessageArrived =  MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

/*Initiates a connection to the MQTT broker*/
function Connect(){
	mqttClient.connect({
		onSuccess: Connected,
		onFailure: ConnectionFailed,
		keepAliveInterval: 10,
		userName: username,
		useSSL: false,
		password: password	
	});
}

/*Callback for successful MQTT connection */
function Connected() {
  console.log("Connected");
  mqttClient.subscribe(subscription1);
  mqttClient.subscribe(subscription2);
  mqttClient.subscribe(subscription3);

}

/*Callback for failed connection*/
function ConnectionFailed(res) {
	console.log("Connect failed:" + res.errorMessage);
}

/*Callback for lost connection*/
function ConnectionLost(res) {
  if (res.errorCode != 0) {
	console.log("Connection lost:" + res.errorMessage);
	Connect();
  }
}

/*Callback for incoming message processing */
function MessageArrived(message) {
	console.log(message.destinationName +" : " + message.payloadString);
	switch(message.destinationName){
		case "light1st":
			switch(message.payloadString){



			case "1":
				document.getElementById('led1st').innerHTML = "Turned on";
				document.getElementById('led1btn').innerHTML = "Turn off";
				document.getElementById("led1btn").classList.remove('btn-success');
				document.getElementById("led1btn").classList.add('btn-danger');
				break;
			case "0":
				document.getElementById('led1st').innerHTML = "Turned off";
				document.getElementById('led1btn').innerHTML = "Turn on";
				document.getElementById("led1btn").classList.remove('btn-danger');
				document.getElementById("led1btn").classList.add('btn-success');
				break;
			}
			break;
		case "light2st":
			switch(message.payloadString){
				case "1":
					document.getElementById('led2st').innerHTML = "Turned on";
					document.getElementById('led2btn').innerHTML = "Turn off";
					document.getElementById("led2btn").classList.remove('btn-success');
					document.getElementById("led2btn").classList.add('btn-danger');
					break;
				case "0":
					document.getElementById('led2st').innerHTML = "Turned off";
					document.getElementById('led2btn').innerHTML = "Turn on";
					document.getElementById("led2btn").classList.remove('btn-danger');
					document.getElementById("led2btn").classList.add('btn-success');
					break;
			}
			break;
		case "temp":
			document.getElementById('tempdata').innerHTML = message.payloadString;
			break;
	}
}

window.onload=function(){
 	document.getElementById('led1btn').addEventListener("click", led1btnf);
	function led1btnf() {
	    var cell = document.getElementById("led1btn");
		switch (cell.innerHTML){
			case "Turn on":
				var message = new Paho.MQTT.Message("1");
				message.destinationName = "light1";
				mqttClient.send(message);
				break;
			case "Turn off":
				var message = new Paho.MQTT.Message("0");
				message.destinationName = "light1";
				mqttClient.send(message);
				break;
		}
	}
	document.getElementById('led2btn').addEventListener("click", led2btnf);
	function led2btnf() {
	    
	    var cell = document.getElementById("led2btn");
		switch (cell.innerHTML){
			case "Turn on":
				var message = new Paho.MQTT.Message("1");
				message.destinationName = "light2";
				mqttClient.send(message);
				break;
			case "Turn off":
				var message = new Paho.MQTT.Message("0");
				message.destinationName = "light2";
				mqttClient.send(message);
				break;
		}
	}
}
