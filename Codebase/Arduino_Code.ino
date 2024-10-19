#include <Servo.h>

Servo myServo;  // Create a Servo object
int buttonPins[] = {2, 3, 4};  // Three buttons connected to pins 2, 3, 4
bool buttonState[] = {false, false, false};  // Keep track of whether each button has been pressed
int pressCount = 0;  // Count of button presses
bool allPressed = false;  // Flag to indicate whether all buttons have been pressed

void setup() {
  myServo.attach(9);  // Attach the servo to pin 9
  myServo.write(0);  // Initial servo position set to 0 degrees
  Serial.begin(9600);  // Initialize serial communication
  for (int i = 0; i < 3; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);  // Use internal pull-up resistors
  }
}

void loop() {
  // If all buttons haven't been pressed yet
  if (!allPressed) {
    for (int i = 0; i < 3; i++) {
      int reading = digitalRead(buttonPins[i]);

      // Check if the button goes from unpressed (HIGH) to pressed (LOW)
      if (reading == LOW && !buttonState[i]) {
        buttonState[i] = true;  // Mark this button as pressed
        pressCount++;  // Increase the press count

        if (pressCount <= 3) {
          // Rotate the servo by 30 degrees for each press
          myServo.write(pressCount * 30);
        }

        // Send "K" via serial communication after pressing the button
        Serial.println('K');

        // If all three buttons are pressed, set the flag to true
        if (pressCount == 3) {
          allPressed = true;
        }

        delay(200);  // Debounce delay
      }
    }
  } else {
    // After all buttons have been pressed, pressing any button resets the servo to 0 degrees
    for (int i = 0; i < 3; i++) {
      int reading = digitalRead(buttonPins[i]);

      // After pressing any button, reset the servo to 0 degrees and reset states
      if (reading == LOW) {
        myServo.write(0);  // Reset the servo to 0 degrees
        delay(500);  // Wait for the servo to complete the reset

        // Reset all flags and press count
        for (int j = 0; j < 3; j++) {
          buttonState[j] = false;
        }
        pressCount = 0;  // Reset press count
        allPressed = false;  // Reset the flag
        break;
      }
    }
  }
}
