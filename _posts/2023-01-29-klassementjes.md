---
title: Interessante klassementjes?
date: 28-01-2023
author: Wijnand
---

Zonder zout in wonden te willen gooien of oude vetes nieuw leven in te willen blazen, snijd ik graag het onderwerp van klassementjes aan. Of, om de gemoederen te bedaren en het over een modernere, neutralere boeg te gooien: data.

Nu we de mogelijkheden van het scrapen van data binnen onze toolset hebben, kunnen we nadenken over de exra data die we binnen willen halen, en hoe we deze kunnen verwerken en presenteren.

Een erg leuk klassementje/overzicht dat Jan ooit heeft samengesteld maar dat sindsien weer is verdwenen, was een overzicht van onze prestaties in de belangrijkste wedstridjen (de prestaties van onze renners bedoel iok dan natuurlijk en wel in het jaar dat je die renner in je bezit had).
De belangrijke wedstrijden zijn de klassiekers (de monumenten), de grote rondes en het WK. We kunnen hier naar behoeven wedstrijden aan toevoegen, de wegwedstrijd op de Olympische Spelen is dan een kandidaat.

Nu is de vraag, hoe haalbaar is het om deze data te vergaren en hoe willen we deze dan presenteren?

Laten we beginnen met de presentatie. De belangrijkste klassiekers, de Worldtour Monumenten. Deze categorie omvat de 6 belangrijkste eendagswedstrijden: Milaan – Sanremo, Ronde van Vlaanderen, Parijs – Roubaix, Amstel Gold Race, Luik – Bastenaken – Luik en Ronde van Lombardije.
Daarnaast heb je de drie grote rondes, en het WK, dus in totaal 10 races.

Wat we willen weten, is of er een ploegleider is die al die races een keer heeft gewonnen.
Het overzicht zou dan zijn een tabel met op de verticale as de ploegleiders en op de horizontale as de 10 wedstrijden. In een cel staat dan hoe vaak de betreffende ploegelider de betreffende wedstrijd heeft gewonnen, met eventueel een doorklik naar de jaren waarin en de renner waarmee die wedstrijd is gewonnen.

Voor wat betreft de data zijn er twee kanten: wie had welke renners in welk jaar en welke renners wonnen een bepaalde wedstrijd in welke jaar.

De eerste dataset is aanwezig op de wielerspel.com website, met dien verstande dat we niet van alle jaren alle renners met een CQranking id hebben. Dat blijkt ook wel als we naatr de aandere kant van de benodigde data gaan kijken: op CQranking zijn pas vanaf 1999 alle uitslagen beschikbaar.
Voordeel is wel dat deze data per gewenste wedstrijd op 1 pagina terug te vcinden is, zie bijvoorbeeld de [geschiedenis van Milano - Sanremo](https://cqranking.com/men/asp/gen/race_history.asp?raceid=39421).

Het gaat dan om het opzoeken van de 10 pagina's met de geschiedenis van de gewenste koersen, vervolgens per jaar opzoeken in welke ploeg de winnaar zat en dit opslaan en presenteren.

Maar we zitten dus met een gat, de rsultaten van 1994 -1998 ontbreken. Uit die jaren hebben we wel de namen van de renners, maar eventuele id's waarop deze gematcht kunnen worden met uitslagen ontbreken veelal, net als de uitslagen zelf op de door ons gebruikte bron, CQranking.

Er zijn alternatieve bronnen met informatie, zoals [FirstCycling]() en [ProCyclingstats]().
Op ProCyclingStats is er ook een Top 3 per editie terug te vinden, zie de [geschiedenis van Milano -Sanremo](https://www.procyclingstats.com/race/milano-sanremo/2023/history/palmares).

Ook op FirstCycling vind je [een dergelijk overzicht](https://firstcycling.com/race.php?r=4). 

De informatie is er dus, het gaat nu om het koppelen van de renner aan de ploegleider. Hiervoor moeten we dus een matching query schrijven, waarbij we de namen van de winnnaars opzoeken in de ploegen van dat jaar. Als we de renner vinden, slaan we dat resultaat op bij de ploegleider in wiens ploeg de renner in dat jaar zat.

Hoe ziet dat er uit voor wat betreft de data die we opslaan?

             
| jaartal  | race  | winnaar  | ploegleider  | 
|---|---|---|---|---|
| 1999  |  1234 |  5678 | Jan  | 


De eerste 3 velden komen dan dus van de site(s) met de informatie, de laatste kolom voegen we zelf toe a.d.h.v. de informatie over onze eigen ploegen in dat jaar.
De makkelijkste oplossing m.b.t. de ploegleiders is om te zorgen dat die door de jaren heen op dezelfde manier worden geschreven/gespeld. Om er zeker van te zijn dat er geen afwijkingen zijn, kunnen we de ploegleiders ook omzetten naar een ploegleider_id en die overal in de site gebruiken.



