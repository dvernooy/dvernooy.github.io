---
title: "OBD-II 4u"
published: false
subtitle: "The journey of 1000 miles"
permalink: /projects/obd-ii/
excerpt: "Hacking my car"
last_modified_at: 2012-02-01
redirect_from:
  - /theme-setup/
toc: true
---

>> picture of my OBD2 up close in action

## Project overview

Have you ever seen that poster of the grizzly bear with the salmon in its mouth, subcaptioned "Sometimes the journey of 1000 miles ends very, very badly"? Well \[spoiler alert\], this is one of those journeys. The OBD-II interface that I spent about 10 months hacking - relatively successfully - is no longer used in cars. So if you want to skip this one, feel free. Otherwise, I'll take you on my journey to hack the car. Four things I wanted to see happen:

1. A huge display that would tell us the fuel costs of running the car, real time. Like this:

>  picture of output in van

2. Typical gas mileage for our car & minivan

> ![]({{ site.url }}/assetsimages/projects/OBD2/mpg-camry.png)
*And the answer is .... 59.7 mph*

3. Some real-time output telemetry from the car while we were driving

> example

4. And, of course, the check engine light ... and more to the point, my desire to figure out which code was causing it, & then douse it.

> Video of me getting rid of the check engine light.

## S.T.E.M.
### Raw materials - What I was working with - Toyotas

### The basics - MAF, MAP, etc...

### Introduction to OBD2
On Board diagnostics
#### OBD2 connector
> picture of OBD2 pinout and connector in car

#### OBD2 protocols, timing and handshaking
> timing flow
#### CEL codes
>list of codes
#### OBD2 PIDs (parameter IDs)

## Hardware - circuit diagram

### LCD

### Serial interface

### package

### J line and K line

### Testing car-back-car-back

### Success ... got 0x55

## Software
### Averaging stuff

### Menus, buttons

### Settings & EEPROM

### Polling vs. Interrupts

### Features & Screens

### Code flashing & updating - ISP, STK500

## Final thoughts

### CAN bus
