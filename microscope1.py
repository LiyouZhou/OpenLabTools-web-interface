#!/usr/bin/env python
# -*- coding: utf-8 -*-
import serial
class Microscope():
    def __init__(self):
        self.temp = 1
        self.set_temp = self.temp
        self.control_temp = True
        self.ser = serial.Serial(0)
        #possibly change the above line to be relevant to the arduino serial port

    def __del__(self):
        self.ser.close();
        #destructing the class, closing down 
        #the serial connection to avoid things getting bad 

    def motion_control(self, direction="Down"):
        return direction

    def get_temp(self):
        self.ser.write(1)#tells the arduino to the read the temperature
        self.temp=self.ser.readline()
        return self.temp

    def set_set_temp(self, temp):
        self.set_temp = float(temp)
        return self.set_temp

    def get_set_temp(self):
        return self.set_temp

    def control_temp_toggle(self):
        self.control_temp = not self.control_temp
        return self.control_temp

    
if __name__ == "__main__":
    r = Microscope()