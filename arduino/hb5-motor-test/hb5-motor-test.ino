
#define DIRECTION_LEFT 6
#define DIRECTION_RIGHT 9
#define VALIDATION_LEFT 10
#define VALIDATION_RIGHT 11

int motor_speed_left=80;
int motor_speed_right=50;
int counter = 0;
boolean direction_left = false;

void setup(){
  
 Serial.begin(9600); // Initialization of the serial monitor
 pinMode(DIRECTION_LEFT,OUTPUT); 
 pinMode(DIRECTION_RIGHT,OUTPUT); 
 pinMode(VALIDATION_LEFT,OUTPUT);
 pinMode(VALIDATION_RIGHT,OUTPUT); 
}

void loop(){

if (counter==6){
  counter=0;
  direction_left = !direction_left;
  digitalWrite(DIRECTION_LEFT, direction_left); 
//  if (motor_speed >= 250) {
//  motor_speed = 0;
//}
//  motor_speed += 15;
}


//digitalWrite(DIRECTION_RIGHT,HIGH); 

analogWrite(VALIDATION_LEFT, motor_speed_left);
analogWrite(VALIDATION_RIGHT, motor_speed_right);
delay(100);

counter++;
}
