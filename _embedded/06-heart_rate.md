---
title: "Heart Rate Monitor"
published: true
subtitle: "Still working after all these years"
permalink: /projects/HRM/
excerpt: "Still working after all these years"
last_modified_at: 2013-04-12
comments: true
redirect_from:
  - /theme-setup/
toc: true
---
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

![]({{ site.url }}/assets/images/screenshot.png)
*MacGyver.. eat your heart out*

## Project overview
Welcome to my heartrate monitor project - these things have been around for a long time & you can buy them now for about $15 & get all kinds of software, etc... so if you want to start measuring your heartrate, stop reading this, go buy one and have fun! Otherwise, stay tuned for all of the trials and tribulations of DIY'ing a heartrate monitor.

This project started as a shotgun marriage between a dead Nokia 2115i cellphone and a chest strap for an old Polar T6 heartrate monitor - both of which were lying around. I thought .. what better way to kill a couple of Saturdays then try to build my own receiver using the LCD out of the cell phone. Little did I know the long & winding road .. and if you're still with me, you'll know that navigating that winding road is where the real fun is!!!

The end result was not super pretty looking, but it was such a fun project I thought I'd take you through it from soup to nuts. If you're already laughing at me for doing this (i.e., hey, dude ... Polar has been making these things since the early '80s, where have you been & by the way, ever heard of Fitbit), you'll laugh harder when you see the picture below of the receiver on my bike:

![]({{ site.url }}/assets/images/bike_view.png)
*Nothing unusual to see here, move along*

Here are a couple of charts of my heart rate vs. time for the 90 min bike ride near my house, along with a plot of the elevation - pretty good correlation between the two. I used to be a climber.

![]({{ site.url }}/assets/images/correlation.png)
*Pretty good match between hills & workout ... duh, whaddya expect?*

Here we go ... time for some fun.

## Hardware
Here's how I built up my understanding, piece by piece.

### Polar T6, talk to me
I had no idea what the old Polar T6 transmitter did or how it worked, so I opened it up - I didn't take a picture, but this "x-ray" picture (below the photo of the actual transmitter) that I found on the web is pretty similar to what I saw inside. The key feature here is that coil on the bottom ... especially the magnetic field pattern that it creates (dashed lines):

![]({{ site.url }}/assets/images/transmitter.png)
*Heart rate monitor transmitter*

Armed with some background that many of these transmitters work at 5.3kHz, I did a couple of experiments after I had changed out the battery and made some modifications to the chest strap, which was in rough shape.
 
![]({{ site.url }}/assets/images/strap.jpg)
*Oh yeah, and this new chest strap looks so awesome*
 

I directly wired this other old coil I had lying around into my oscilloscope
  
![]({{ site.url }}/assets/images/coil-sniff.jpg)
*The coil I used to understand the transmitter*

I held the coil over top of the transmitter piece as it was attached to my chest. Here is what I saw on the scope:

![]({{ site.url }}/assets/images/zoom0.jpg)
*My heart be still! ... I'm alive*

Heartbeats! ... spaced about 1 second apart. After zooming in further, here's what the waveform looked like:

![]({{ site.url }}/assets/images/scope_shots.png)
*Successive zoom-ins on the oscilloscope while using the coil to see what the transmitter was doing*

Interesting, it has some significant structure to it. Overall time of the heartbeat signal is about 8 ms, with the main bursts at 5.3 kHz interrupted by much shorter bursts at about 300kHz. It might be coded or something. Wanting to move forward, I decided just to build a 5.3 kHz receiver & not worry about understanding the coding, because if I could reliably detect those 5.3 kHz bursts, I'd have my heartrate. So how do you detect a 5.3 kHz electrical signal? 

### Resonant magnetic coupling

A couple of things I noticed in my experiments:
>as I moved the inductor even a few inches away, the signal faded ... a sign of non-resonant coupling. 

>as I rotated the inductor 90 degrees, it was pretty easy to kill the signal altogether ... a clue that the (electro)magnetic field orientation was important. 

Well, the current the transmitter is driving through that inductor in the transmitter is creating a time-varying magnetic field. If I could interrupt those magnetic field lines with another inductor (just like I did in my experiment), I can detect that burst. However, I want it to work a few meters away .. and the only way to do that was to "tune" the receiver circuit to the exact transmitter frequency of 5.3kHz, while keeping the inductor $$L$$ as large as practically possible. The way to do this is with an $$LC$$ tank circuit, whose resonant frequency is 

$$
\begin{align*}
& f = \frac{1}{2 \pi \sqrt{LC}}
\end{align*}
$$

### Inductors
The formula for inductance of a wound coil is:

$$
\begin{align*}
 & L = \frac{\mu N^2 A}{l}
\end{align*}
$$

where $$N$$ is the number of turns, $$A$$ is the area, $$l$$ is the length and $$\mu$$ is the relative permeability. So the number of turns are a big deal.I had a ferrite core about an inch long, with a permeability multiplier of about 16, which meant for 1000 turns of coil I should expect 24 mH. The one I built measured 19mH, which required a 47nF capacitor to resonate at 5.3kHz. I used the frequency sweep on my benchtop function generator to tune this to 5.3Khz using trial and error on the capacitance. Putting the two in parallel, I could now sense the signal from more than a meter away, which was a very good start! Time to build the rest of the receiver.

### Analog receiver
Here is the circuit I built, with credit to Rick Moll. I think he had this posted many years ago, but I can't find that link anymore. If I do, I'll put it here. 

[![]({{ site.url }}/assets/images/HRM-circuit.jpg)]({{ site.url }}/assets/images/HRM-circuit.jpg)
<span style="color:red; font-size: 75%"> <em>Circuit diagram for HRM receiver</em></span>

The main idea is to amplify & filter the ac signal (first two op-amp stages), then do peak detection with a diode.  It is all done with a single supply (I used LM324's instead of the LM660C's) so a virtual ground of 2.5V (assuming Vcc of 5V) is used at each of the first 4 stages followed by a buffer/level shifter suitable for the microcontroller ADC input.

I reduced the gain compared to this circuit, and of course my resonator values were different, but the rest was very similar. I didn't spend any time laying out a board anything, but did it all "dead bug" style on a  piece of copper clad board. Not pretty, but fast to build and it works well.
 
 If I get time, I'll add a few screen shots of the receiver waveform output, but now I had something a digital circuit could deal with.

### Nokia 2115i LCD 
After a huge amount of googling, I found out that the mono LCD was from a Nokia 2115i cell phone (same pinout as 1100/1600/1200). It had a special Hirose DF23-10 connector that I needed an adapter for 

![]({{ site.url }}/assets/images/lcd_pinout.png)
*Essential to avoiding smoke ... pinout for LCD*

and, most importantly, I found out it used the Philips PCF8814 96x65 pixel LCD driver. The spec sheet for this driver was indispensible - I was able to use it to bit-bang the SPI interface. The spec is posted with the code.

![]({{ site.url }}/assets/images/PCF8814.png)
*pages 26-29 of PCF8814 spec ... dog-eared at the end of this project*


### Supporting character set
I used a spreadsheet to build my own character bitmap set for the LCD, along with a few custom "graphics" ... a bike and a heart that you can see on the LCD. I've also included this spreadsheet with the code.

![]({{ site.url }}/assets/images/icon_bitmap.png)
*From raw material to finished product ... WYSIWYG*

### Microcontroller
And the rest of the circuit is based on the Atmel ATmega88 microcontroller. I used the built in an 8MHz clock and ran the whole thing off of 3.3V. I included the ability for remote programming via an SPI header (visible in the screenshot above). Though probably unnecessary, I also separated the power supplies for the analog and digital sections (two different battery packs). The final circuit is here:

There are a bunch of things I learned building this, like:
> ground the reset pin through 10kohms

> reference the ADC with an analog reference

> make the EEPROM readable & write the software so you can read it out 

## Software
### Code
All the code is posted [here](https://www.github.com/dvernooy/heart_rate_monitor/). It is actually just one C file. You can call it ugly (it is), you can call it unreadable (it is) ... but it works, & very robustly. Maybe some day I'll clean it up. If you actually do read it, all the action is in a single main() loop. Here are the details...


### Detecting a beat
My starting point now was the analog signal (masquerading basically as a digital signal at this point due to the speed and gain of my receiver) that rose and saturated very quickly when a 5.3kHz burst was detected. The saturated voltage is about 4.7V at the upper rail of the last stage op-amp (I used a 5V regulated supply for the analog portion). I fed this waveform into the analog-to-digital converter of the Atmega88 and compared it to a software threshold that I set to determine whether it was a real heart beat signal. 

To measure the timing between heartbeats, I had a choice of whether to do an interrupt driven timing scheme, or a polling-based scheme. I opted for a polling based scheme simply because I was really early in understanding how all of this was going to work and I found it to be the most flexible way of dealing with some of the tricky bits (below) that arose. In hindsight, it would be fun to convert to an interrupt-driven approach. 

Every time through the master polling loop, I took an analog to digital converter (ADC) measurement and compared it to a threshold value. If it was above the threshold, I had a hit. In order to turn this into a time measurement (and eventually a beats-per-minute (bpm)rate), I used the polling loop counter (whose counter variable was $$H$$), which I calibrated offline by feeding my software a fake heartbeat signal from a function generator that simulated a range of heartbeats from 30bpm to 200bpm, and figured out the calibration constant corresponding to one pass through the loop. The polling loop was 1.61ms long, so it would be 1245 polling loops for a heart rate of 30bpm and ~ 185 polling loops for 200bpm. If you read the code, that is where the factor 37312 comes from. So how did I get such a long polling loop time, and, more importantly, since it is really the master timer, not have it change from loop to loop? More on this later.

There were actually a number of practical tricky bits to deal with to make this algorithm robust. I'll explain how I dealt with them one by one, but it is probably best to start with a timing diagram/sketch.

![]({{ site.url }}/assets/images/timing.png)
*Details about how the code is structured(??) to be robust*

### Tricky bits
> Make sure I didn't get "double counts" from the heartbeat waveform, which as we already saw is very "bursty"

I used a dead zone of $$M$$ counts long right after the first detection. This meant the software would ignore any subsequent ADC hits for the next $$M$$ polling loops. I used a counter $$G$$ to countdown from $$M$$ to zero. I also made the length of the dead zone dynamic .. i.e., heart rate dependent ... it needed to get shorter as the heartbeats kept coming faster and faster in order to detect them & not miss.

> Make sure an appropriate threshold was set to know that I had a real heartbeat

I kept track of highest ADC value we got the last time through the loop (remember, it is measured every polling loop) and right before the deadzone ends and we're ready to start detecting again, I reset the threshold to half of that value.

> Handle a "loss of lock" on the heart rate & recover it

Ok, so I'm riding on my regular route on a bike path and I notice a drop-out at a couple particular sections. Here is a google map view of one of them, anyone see the issue? 

![]({{ site.url }}/assets/images/power_lines.png)
*Not a friend, an enEMI*

Yeah, overhead or underground power lines, especially those running somewhat parallel to my route, carry a current that generates a magnetic field that induces more currents in my receiver that swamp the receiver. Even though its not resonant, it causes large enough noise to wreak havoc. So how to recover the heartbeat in a case like this, especially in an extreme case where my heartbeat changes alot during this interval?

I set an absolute lower limit on the detector threshold so as not to trigger on noise, but if the heartbeat loop counter $$H$$ exceeded a maximum determined by the previous hearbeat interval, I start to allow the detection threshold to drop, & I continue aggressively dropping the detection threshold until it reaches a pre-determined lower limit. This allows the system to re-lock. I also use the same pre-determined lower limit to establish initial lock & the re-set the baseline after the first few beats.

> Give myself a visual indication that all of this was working

I decided that a beating heart (what else!) and the heartrate number in a huge font was the way to go. So I designed a heart icon and had it display for half of the heartrate interval. Hoewever, *every time* through the software polling loop I wrote both the heart rate number and - either the heart icon or a blank signal icon. This way, the same amount of delay was introduced for each loop. In fact, the time to write these things were by far the dominant delay in the loop and accounted for the 1.6ms polling loop time. So taking care to make them the same loop to loop was important (again, maybe a reason to go to an interrupt method in the future). 

> Capture the heartrate information so I could look at it after the exercise period

Funny enough, I did implement an interrupt-driven procedure for probably the *least* critical thing - saving the heartrate to the EEPROM. Yes, I'm backwards sometimes. Anyways, I only had 500 bytes of EEPROM available, so I sampled the heartrate every 3 seconds, averaged 4 of these samples, and then every 12 seconds (every 4th sample) wrote the average as one byte (0..255) to the EEPROM. This lets me exercise for 100 minutes and capture my heartrate that whole time. I just read the whole thing out at the end over the SPI interface and plot it in a spreadsheet.

> Make sure everything worked for the dynamic range of heartrates from 30 bpm to 200 bpm

I used my offline signal generator to test out the algorithm across this large range. That worked well, rather than me having to work up a sweat every time I tweaked something.

> Make sure that as my heartrate changed during exercise, the monitor could follow it robustly

This last question requires its own section ...

### ... Heart rate following algorithm
One of the more interesting challenges was to figure out how to follow changes in heart rate in a robust way that had a good user experience. I noticed my heartbeat could jump by ~ 20 beats per minute in only a few seconds when exercising and I'd want my sensor to follow this reasonably well. So here's what I did. I first decided that, independent of what my current heartrate was, I wanted the monitor to settle within 5% of the new heartrate within about 8 seconds. That seemed reasonable for any application I had in mind. So, each new measurement gave me a new instantaneous heartrate interval (called $$J$$ in the code). So I wanted to update the current heartrate $$K$$ to the new heartrate $$J$$. So the current error $$ e = J-K$$ and at every heartbeat I wanted to update $$K$$ by adding to it a certain percentage $$f$$ of this error. If you add it all at once, the display bounces around like crazy & drives you crazy. If you add too little, its like you have an unresponsive monitor. 

So how much to add? Well, I knew I wanted to close the gap to within 5% in 8 seconds. So the number of heartbeat intervals required is $$8K$$. At each new measurement, we want to update $$K$$ so

$$
\begin{align*}
K_1 = K_0+fe = K_0+f(J-K_0) 
\end{align*}
$$

and the gap to $$J$$ after 1 heartbeat interval is

$$
\begin{align*}
J-K_1 = (1-f)(J-K_0)
\end{align*}
$$

After 2 heartbeats the update is
 
$$
\begin{align*}
K_2 = K_1+f(J-K_1) = K_0 + 2f(J-K_0)-f^2(J-K) 
\end{align*}
$$ 

so the gap to $$J$$ is

$$
\begin{align*}
J-K_2 =(1-f)^2(J-K_0)
\end{align*}
$$ 
 
You can see where this is headed. After the 8 seconds, or the $$n = 8K$$ heart beats, the gap is $$(1-f)^n(J-K_0)$$. But I wanted this to be 5%. So we get the equation that $$(1-f)^{8K}=0.05$$ and we can solve this for
 
$$
\begin{align*}
 f = 1-e^{\frac{ln(0.05)}{8K}} 
\end{align*}
$$ 

which gives us the update factor $$f$$ to use at every single step, given $$K$$. Finally, every step, we know $$K$$ from the previous step, we measure $$J$$ and we apply an update 

$$
\begin{align*}
K = K +f(J-K)= K + (1-e^{\frac{ln(0.05)}{8K}} )(J-K) 
\end{align*}
$$ 

Below is a screenshots of a model of how this algorithm settles.

![]({{ site.url }}/assets/images/simulation.png)
*Following the telltale heart*

This algorithm guarantees a nice display that follows the heartbeat changes well. There is one hill around our house where I can go from 135bpm to 185bpm in about 15 seconds - & my monitor follows it well. The only technical issue in implementation is that I had to use real precision math, but that could always be changed to integer math at some point.

### Last thoughts

I am thinking about making major changes - learn by (re)doing & all that - to the packaging & code at some point ... or maybe I'll buy a fitbit. It has 10X the functionality at 1/10th the hassle. All of the code & spreadsheets are posted [here](https://www.github.com/dvernooy/heart_rate_monitor/). Enjoy.
