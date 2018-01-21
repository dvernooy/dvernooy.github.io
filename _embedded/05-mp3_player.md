---
title: "MP3 4me"
published: false
subtitle: "10 years behind the iPOD"
permalink: /projects/mp3/
excerpt: "A homebrew MP3 player"
last_modified_at: 2014-08-09
redirect_from:
  - /theme-setup/
toc: true
---
> pic

## Project overview
> always 15 years behind ... suspend your disbelief
## S.T.E.M.
### MP3's - spec
### File systems

## Hardware
### Circuit diagram
### Codec VS1333
### SD cards & interfaces
### Battery Charger
### Buttons
### Packaging
### Input responsiveness
### Hardware pictures
### Layout
Believe it or not, this is one circuit layout I actually thought about & planned a little bit. Screen, DSP/codec + audio jacks, micro, buttons, battery charger & usb input, lipo battery and SD card were the real estate hogs. And I wanted it really small and thin. Here are the initial sketches I made to try to figure out nominally where stuff should go -
>> sketches

Here are a few pics of the final pcb build
>> build
### Skin - dollar tree foam board




## Software
### User Interface
### Embedded file system - FatFS
Respect. That's all I can say for ELM-Chan and his file system library (among other things). It is awesome. The learning curve is pretty steep for a weekend hacker like me, and I climbed that sucker. But to have a fully featured file system available at my beck and call to deal with SD card read/writes, in an 8-bit microcontroller was really cool. Let me start from the beginning.



### Digital signal processing
### MP3 file parsing
### Multiple items on SPI bus, actually using it
### Organizing songs, ordering them alphabetically
### Random function

## Stuff I learned
### Binary mode of FTP
Ok, so this is really stupid. But I was sending a bunch of audio files from a PC to a Mac over our home network using ftp. Why? don't ask. So I started playing them on my player and it was filled with all these snap, crackle, pops. Are you kidding me? So I spent about 2 days testing every component on the board, all kinds of test software, etc.., etc.. Nothing. Didn't think to test the files themselves. Of course, turns out that ftp sends files in ascii by default. I actually knew that but on this batch forgot to switch to binary. Awesome.

### Buffer sizes & overflows
In order to get the smoothest playback possible, it was important to send the DSP the largest chunk of mp3 I could to playback at any given time. We're dealing with an 8-bit micro here, folks, with 2K of SRAM, so even a 500 byte buffer is large. I ended up overflowing the stack on multiple occasions, which had me scratching my head until I got smart about tracking the resource usage.
