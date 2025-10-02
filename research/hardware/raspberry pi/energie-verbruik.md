# Raspberry Pi Energieverbruik & Batterijberekeningen

[![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-A22846?style=flat&logo=raspberry-pi&logoColor=white)](https://www.raspberrypi.org/)
[![GitHub](https://img.shields.io/badge/GitHub-SmartGlasses-181717?style=flat&logo=github)](https://github.com/vives-project-xp/SmartGlasses)

> **Uitgebreide gids voor het berekenen van batterijduur en energievereisten voor Raspberry Pi projecten**

⚠️ **Belangrijke mededeling**: De energieverbruikswaarden hieronder zijn typische schattingen gebaseerd op veelvoorkomende metingen. Werkelijke waarden hangen af van werkbelasting, aangesloten randapparatuur (USB, display, harde schijf), netwerkactiviteit (Wi-Fi, Ethernet), SD-kaart gebruik, en voedingskwaliteit (USB-C kabel, powerbank efficiëntie). Voor precieze metingen, gebruik een USB power meter of een toegewijde voedingsmeetopstelling.

---

## Inhoudsopgave

- [Energieverbruik Overzicht](#-energieverbruik-overzicht)
- [Essentiële Formules](#-essentiële-formules)
- [Praktische Voorbeelden](#-praktische-voorbeelden)
- [Optimalisatie Tips](#-optimalisatie-tips)
- [Snelle Calculator](#-snelle-calculator)

## Energieverbruik Overzicht

### Raspberry Pi Modellen - Energieverbruik Tabel

| Model                                 | Stroomverbruik (A @ 5V)                    | Vermogensrange (W @ 5V) | Opmerkingen                                               |
| ------------------------------------- | ------------------------------------------ | ----------------------- | --------------------------------------------------------- |
| **Raspberry Pi Zero**           | 0.08 / 0.12 / 0.18 (Idle / Typisch / Piek) | 0.4 / 0.6 / 0.9         | Zeer efficiënt; geen Wi-Fi tenzij Zero W                 |
| **Raspberry Pi Zero W**         | 0.09 / 0.13 / 0.22                         | 0.45 / 0.65 / 1.1       | Wi-Fi/Bluetooth verhoogt piekverbruik                     |
| **Raspberry Pi Zero 2 W**       | 0.12 / 0.18 / 0.35                         | 0.6 / 0.9 / 1.8         | Snellere SoC → typisch hoger verbruik                    |
| **Pi A+ / A (oudere A-series)** | 0.08 / 0.15 / 0.25                         | 0.4 / 0.75 / 1.25       | Minder I/O dan B → lager totaalverbruik                  |
| **Pi Model B / 2B**             | 0.18 / 0.35 / 0.75                         | 0.9 / 1.75 / 3.75       | Afhankelijk van netwerk, USB randapparatuur               |
| **Pi 3 Model B / B+**           | 0.2 / 0.5 / 1.2                            | 1.0 / 2.5 / 6.0         | Wi-Fi/BT en CPU verhogen verbruik onder belasting         |
| **Pi 4 Model B (alle RAM)**     | 0.30 / 0.75 / 1.5–2.5                     | 1.5 / 3.75 / 7.5–12.5  | Afhankelijk van CPU/GPU belasting en aangesloten USB/HDMI |
| **Pi 400**                      | 0.35 / 0.9 / 1.8                           | 1.75 / 4.5 / 9.0        | Pi4-achtig gedrag maar met geïntegreerd toetsenbord      |
| **Raspberry Pi 5**              | 0.45 / 1.4 / 2.5–3.5                      | 2.25 / 7.0 / 12.5–17.5 | Hogere prestaties → aanzienlijk hoger verbruik           |
| **HATs / Externe apparaten**    | Variabel (0.05 → >1A)                     | Variabel                | Elke USB HDD, camera of HAT verhoogt totaalverbruik sterk |

> **Legenda**: *Idle* = lage CPU, scherm uit; *Typisch* = lichte desktop of daemon; *Piek* = volledige CPU/GPU + actieve randapparatuur.
> Alle waarden zijn bij benadering; gebruik als startpunt voor batterijberekeningen.

## Essentiële Formules

### Stap-voor-Stap Energieberekeningen

#### Stap A: Capaciteit omzetten naar Energie (Wh)

Als batterijcapaciteit is gegeven in mAh en nominale batterijspanning V_bat:

```text
Wh = (mAh / 1000) × V_bat
```

#### Stap B: Beschikbare Energie op 5V (na conversie)

Powerbanks/step-up converters hebben energieverliezen: efficiëntie ≈ η (typisch 85–95%):

```text
Wh_5V = Wh × η
```

Voorbeeld: η = 0.90 voor 90% efficiëntie

#### Stap C: Looptijd Berekenen

Als het apparaat energieverbruik P_device (W) op 5V bekend is:

```text
runtime_hours = Wh_5V / P_device
```

#### Stap D: Omzetten naar Equivalent mAh @ 5V

```text
mAh_5V = (Wh_5V / 5) × 1000
```

### Snelle Formule (Eén regel)

```text
runtime_hours = ((mAh / 1000) × V_bat × η) / P_device
```

Waarbij P_device_W = 5 × I_device_A als je stroom in ampère weet

## Praktische Voorbeelden

*Veronderstelde efficiëntie: Voor voorbeelden gebruik ik η = 0.90 (90%) — pas aan als jouw powerbank anders beweert.*

### Batterij/Powerbank Voorbeelden

#### 18650 Enkele Cel: 3400 mAh @ 3.7V

- **Wh** = 3.4 × 3.7 = **12.58 Wh**
- **Wh_5V** = 12.58 × 0.90 = **11.32 Wh**
- **mAh_5V** = (11.32 / 5) × 1000 = **2,264 mAh @ 5V**

#### Powerbank 10.000 mAh (vaak gespecificeerd @ 3.7V)

- **Wh** = 10 × 3.7 = **37 Wh**
- **Wh_5V** = 37 × 0.90 = **33.3 Wh**
- **mAh_5V** = (33.3 / 5) × 1000 = **6,660 mAh @ 5V**

#### Powerbank 20.000 mAh (3.7V)

- **Wh** = 20 × 3.7 = **74 Wh**
- **Wh_5V** = 74 × 0.90 = **66.6 Wh**
- **mAh_5V** = (66.6 / 5) × 1000 = **13,320 mAh @ 5V**

### Looptijd Voorbeelden

We berekenen looptijden voor drie typische Pi's: Zero W (0.65W typisch), Pi 4 (3.75W typisch), Pi 5 (7.0W typisch — schatting)

#### Met 18650 (11.32 Wh beschikbaar op 5V)

| Pi Model            | Energieverbruik | Looptijd           |
| ------------------- | --------------- | ------------------ |
| **Pi Zero W** | 0.65 W          | **17.4 uur** |
| **Pi 4**      | 3.75 W          | **3.0 uur**  |
| **Pi 5**      | 7.0 W           | **1.6 uur**  |

#### Met Powerbank 10.000 mAh (33.3 Wh)

| Pi Model            | Energieverbruik | Looptijd           |
| ------------------- | --------------- | ------------------ |
| **Pi Zero W** | 0.65 W          | **51.2 uur** |
| **Pi 4**      | 3.75 W          | **8.9 uur**  |
| **Pi 5**      | 7.0 W           | **4.8 uur**  |

#### Met Powerbank 20.000 mAh (66.6 Wh)

| Pi Model            | Energieverbruik | Looptijd            |
| ------------------- | --------------- | ------------------- |
| **Pi Zero W** | 0.65 W          | **102.5 uur** |
| **Pi 4**      | 3.75 W          | **17.8 uur**  |
| **Pi 5**      | 7.0 W           | **9.5 uur**   |

> ⚠️ **Opmerking**: Deze looptijden zijn ideale schattingen. Werkelijke looptijd kan variëren door:
>
> - Slaap/idle optimalisaties (soms beter), of pieken door CPU/GPU/schijf activiteit (soms slechter)
> - Extra randapparatuur (USB HDD, display) kan 0.5–2A extra kosten
> - Powerbank zelf kan verliezen hebben bij lage belastingen of kortsluitbeveiliging

## Optimalisatie Tips

### Meting & Testen

- **Meet altijd** met een USB power meter tussen powerbank en Pi: geeft echte stroom (A), voltage (V), Wh en tijd
- **Display/USB-HDD/Camera**: Tel verbruik van externe apparaten op bij Pi verbruik. Een kleine USB HDD kan 0.5–1.0A extra gebruiken tijdens opstarten
- **Netwerk**: Wi-Fi verhoogt verbruik tijdens activiteit; Ethernet is minder variabel

### Prestatie Optimalisatie

- **Hitte & Throttling**: Hogere CPU → meer stroom → meer hitte. Een ventilator kost ook stroom (typisch 50–200 mA)
- **Onderklokken/Governors**: Voor langere looptijden kun je CPU limieten/onderklokken toepassen; dit verlaagt vermogen onder belasting
- **Goede Kabels**: Slechte kabels verlagen voltage bij hoge stroom, waardoor converter inefficiënties en instabiliteit ontstaan

### Batterij Selectie

- **Powerbank Specificatie Controle**: Veel powerbanks geven mAh op bij 3.7V. Gebruik altijd conversies (mAh→Wh) zoals hierboven getoond
- **Reserve Marge**: Plan voor minstens 10–20% extra energieverlies bij koud weer of verouderde batterijen

## Aankoop Checklist

Voordat je een batterij selecteert, overweeg:

1.  **Welk Pi model?** (Zero vs Pi4 vs Pi5 geeft ordes van grootte verschil)
2. **USB apparaten/displays aangesloten?** Tel hun stroomverbruik op
3. **Gebruikspatroon?** Gebruik "typisch" of "piek" in berekening afhankelijk van werkbelasting
4. **Batterij type?** (enkele 18650, powerbank 3.7V rating, 2S/3S packs → pas V_bat aan)
5. **Verwachte conversie-efficiëntie?** (0.85–0.95 typisch)
6. **Gewenste looptijd** → bereken terug de benodigde Wh of mAh_5V

## Snelle Calculator

### Eén-Regel Formule

```text
runtime_hours = ((mAh_battery / 1000) × V_battery × efficiency) / P_device_W
```

Waarbij P_device_W = 5 × I_device_A als je stroom in ampère weet

## Samenvatting

Deze gids biedt uitgebreide energieverbruiksgegevens en berekeningsmethoden voor Raspberry Pi batterij projecten. Gebruik de formules en voorbeelden als startpunten, maar meet altijd werkelijk verbruik voor kritische toepassingen.

**Belangrijkste punten:**

- Pi Zero W: ~0.65W typisch  (uitstekend voor batterijprojecten)
- Pi 4: ~3.75W typisch (matige batterijduur - geschikt met goede batterij)
- Pi 5: ~7.0W typisch  (vereist grote batterijen voor redelijke looptijd)
- **Altijd** rekening houden met randapparatuur en conversie verliezen (10-20%)
- **Meet altijd** met USB power meters voor precisie in kritische toepassingen

### Nuttige Links

- [Raspberry Pi Documentatie](https://www.raspberrypi.org/documentation/)
- [USB Power Meters](https://www.google.com/search?sca_esv=70a532a702b7bdb6&sxsrf=AE3TifN_OputTqtX7-zDenKXCgNYmeP27Q:1758878129336&udm=3&fbs=AIIjpHw2KGh6wpocn18KLjPMw8n5q-b0bBxG09ax8fLlbymQasOsl1hbOHNakHWEn_Z1PUI8QGGYdPBGOKk4eWFlVad2F7orqbR9xbnmRNBzDI2iCQBf6fZ94YrSqn3MsZZx95t3IZEq_vA6xHZ4dmnanjKE9QQ0JeUWIB6nPOWOL59p9Uz7fwlQ4QESOy2iRQqfu8U-oTBxXVuQJxkbIbUv0xPVtL6jtA&q=usb+power+meters+overzicht&sa=X&ved=2ahUKEwjcyujQi_aPAxX1RaQEHVnxCq8Qs6gLegQIFRAB&biw=1920&bih=911&dpr=1)
- [Batterij Tips &amp; Tricks](https://www.batterystuff.com/kb/articles/battery-articles/battery-basics.html?srsltid=AfmBOopnCF9mpVFtCWZ1KIQHIlD5oMHqgM6RZryfDvr3MQmvFIhQi_aW)

---

**📅 Laatst bijgewerkt:** September 2025
**👥 Project:** VIVES SmartGlasses Research

---
