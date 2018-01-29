---
title: "Home Energy Monitoring"
published: false
subtitle: "Its all a bunch of hot air"
permalink: /projects/home_energy/
excerpt: "Monitoring home energy usage"
last_modified_at: 2015-09-01
redirect_from:
  - /theme-setup/
toc: true
---

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

![]({{ site.url }}/assets/images/projects/home_energy/screenshot.jpg)
*Keeping tabs*

![]({{ site.url }}/assets/images/projects/home_energy/hardware.jpg)
*Sight for sore eyes ... or eye sore?*

## Project overview

Winter months in the Northeast US give you plenty of time to sit around and come up with your next project. It starts with a simple questions.

Like,

> How much energy are we using **right now**?

Kinda like [the Cuckoo's Egg](https://en.wikipedia.org/wiki/The_Cuckoo%27s_Egg). Where did my 75 cents go?

After noodling on that, I backed myself into it by getting most of the piece parts together and then shamed myself into building it. In the end, it was another really fun project. In fact, it was probably the best mix of hardware and software to date, and is probably not done yet.

But this one deserves some commentary.

## S.T.E.M.
### Heat ... + gas

To really answer this question, I knew that most energy usage comes from heating and cooling. Our fridge, oven and dryer run on electricity. Our stove (range), fireplace and furnace run on natural gas. So I need to monitor both to get the answer I'm looking for. Ok, you eat an elephant one bite at a time.

### Electricity in the house

There are lots of ways to measure electricity usage in your home. By far the simplest is to find the single point where the electricity enters and monitor it there. The advantage is that you get "everything" and the monitoring need only be done at one spot. The disadvantage is that everything will be measured at once.

I also thought it would be cool to see what the individual appliances are doing (we'll come back to that), so the other option is to measure every endpoint (or at least the big ones). This requires more hardware but will allow the effects of each appliance to be more clear.

I went with the first solution. Easiest and fastest to implement. Cheap and fast, every time.

> fridge

 And then I end up re-doing it. I never learn.

### Home wiring

When you open up your electricity panel, there are generally two large wires that carry the current, and a third connection for ground. These two wires both carry 120 V at 60 Hz, but 180 degrees out of phase with each other. So this is sometimes referred to as "split phase 120V". So measuring between each wire and ground, you get 120V, but wire to wire is 240V. Most home appliances use one of the two 120V circuits. Some, like the oven, use 240V. Everything is oscillating at 60Hz.

Home wiring will divvy up the circuits between these two split phases, so it is important to monitor both of the phases and then "add together" the results.

> inside of panel

### Current detection

A wire that carries current generates a magnetic field. That field can be collected in a secondary magnetic circuit and be used to generate a current in another wire. This is called "transformer action", and a device that it designed to do this is called a current transformer (CT). CTs will come with a secondary current ratio rating. This means the (large and unsafe) current in the original wire can be back-calculated from this ratio, once you have measured the (much lower and safer) current in the CT.

So lets see if we can figure it out. We'll put a ring of magnetic material around the wire carrying our house current $$I_{1}$$. The magnetic field $$B$$ in that material (permeability $$\mu_{r}$$ at a distance $$R$$ from the wire) is

$$
\begin{align*}
B = \frac{\mu_{r} \mu_{0} I_{1}}{2\pi R}
\tag{1}
\label{magnetic}
\end{align*}
$$

We'll use that magnetic field to induce another current $$I_{2}$$ in our CT, which is really just a coil of $$N$$ turns of wire of inductance $$L$$ wrapped around that material. So, if that material has cross-sectional area $$A$$ the induced current is related to the flux $$\phi$$ by $$LI_{2} = N\phi$$, or

$$
\begin{align*}
I_{2} &= \frac{NBA}{L}\\
&=\frac{N \mu_{r} \mu_{0} I_{1} A}{2 \pi R L}
\end{align*}
$$

We're getting close. Inductance $$L$$ of an $$N$$ turn wire of length $$l$$ and cross-sectional area $$A$$ is

$$
\begin{align*}
L &= \frac{\mu_{r} \mu_{0} N^{2} A} {l}
\end{align*}
$$

so finally, the ratio of the currents is

$$
\begin{align*}
\frac{I_2}{I_1} &= (\frac {l}{2\pi R})(\frac{1}{N})
\end{align*}
$$

Assuming the coil extends mostly around the entire CT, $$l/2 \pi R$$ is close to 1, and the current ratio is very close to $$1/N$$. By the way, some of you will know this is sort of a circular (!) argument, not a real "proof" because I just pulled that inductance formula out of the air. But the end result is true.

In practice, we will use a resistor across the output of the CT, called a burden resistor. This will give us a voltage that we can measure with a microcontroller. It also protects the CT in case of a sudden power outage.

In order to get to our goal of energy consumption, we need also need to know the voltage to get the power. It would be best to measure both phases, but in practice the grid is "pretty stable", so we can just measure one of the voltages to get a phase reference, and assume the other leg is 180 degrees different.

### AC power calculations

Really what we want here is power. Power is voltage x current. Easy. Except everything here is AC at a frequency $$f=$$ 60 Hz, not DC. So we need to pay a bit of attention. Since we're monitoring each of the two 120V circuits independently, lets dive deeply into one of them. I'll choose circuit 1 and carry around a subscript 1 to remind us of that. The instantaneous voltage and current in circuit 1 are:

$$
\begin{align*}
v_{1}(t) &= V_{1}(t)\cos(2\pi f t)\\
i_{1}(t) &= I_{1}(t)\cos(2\pi f t+ \phi_{1}(t))
\end{align*}
$$

As a first little diversion, if you were to stick the wall plug directly into an oscilloscope that is following every move, you would find that the amplitude $$V_{1}(t)$$ is close to a constant 170V, and peak to peak the cosine wave would be double that. So where does the "120V" come from? Hold on for a min.

As another little diversion, the phase $$\phi_{1}(t)$$ tells you what type of load you have. If it is close to zero, the load is primarily resistive - like the heater in your toaster, or a light bulb, or the oven or dryer. If it is greater than zero, the load is inductive, like the motor in the washing machine, or the compressor motor in the fridge. If it is less than zero, the load is more capacitive - like perhaps the microwave.

Anyhoo, the instantaneous power is then

$$
\begin{align*}
P_{1}(t) &= v_{1}(t)i_{1}(t)
\end{align*}
$$

Really what we'd like to do is get the power averaged over the AC cycle to get a better snapshot of what's going on. A single AC cycle is $$T$$ = 1/60 Hz = 16.67 ms, which is pretty fast. If we average the voltage, and current over a cycle, both would be zero (it's AC!!!). But for the power we get

$$
\begin{align*}
\overline{P_{\text{1,cycle}}(t)} &= \frac{1}{T}\int_{t}^{t+T} (P_{1}(\tau) d\tau) \\
&= \frac{1}{2}V_{1}(t) I_{1}(t)\cos(\phi_{1}(t))
\end{align*}
$$

assuming $$V_{1}$$, $$I_{1}$$ & $$\phi$$ all varying slowly compared to the AC cycle. This number is the *real* power our circuit is consuming. Power you'd be willing to pay for. We can also independently calculate $$V_{1}(t)$$ and $$I_{1}(t)$$ by their "root mean square" (rms) value, where the mean is taken over a cycle.

$$
\begin{align*}
v_{1,rms}(t) &= \sqrt{(\frac{1}{T}\int_{t}^{t+T} v_{1}(\tau) d\tau)^2} \\
&=\frac{V_{1}(t)}{\sqrt{2}}\\
i_{1,rms}(t) &= \sqrt{(\frac{1}{T}\int_{t}^{t+T} i_{1}(\tau) d\tau)^2} \\
&=\frac{I_{1}(t)}{\sqrt{2}}\\
\end{align*}
$$

It turns out that these rms values are what a handheld multimeter will measure. More like an averaged voltage over a few cycles. If you calculate it out, you find $$v_{1,rms}(t) = V_{1}(t)/\sqrt{2}$$ = 120V. So that's where the 120V comes from. Almost any power engineer will only ever talk about rms values, not amplitudes or peak-to-peak values. We can now calculate the phase angle $$\phi_{1}(t)$$, which also called the **power factor**

$$
\begin{align*}
\cos(\phi_{1}(t)) &= \frac{\overline{P_{\text{1,cycle}}(t)}}{v_{1,rms}(t)i_{1,rms}(t)} \\
&= \text{power factor}
\end{align*}
$$

The *reactive* power in our home circuit is using is

$$
\begin{align*}
\overline{Q_{\text{1,cycle}}(t)} = \frac{1}{2}V_{1}(t) I_{1}(t)\sin(\phi_{1}(t)).
\end{align*}
$$

Again, this is a bit of a fictitious power. You can see it is only non-zero when phi is non-zero, and really represents the energy stored in the inductive (motor) and capacitive loads in the house. But it does tell us a lot about what appliances are being used. And the *apparent* power $$S$$ is just

$$
\begin{align*}
\overline{S_{\text{1,cycle}}(t)} &= v_{1,rms}(t)i_{1,rms}(t)\\
&=\sqrt{\overline{P_{\text{1,cycle}}(t)}^2 + \overline{Q_{\text{1,cycle}}(t)}^2}\\
\end{align*}
$$

In practice on the digital computer, I took snapshots of $$v_{1}(t)$$, and $$i_{1}(t)$$ over about 6 cycles instead of just one (at about 140 samples/cycle), and then did the averaging over these 8 cycles. A little bit less noise that way. And still pretty "instantaneous" since 4 cycles at 60Hz is still about 65 ms, or less than a tenth of a second.

Finally, the energy $$E$$ consumed is just power $$P$$ times time $$t$$. Since the power is changing every few seconds (or faster), we have to get a bit fancier. Over some time span $$t_{s}$$ much larger than a cycle $$T$$, the energy consumed in circuit 1 $$E_{1}(t_{s})$$ is

$$
\begin{align*}
E_{1}(t_{s}) &= \int_{t}^{t+t_{s}}\overline{P_{\text{1,cycle}}(\tau)}d\tau
\end{align*}
$$

This is the kind of thing is what computers were meant to do. Finally, if $$t_{s}$$ is a month, we'd just multiply $$E(t_{s})$$ times the cost of energy in $/kWh. All of this fancy math ends up in one number on your bill at the end of the month. So you are paying for real power. That's nice.

We can do all the same stuff above for the second circuit, remembering that the voltage for that circuit is

$$
\begin{align*}
v_{2}(t) &= V_{2}(t)\cos(2\pi f t)\\
&= -v_{1}(t)\\
 &= -V_{1}(t)\cos(2\pi f t)\\
\end{align*}
$$

and just add things up in the end.

### Gas Meters & gas usage

Our gas meter is one of these guys:

>

The hand spins around, and every revolution is one scft of gas flow. So if we can count the revolutions, we can just "count up" how much gas is being used.

How do you count the revolutions? I "opt"ed for a laser-based approach. The beam gets interrupted by the dial pointer and you can count the interruptions with a microcontroller.

Once you have it all counted up, its just a matter of understanding the cost per cubic foot.

### Internet serving

Finally, I wanted to be able to see all of this information in real time and decided that I wanted this device to have its own web page. So I needed an ethernet interface to my home network, as well as an embedded web server that will "serve up" the information to anyone who asks for it. A raspberry pi would have been one way to go, but I ended up staying with my 8-bit microcontroller. This has some drawbacks, but several really interesting benefits as well.

Web technologies are always the way to go, since they are supported by everything.

## Hardware

This project had more hardware than some I have done previously. I'll talk you through the interesting pieces, but first lets see the big picture.

### Circuit diagram - combined

Between the gas meter and the electricity monitor, we really have two circuits working together. Here is the overall circuit diagram of the system.

> circuit diagram

### Electricity - Current transformers

The current transformers (CTs) are pretty simple devices. The first step was to ensure they were working so I did a test. I didn't have a large AC test current handy, so I co-opted our vacuum cleaner. Then I took an old cord and separated the two wires and put the current clamp around one of them. If you put it around both, you won't read much since the current is delivered to the vacuum on one wire, and returned on the other wire. Enclose both with the CT means the total current inside is zero (in Equation 1) which essentially cancels the external magnetic field. So just use one. And then tape the cord back up. And vacuum while you're at it.

I just used an ac voltmeter to measure the secondary current directly. The current inside the CT (the transformer "secondary") is much less than the primary because of the turns ratio, so for a 20A draw on the mains (at 60Hz), the current in the secondary is XX mA (still at 60 Hz).

Accounting for the calibration constant on the CT, I found that the current draw matched reasonably well the rating on the vacuum cleaner. I also discovered that one CT read about 9% lower than the other, which I'd need to account for in the code. The other interesting thing is that the current transformers have a "direction" (Lenz's law), so I'd have to either pay attention and get that right, or have some minus signs in my software.

Next step was to add a burden resistor to measure voltage instead of current, and get the calibration constants correct. An XX kohm resistor gives an ac voltage of YY mV in the secondary circuit, which is now well within the range of our microcontroller.

Finally, time for the electrical panel. The pictures below show the guts of our electrical panel, the equivalent circuit diagram and the mounting of the CTs.

> electric panel: labeling, equiv circuit, ct closeups

### Electricity - Voltage measurement

With current out of the way, time to measure voltage. We know the voltage is 120V, so why measure anything? Because to get the instantaneous real and reactive power draws we really need to be sampling the voltage signal, because it is the relative positions of the current and voltage in time that matter.

A simple way to do this is to pick any sub-circuit in the home, and measure its voltage with respect to the system neutral wire. You can see that here:

>voltage wiring

Now that wire is sitting at (a dangerous) 120V, so you want to "divide it down" with a voltage divider circuit to get something safe to work with.

In principle, I should do this also for the other phase, but I made the assumption that the voltage on the other phase was just 180 degrees from the one I chose.

You can see that in the code:

>code

### Electricity - interface circuit

Now that we've picked off our current and voltage signals, we need to digitize them so our software can kick in. These are AC signals, so we want to convert them to DC. I knew the microcontroller was going to be powered from a stable 5V supply, so we can bias each of the 3 ac signals to 2.5V to be "mid-range". As long as their amplitude is not greater than 2.5V, we should have no trouble with the analog to digital conversion. A simple way to do this is to buffer each with an op-amp, biased at the supply mid-point. That's what I did:

> sketch of op-amp & how it changes the signals

### Gas detection - lasers & filters

I had a few red laser pointers lying around, and a piece of a silicon solar cell. Perfect. Providing the laser pointer with a low duty cycle AC signal should not only prolong its life, it should also allow the signal detection to be a bit easier. I also could use the pulse width modulation output of the microcontroller to provide the driving signal.

Here is the basic laser driver circuit:

> no temp compensation

and the basic receiver circuit

> transimpedance amp

Our gas meter is outside,

> gas meter

so I did a couple simple experiments to figure out the reflectivity of the meter and whether this was even possible. Turns out, it works really well, except when it doesn't.

So, just align the laser spot on the dial, follow the reflected path back to the detector and measure the photocurrent received by the chunk of solar cell. Aligning things took a bit of trial and error.

 Here is what the setup looks like:

> setup

Wait, it's outdoors? And it uses a solar cell? Ooops, the reflected laser signal is not exactly massive, and the solar cell will also detected any reflected sunlight, so its baseline will bounce around over time. So I implemented two things to get rid of the impact of this variability.

1. A red laser filter - helps
  > red

2. And software discrimination using our AC signal - helps quite a bit more. More about that technique soon.

In the end, I would still get a situation when at noon on the hottest summer days, the laser threshold would fall and the solar baseline would be at its peak .. and the signal would die. Its a challenge for another day.

### Ethernet board

To do an embedded webserver, I used this ethernet board to be able to talk to the outside world. Since all the work is in the software, won't say much more about it.

> picture

### ATMega1284

There was enough going on in this project that I opted for the largest 8 bit microcontroller, the ATmega1284. It has 128K of flash, 4K of SRAM and 2K of EEPROM space. Other than a few tweaks in pin, port and interrupt vector names it was easy to work with.

Here are some pictures of the main board
> picture

### ATtiny

Because the laser was remote from the main monitoring, I used the ATTinyXX microcontroller for the laser driver circuit. Again, really easy to work with. Here are a few pictures of the remote gas monitoring board.

> picture

### Micro to micro

I didn't do anything special to have the two microcontrollers "talk" to one another. No serial port comms or anything like that. Just a standard "port out" to "port in", since we are talking about digital signals.

### Mechanical

My mounting leaves something to be desired. Here are some of the pics. Not super proud of any of this, but hey, gives me something to re-do.
* wiring in the circuit breaker
* main monitor mounting & power
* ethernet wiring
* mounting the laser box near the gas meter
* running wire into the house

## Software
### Gas detection software

Lets start with the gas side of things. As simple as the scheme was, it took a fair amount of finagling to get this to work out right.

First, setting the right threshold to know that we received a "count".
> baseline, threshold

And second, getting the right algorithm to make sure we are tracking the right state and not double counting.
> algo

### Electrical algorithms - speed

I opted for a single loop again here inside `main()`, complemented by the ADC interrupt which did all of the data capture. I enabled/disabled the ADC interrupt once per main software loop, and had the ADC take 280 measurements per software loop. The use of the interrupt was to ensure the electrical signal measurements and averaging were independent of the software loop time.  

With the ADC timer set at 1/32nd the main 12MHz clockrate (so the ADC sample time = 32X the clock period),

> adc setup

and knowing from the data sheet that 13 ADC clock cycles are needed to make a measurement after ADSC is set, and taking 1/3rd of the measurements per interrupt cycle, you find that the entire sample time should take 52 ms.

> excel calculation

 I measured 67 ms which is 4 full sine waves. I'm not sure yet of the discrepancy, as I got the interrupt service routine down to a bare minimum:

> ISR

> visualize on a graph in time

Yes, you can see a couple of slight issues
1. the samples are not exactly coincident in time

2. we did not exactly match the expected sample time

Both of these are addressable in software at some point in the future.

### Get the right numbers

Now, to connect these basic numbers to stuff we care about. First, I copied the buffered values so I could manipulate them and the ADC could go off and work independently on the next cycle of data. Here is the value munging:

1. account for ADC offsets
 `code`
2. account for calibration factor in one of the
 `code`
3. use the basic forumlas
 `code`
I then spit all of these out to the LCD, & served them up to the web as requested.

### Embedded Web serving

So this piece was a bit new to me. If you ever want to try something like this, I'd recommend spending an hour or two reading Guido Socher's website. What he's done is very impressive, both in scope, but also releasing his code for general use.

It took me a bit to piece it all together, but the basic idea is this:

1. Slim down the implementation of the TCP/IP protocol so that our responses fit in a single ethernet frame of 1500 bytes. This is the header frame.
2. Use http responses as a command interface.
3. Embed javascript so that most of the hard work is done at run time on the requesting device side.

With these constraints, this little web server is unbelievably capable, especially considering it's running on an 8 bit microcontroller at 8 MHz. I'll talk through them one by one.

### TCP/IP slim down

We need an interface to the ENC28J30, and we need an implementation of the TCP/IP protocol. The magic is in the latter.

### Internet Visualization

Javascript is a way to embed code into a webpage that runs when you load the page. that's why its called Java-*script*. Because that code is piped over the network from the web server to the requesting device, to get it to run fast you typically optimize the heck out of it. What was once readable code turns into hyper-optimized mash.

That, in and of itself, was alot of fun when I was doing it all by hand. I'm sure there are optimizers out there. Problem is, when you do it manually there is no going back and adding features without mucho pain.

To get interactivity with a user, you can embed graphs, buttons, etc.

### Command response

When clicking on a button, my software can read that and do any number of things: read a sensor, actuate something, or serve up yet another web page. Tuxgraphics has examples of all of these. For now, I'm just using it to flip between different web views of the same data.

> pics of web view

### See it on your phone?

Yeah. Need to open up the port to the internet. Need to do some IP address casting. But yeah. Very cool, and again, this webserver is amazingly responsive because the implementation is so lightweight.

> pic

### SQL database

Ok, so playing with web technologies is fun. To do analysis, we need that data in a database, or a spreadsheet, or whatever. The really interesting thing is that any higher level language can just now hit the web page and read the response and then parse it. You really start to "feel" the power of web technologies and standardization doing a project like this - programming the complete stack beginning to end.

I built a very quick and dirty MySQL database to hold the data, and have been playing with several different interfaces to understand the data.

> R

> Visual Basic/Excel

> Python

### R
I built a really simple interface in R. The code is about 100 lines and it produces a nice dashboard.

### Visual Basic
I like Excel, so I also wrote some VBA code and a spreadsheet to look at the data there. It is really easy to pull it offline and look at it and fiddle with different averaging and signal processing techniques.

### Python
This is where I'm spending most of my time now, building piece by piece.

## Data analysis
So what have I found out?
### Energy usage - stats
### Noise floor
### Seeing a lightbulb
### Toasters vs. washing machines - Real and reactive power
### 120V vs. 240V
### Fridge
### Coffee machine
### Garage door opener
### Gas usage - boiling water vs. heating the house

### Disaggregation algorithm
The goal is to have a master code set that maps the entire house energy usage through clever signal processing of just this one data feed.

## Learning by re-doing

### Gas circuit in the elements
A few drawbacks about the outdoors piece. Spiders, snow, rain, voles.

### Why stick with 8 bits & all that
Ok, you've got me there. Maybe time to move on.
