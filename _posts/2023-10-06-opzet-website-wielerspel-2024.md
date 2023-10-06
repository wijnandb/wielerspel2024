---
layout: default
title: opzet wielerspel website 2024
---

Nu het eerste seizoen met gescrapete uitslagen en automatisch gegenereerde standen er bijna op zit, is het tijd om de site wat verder uit te breiden.
De belangrijkste informatie staat er nu op, maar het kan allemaal nog wel wat mooier en beter.

In de huidige site heb ik al wat zaken uitgeprobeerd, 

Ook heb ik lopen spelen met het visualiseren van data, zoals bijvoorbeeld:

## [boxplot]({{ site.baseurl }}{% link dynamic/boxplot.html %})

Het idee hier is om per ploeg de verdeling van renners naar kosten te zien, door middel van een boxplot. Een boxplot toont 5 waarden:

- de laagste waarde
- het eerste kwartiel
- de mediaan
- het derde kwartiel
- de hoogste waarde

Op deze manier zou je dus een beeld moeten krijgen van de verdeling van de kosten van de renners binnen een ploeg.
In de praktijk blijkt dit niet zo goed te werken, omdat iedereen een renner van 0 heeft en de duurste renners vaak heel duur zijn, waardoor de boxplot erg uitgerekt wordt.

Hetzelfde 


## [chord diagram]({{ site.baseurl }}{% link dynamic/chord-diagram.html %})

__Niet geschikt voor mobiel__
Wat je hier ziet, is een visualisatie waarbij de verbindngen tussen kosten en verdiende punten worden getoond.
De kosten per renner zijn opgedeeld in 5 categorieën, net als de verdiende punten per renner.
Wat er wordt getoond is hoeveel renners van de ene catgorie naar de andere categorie gaan.

Je leest de grafiek vanaf 12 uur met de klok mee. De buitenste rand geeft de categorieen aan (0 punten)

## [scatterplot]({{ site.baseurl }}{% link dynamic/scatterplot.html %})

Komt ook nog niet zo goed uit de verf, vooral omdat er teveel renners zowel qua kosten als qua verdiende punten dicht bij de 0 blijven, waardoor het linksonder in de grafiek erg druk wordt. Dit gaat ten koste van de leesbaarheid en bruikbaarheid van de grafiek.

Het idee blijft leuk, om aan de hand van de _break-even_ lijn (y=x) te zien welke renners winstgevend zijn en welke verlieslatend.
Maar goed, deze visualisatie is hier minder geschikt voor.

## Visualisaties van veel verdienende renners

Een aantal verschillende visualisaties t.a.v. de meest verdienende en/of renderende renners:

- [top 15 meest verdienend]({{ site.baseurl }}{% link dynamic/riders.html %})
- [top 15 meest verdienend, getoond per maand]({{ site.baseurl }}{% link dynamic/riders_per_month.html %})
- [hoogste marge per renner]({{ site.baseurl }}{% link dynamic/highest-margin.html %})
- [hoogste marge per renner met %]({{ site.baseurl }}{% link dynamic/highest_margin_percentage.html %})

Een andere mooie feature (vind ik) is het tonen van de [stand per maand](/dynamic/stand_per_maand.html), waarbij zowel de punten behaald in die maand als de punten behaald tot en met die maand worden getoond.

Op deze pagina kun je door de maanden heen klikken, om te zien hoe de stand zich ontwikkelt.

Daarnaast kun je kiezen op welke kolom wordt gesorteerd, en of dat oplopend of aflopend moet gebeuren. Daarna doorklikken naar een andere maand houdt die sortering vast.

Nog doen:

- [ ] links naar ploegen ploegleiders
- [ ] standaard openen op huidige maand

Een andere geslaagde visualisatie vind ik [deze]({{ site.baseurl }}{% link dynamic/profit_loss_per_rider.html %}), waarbij je per ploegleider de winst/verlies per renner kunt zien. In dit geval wordt de 
