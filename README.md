# GameScience

Overview
SpeechEasy is a software and hardware solution designed to help international students alleviate speech anxiety during presentations. The system consists of two components:

Web-based Prompter: A user-friendly web interface where students can upload their speech scripts. During the presentation, the prompter displays the script and provides real-time visual encouragement when the audience interacts with the system.

Arduino-based Hardware: The physical component of the system involves buttons placed on desks in the classroom. When students press these buttons, a servo-driven encouragement device is activated. Simultaneously, the speaker receives supportive messages and icons in their web-based prompter.

Components
Arduino Hardware:

The Arduino script monitors button presses and controls the servo motor to give visual encouragement.
The servo moves incrementally with each button press, giving the speaker the impression of rising encouragement.
Once all buttons are pressed, a "reset" occurs, readying the system for the next session.
Web Prompter:

The web application displays the script during presentations.
Encouragement messages and icons are sent to the screen based on input from the Arduino setup.
Requirements
Hardware:
Arduino Uno or similar microcontroller
Servo motor
Push buttons
Resistors (for the buttons)
Software:
Arduino IDE (for uploading the code to the microcontroller)
Web browser (for using the prompter interface)
Installation
Hardware Setup:
Connect the buttons to the Arduino as described in the Arduino_Codebase.ino file.
Attach the servo motor to pin 9 of the Arduino.
Upload the code to the Arduino using the Arduino IDE.
Web Application:
The web application consists of an index.html, styles.css, and script.js file located in the Scripter folder. Open the index.html file in a web browser to use the prompter interface.
How It Works
Hardware (Arduino):

When any button is pressed, the servo rotates 30 degrees, and a message is sent via serial communication to the web application.
After three button presses, the system resets for the next use.
Web Application:

The prompter displays real-time feedback as the speaker gives their presentation.
Upon receiving serial communication from the Arduino hardware, supportive messages are displayed on the prompter to boost the speaker’s confidence.
File Structure
Arduino_Codebase.ino: Arduino code responsible for reading button presses and controlling the servo motor.
Scripter Folder:
.vscode: Settings for the development environment.
image: Contains any images/icons used for encouragement.
index.html: The main HTML file for the web-based prompter.
script.js: JavaScript file that handles the communication between the Arduino and the prompter.
styles.css: Styling for the prompter interface.
