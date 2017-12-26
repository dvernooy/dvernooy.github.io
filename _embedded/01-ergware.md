---
title: "Ergware"
permalink: /docs/ergware/
excerpt: "Open source software for an open source ergometer"
last_modified_at: 2017-11-15T09:49:52-05:00
redirect_from:
  - /theme-setup/
toc: true
---
### Open source software for an open source ergometer

<figure>
  <img src="{{ '/assets/images/erg-full.jpg' | absolute_url }}">
</figure>


Hey all, Dave Vernooy  here. I’m assuming you stumbled across this site after reading about DIY rowing machines, aka ergometers. 

This is just a simple website to answer questions about the ErgWare software, which is a project I undertook to add a digital interface to the excellent [openergo](http://openergo.webs.com) project. You can see the erg we built above using the original project documentation as a guide. It was a present for my daughter, which my dad & I pulled off in a month. He focused on the woodcraft, and I chipped in with the mechanical stuff, the electronics and the software.

It was great fun to build, and is even more fun to use.

After noodling on the original design, we decided it would be neat to add the software & display so the rower could get real-time feedback on the basic things a rower would want to know. We were able to get good estimates of stroke rate, power output, effective 500m split pace, distance rowed, fraction of time spent in power phase of stroke, etc..  Here is a close-in screenshot of the current version (you can see this display in the main picture above attached to the pvc tubing).

<figure>
	<img src="{{ '/assets/images/erg-interface.jpg' | absolute_url }}">
</figure>

The whole idea worked out pretty well, so I thought it would be good to add it back to the community as an open project. The source code and all documentation is hosted [here](https://www.github.com/dvernooy/ergware/) and available for free to download, use & modify. The documentation package includes 3 things:
1. A pdf document with circuit diagram, some rudimentary construction notes and links to useful web sources I used in the project.
2. An excel spreadsheet with a numerical model I built just so I could make sense of what is going on in an erg. [I am not a rower, but made some good progress with this approach. It was cool to see data from the erg match the model really closely … so I think the numbers all make reasonable sense. We’ll continue to learn as we put it through its paces].
3. All of the source code, designed for the Atmega328 microcontroller (Atmel AVR series).

The main purpose of this website is to answer questions about the software for those who have them & update on any new progress we may (or may not) make. I don’t have immediate plans to do much more on this project, but you never know. I’ll do my best to respond to any posted comments.



