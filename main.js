LOW_CONFIDENCE = 'grey'
HIGH_CONFIDENCE = 'black'

function midiScale(val, max) {
	return Math.min(Math.max(Math.round(val * 127 / max), 0), 127)

}

function sendPossible(possible){
	if (possible['cc'] != 0) {
		sendMidiCC(possible['cc'], possible['val'])
	}
}


function makeDetail() {
	return {
		'cc': 0,
		'enabled': false,
		'val': 0,
		'solo': false,
		'confidence': 0,
		'color': LOW_CONFIDENCE,
	}
}


var app = angular.module("myShoppingList", []);
app.controller("myCtrl", function($scope) {

	$scope.confidenceCutoff = .05

	$scope.streams = {
		'head': {
			'nose': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'leftEar': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'rightEar': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'leftEye': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'rightEye': {
				'x': makeDetail(),
				'y': makeDetail()
			}
		},
		'arms': {
			'leftWrist': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'leftElbow': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'leftShoulder': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'rightWrist': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'rightElbow': {
				'x': makeDetail(),
				'y': makeDetail()
			},
			'rightShoulder': {
				'x': makeDetail(),
				'y': makeDetail()
			}
		},
		'legs': {
			'leftHip': {
				'x':makeDetail(),
				'y':makeDetail()
			},
			'rightHip': {
				'x':makeDetail(),
				'y':makeDetail()
			},
			'leftKnee': {
				'x':makeDetail(),
				'y':makeDetail()
			},
			'rightKnee': {
				'x':makeDetail(),
				'y':makeDetail()
			},
			'leftAnkle': {
				'x':makeDetail(),
				'y':makeDetail()
			},
			'rightAnkle': {
				'x':makeDetail(),
				'y':makeDetail()
			}

		}
	}

	$scope.chiliSpicy = function(spice) {
		$scope.spice = spice;
		if (spice.length > 0) {
			pose = spice[0].pose
			// console.log($scope.streams.head.nose.x)
			// console.log(pose.nose.x)
			updateVal('head','nose')
			updateVal('head','rightEye')
			updateVal('head','leftEye')
			updateVal('head','rightEar')
			updateVal('head','leftEar')


			updateVal('arms','leftWrist')
			updateVal('arms','leftElbow')
			updateVal('arms','leftShoulder')
			updateVal('arms','rightWrist')
			updateVal('arms','rightElbow')
			updateVal('arms','rightShoulder')


			updateVal('legs','leftHip')
			updateVal('legs','rightHip')
			updateVal('legs','leftKnee')
			updateVal('legs','rightKnee')
			updateVal('legs','leftAnkle')
			updateVal('legs','rightAnkle')

			$scope.$apply()

		}
		// pass along data this way
	};

	$scope.clickSolo =  function(area,part,param){
		$scope.streams[area][part][param].solo = !$scope.streams[area][part][param].solo
	}

	function updateVal(section, part){
		$scope.streams[section][part]['x']['val'] = midiScale(pose[part].x, 640)
		$scope.streams[section][part]['x']['confidence'] = pose[part].confidence
		$scope.streams[section][part]['x']['color'] = pose[part].confidence > $scope.confidenceCutoff ? HIGH_CONFIDENCE : LOW_CONFIDENCE
		sendPossible($scope.streams[section][part]['x'])

		$scope.streams[section][part]['y']['val'] = midiScale(pose[part].y, 640)
		$scope.streams[section][part]['y']['confidence'] = pose[part].confidence
		$scope.streams[section][part]['y']['color'] = pose[part].confidence > $scope.confidenceCutoff ? HIGH_CONFIDENCE : LOW_CONFIDENCE
		sendPossible($scope.streams[section][part]['y'])

	}

	// function getUrlVars() {
	// 	var vars = {};
	// 	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
	// 		vars[key] = value;
	// 	});
	// 	return vars;
	// }

	async function postData(url = '', data = {}) {
		// // Default options are marked with *
		// const response = await fetch(url, {
		//   method: 'POST', // *GET, POST, PUT, DELETE, etc.
		//   mode: 'cors', // no-cors, *cors, same-origin
		//   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		//   credentials: 'same-origin', // include, *same-origin, omit
		//   headers: {
		//     'Content-Type': 'application/json'
		//     // 'Content-Type': 'application/x-www-form-urlencoded',
		//   },
		//   redirect: 'follow', // manual, *follow, error
		//   referrerPolicy: 'no-referrer', // no-referrer, *client
		//   body: JSON.stringify(data) // body data type must match "Content-Type" header
		// });
		// return await response.json(); // parses JSON response into native JavaScript objects
	}



	$scope.midioutputs = [];

	function connect() {
		navigator.requestMIDIAccess()
			.then(
				(midi) => midiReady(midi),
				(err) => console.log('Something went wrong', err));
	}

	function midiReady(midi) {
		// Also react to device changes.
		midi.addEventListener('statechange', (event) => initDevices(event.target));
		initDevices(midi); // see the next section!
	}

	function initDevices(midi) {
		$scope.midioutputs = [];
		// MIDI devices that you send data to.
		const outputs = midi.outputs.values();
		for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
			$scope.midioutputs.push(output.value);
		}
		$scope.midiSelectedOutput = $scope.midioutputs[0]
		console.log("wow we here!")
	}
	connect()
	// function sendMidiMessage(pitch, velocity, duration) {
	//   const NOTE_ON = 0x90;
	//   const NOTE_OFF = 0x80;

	//   console.log(JSON.stringify(midiOut))
	//   console.log(midiOut[0])
	//   const device = midiOut[0];
	//   const msgOn = [NOTE_ON, pitch, velocity];
	//   const msgOff = [NOTE_ON, pitch, velocity];

	//   // First send the note on;
	//   device.send(msgOn); 

	//   // Then send the note off. You can send this separately if you want 
	//   // (i.e. when the button is released)
	//   device.send(msgOff, Date.now() + duration); 
	// }


	function sendMidiCC(number, value) {
		const device = $scope.midiSelectedOutput;
		const CC_CHANGE = 0xb0;
		const cc_message = [CC_CHANGE, number, value];
		device.send(cc_message);
	}



	// Copyright (c) 2019 ml5
	//
	// This software is released under the MIT License.
	// https://opensource.org/licenses/MIT

	/* ===
	ml5 Example
	PoseNet using p5.js
	=== */


	// Grab elements, create settings, etc.
	var video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// The detected positions will be inside an array
	let poses = [];

	// Create a webcam capture
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({
			video: true
		}).then(function(stream) {
			video.srcObject = stream;
			video.play();
		});
	}



	if (navigator.requestMIDIAccess) {
		console.log('This browser supports WebMIDI!');
	} else {
		console.log('WebMIDI is not supported in this browser.');
	}


	refreshMidiOuts = function() {
		connect()
	}

	WebMidi.enable(function(err) {
		refreshMidiOuts();
	});

	function sendCC(chan, val) {
		// MIDI devices that you send data to.
		console.log("sending!")
		// try {
		// 	WebMidi.outputs[0].sendControlChange(chan, val)
		// } catch (e) {
		// 	console.log("sending midi data error")
		// 	console.log(e)
		// }

		const NOTE_ON = 0x90;
		const NOTE_OFF = 0x80;

		const device = midiOut[selectOut.selectedIndex];
		const msgOn = [NOTE_ON, pitch, velocity];
		const msgOff = [NOTE_ON, pitch, velocity];

		// First send the note on;
		device.send(msgOn);

		// Then send the note off. You can send this separately if you want 
		// (i.e. when the button is released)
		device.send(msgOff, Date.now() + duration);
	}


	// A function to draw the video and poses into the canvas.
	// This function is independent of the result of posenet
	// This way the video will not seem slow if poseNet 
	// is not detecting a position
	function drawCameraIntoCanvas() {
		// Draw the video element into the canvas
		ctx.drawImage(video, 0, 0, 640, 480);
		$scope.chiliSpicy(poses)
		// We can call both functions to draw all keypoints and the skeletons
		drawKeypoints();
		window.requestAnimationFrame(drawCameraIntoCanvas);
	}
	// Loop over the drawCameraIntoCanvas function
	drawCameraIntoCanvas();

	// Create a new poseNet method with a single detection
	const poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', gotPoses);

	// A function that gets called every time there's an update from the model
	function gotPoses(results) {
		poses = results;
	}

	function modelReady() {
		console.log("model ready")
		poseNet.multiPose(video)
	}

	function angleBetweenTwoPoints(a, b) {
		angleOfPoints = Math.atan((a.x - b.x) / (a.y - b.y)) * (180 / Math.PI) / 90;
		if (angleOfPoints > 0) {
			angleOfPoints = 1 - angleOfPoints
		} else {
			angleOfPoints = -1 * (1 + angleOfPoints)
		}
		angleOfPoints = (angleOfPoints) * 64 + 64
		return angleOfPoints
	}

	function angleBetweenThreePoints(A, B, C) {
		var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
		var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
		var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
		return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI) * (127 / 180.0);
	}

	// A function to draw ellipses over the detected keypoints
	function drawKeypoints() {
		// console.log(poses)
		if (poses.length > 0) {
			pose = poses[0].pose;
			// console.log(pose);
			angleOfHead = angleBetweenTwoPoints(pose.rightEye, pose.leftEye)
			// sendCC(12, angleOfHead / 180.0, "angleOfHead")
			angleOfHead = Math.round(angleOfHead)

			angleOfTorso = angleBetweenTwoPoints(pose.rightShoulder, pose.leftShoulder)
			// sendCC(13, angleOfTorso / 180.0, "angleOfHead")
			angleOfTorso = Math.round(angleOfTorso)

			angleOfHips = angleBetweenTwoPoints(pose.rightHip, pose.leftHip)
			// sendCC(14, angleOfHips / 180.0, "angleOfHead")
			angleOfHips = Math.round(angleOfHips)

			rightArmRaised = angleBetweenThreePoints(pose.rightWrist, pose.rightShoulder, pose.rightHip)
			// sendCC(15, rightArmRaised / 180.0, "angleOfHead")
			rightArmRaised = Math.round(rightArmRaised)

			leftArmRaised = angleBetweenThreePoints(pose.leftWrist, pose.leftShoulder, pose.leftHip)
			// sendCC(16, leftArmRaised / 180.0, "angleOfHead")
			leftArmRaised = Math.round(leftArmRaised)

			rightArmOpen = angleBetweenThreePoints(pose.rightWrist, pose.rightElbow, pose.rightShoulder)
			// sendCC(17, rightArmOpen / 180.0, "angleOfHead")
			rightArmOpen = Math.round(rightArmOpen)

			leftArmOpen = angleBetweenThreePoints(pose.leftWrist, pose.leftElbow, pose.leftShoulder)
			// sendCC(18, leftArmOpen / 180.0, "angleOfHead")
			leftArmOpen = Math.round(leftArmOpen)

			rightKneeOpen = angleBetweenThreePoints(pose.rightAnkle, pose.rightKnee, pose.rightHip)
			// sendCC(19, rightKneeOpen / 180.0, "angleOfHead")
			rightKneeOpen = Math.round(rightKneeOpen)

			leftKneeOpen = angleBetweenThreePoints(pose.leftAnkle, pose.leftKnee, pose.leftHip)
			// sendCC(20, leftKneeOpen / 180.0, "angleOfHead")
			leftKneeOpen = Math.round(leftKneeOpen)

			rightLegRaised = angleBetweenThreePoints(pose.rightAnkle, pose.rightHip, {
				'x': pose.rightHip.x,
				'y': pose.rightHip.y + 10
			})
			// sendCC(21, rightLegRaised / 180.0, "angleOfHead")
			rightLegRaised = Math.round(rightLegRaised)

			leftLegRaised = angleBetweenThreePoints(pose.leftAnkle, pose.leftHip, {
				'x': pose.leftHip.x,
				'y': pose.leftHip.y + 10
			})
			leftLegRaised = Math.round(leftLegRaised)

			pos = {
				angleOfHead,
				angleOfTorso,
				angleOfHips,
				leftArmRaised,
				rightArmRaised,
				rightArmOpen,
				leftArmOpen,
				rightKneeOpen,
				leftKneeOpen,
				rightLegRaised,
				leftLegRaised
			}
			// console.log(pos);
			rawData = {
				nose: pose.nose,
				leftEye: pose.leftEye,
				rightEye: pose.rightEye,
				leftEar: pose.leftEar,
				rightEar: pose.rightEar,
				leftShoulder: pose.leftShoulder,
				rightShoulder: pose.rightShoulder,
				leftElbow: pose.leftElbow,
				rightElbow: pose.rightElbow,
				leftWrist: pose.leftWrist,
				rightWrist: pose.rightWrist,
				leftHip: pose.leftHip,
				rightHip: pose.rightHip,
				leftKnee: pose.leftKnee,
				rightKnee: pose.rightKnee,
				leftAnkle: pose.leftAnkle,
				rightAnkle: pose.rightAnkle
			}
			postData('/dance', {
				pos: pos,
				raw: rawData
			})
			// For each pose detected, loop through all the keypoints
			for (let j = 0; j < pose.keypoints.length; j++) {
				let keypoint = pose.keypoints[j];
				// Only draw an ellipse is the pose probability is bigger than 0.2
				if (keypoint.score > 0.05) {
					RECTSIZE = 5
					ctx.strokeRect(keypoint.position.x - RECTSIZE, keypoint.position.y - RECTSIZE, RECTSIZE * 2, RECTSIZE * 2);
				}
			}
		}
	}

});