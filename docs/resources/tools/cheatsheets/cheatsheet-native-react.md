# Cheatsheet: React Native (JS/TS)

> **Framework voor het bouwen van mobiele apps met JavaScript of TypeScript (Android & iOS & websites)**

```bash
# Quick start commands to create and run a new RN app

npx react-native init MyApp       # Initialiseert een nieuw project 'MyApp'
cd MyApp                          # Ga naar de projectmap
npm start                         # Start de development server (Metro)
npm run android                   # Bouw en start de app op Android
npm run ios                       # Bouw en start de app op iOS (macOS vereist)
```

## Basisstructuur component

**Component voorbeeld:**

*function component met StyleSheet*

```jsx
import React from "react";                        // Importeer React voor JSX-syntaxis
import { View, Text, StyleSheet } from "react-native"; // Importeer basis UI-componenten

export default function App() {                  // Definieer en exporteer een function component
  return (                                       // Begin van de JSX-render
    <View style={styles.container}>              {/* Root view met container-stijl */}
      <Text style={styles.title}>Hello React Native 👋</Text> {/* Titeltekst */}
    </View>
  );                                             // Einde JSX-render
}                                                // Einde component

const styles = StyleSheet.create({               // Maak een StyleSheet voor herbruikbare stijlen
  container: { flex: 1, justifyContent: "center", alignItems: "center" }, // Centrerende container
  title: { fontSize: 24, fontWeight: "bold" },  // Stijl voor de titeltekst
});
```

## Props & state

**useState voorbeeld:**

*lokale component state*

```jsx
import React, { useState } from "react";           // Importeer useState hook
import { View, Text, Button } from "react-native"; // Importeer UI componenten

export default function Counter() {                // Component die een eenvoudige teller toont
  const [count, setCount] = useState(0);           // Statevariabele en setter initialiseren

  return (                                         // Render de component UI
    <View>
      {/* Toon huidige waarde van de state 'count' */}
      <Text>Count: {count}</Text>                  {/* Reactively toont waarde van count */}

      {/* Bij onPress: verhoog count met 1 via de setter setCount */}
      <Button title="+" onPress={() => setCount(count + 1)} /> {/* Verhoog de teller */}
    </View>
  );                                               // Einde render
}                                                  // Einde component
```

## TextInput & events

***TextInput bindt value en onChangeText voor controlled input***

```jsx
import React, { useState } from "react";           // Importeer useState
import { View, TextInput, Text } from "react-native"; // Importeer input- en tekstcomponenten

export default function InputExample() {           // Voorbeeldcomponent met een TextInput
  const [name, setName] = useState("");            // State voor de invoerwaarde

  return (
    <View>
      {/* TextInput met controlled value en change handler */}
      <TextInput
        placeholder="Typ je naam"                   // Placeholder-tekst
        value={name}                                // Gekoppelde waarde (controlled)
        onChangeText={setName}                      // Handler om state te updaten
        style={{ borderWidth: 1, padding: 8, margin: 10 }} // Basis styling
      />
      <Text>Hallo, {name || "..."}</Text>           {/* Toon ingevoerde naam of placeholder */}
    </View>
  );
}
```

## ScrollView & FlatList

**ScrollView voor kleine lijsten, FlatList voor performante lange lijsten**

```jsx
import React from "react";                         // Importeer React
import { ScrollView, FlatList, Text } from "react-native"; // Importeer scroll- en lijstcomponenten

const items = ["React", "Native", "Cheatsheet", "Demo"]; // Voorbeelddata-array

export default function Lists() {                  // Component die beide lijsten demonstreert
  return (
    <>
      {/* ScrollView: handig voor korte of statische lijsten */}
      <ScrollView style={{ padding: 10 }}>
        {items.map((i) => (
          <Text key={i}>{i}</Text> /* Render elk item als Text */ 
        ))}
      </ScrollView>

      {/* FlatList: performanter voor langere dynamische lijsten */}
      <FlatList
        data={items} /* Geef de data-array door aan FlatList */
        keyExtractor={(item) => item} /* Unieke key per item */
        renderItem={({ item }) => <Text>{item}</Text>} /* Render-functie per item */
      />
    </>
  );
}
```

## Navigatie (React Navigation)

**installatie- en basiskoppeling voor stack navigation**

```bash
npm install @react-navigation/native @react-navigation/native-stack  # Installeer navigatiepakketten
npx expo install react-native-screens react-native-safe-area-context  # Installeer native dependencies voor Expo
```

```jsx
import * as React from "react";                   // Importeer React
import { NavigationContainer } from "@react-navigation/native"; // Root container voor navigatie
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Stack navigator factory
import { Button, View, Text } from "react-native"; // UI componenten

const Stack = createNativeStackNavigator();       // Maak een stack navigator instantie

function Home({ navigation }) {                   // Home screen component
  return (
    <View>
      <Text>Home screen</Text>                    // Simpele tekst voor Home screen
      {/* Navigatie naar het Details scherm */}
      <Button title="Ga naar details" onPress={() => navigation.navigate("Details")} /> // Nav naar Details
    </View>
  );
}

function Details() {                              // Details screen component
  return (
    <View>
      <Text>Detailpagina</Text>                   // Simpele tekst voor Details
    </View>
  );
}

export default function App() {                   // App component met navigation container
  return (
    <NavigationContainer>                         // Houdt navigatiestatus bij
      <Stack.Navigator>                           // Definieer schermstack
        <Stack.Screen name="Home" component={Home} /> {/* Registreer Home */}
        <Stack.Screen name="Details" component={Details} /> {/* Registreer Details */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Styling (StyleSheet & inline)

**voorkeur: StyleSheet voor performance, inline voor snelle overrides**

```jsx
import { StyleSheet, View, Text } from "react-native"; // Importeer StyleSheet en UI-componenten

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Gebruik volledige beschikbare ruimte
    backgroundColor: "#eef",    // Achtergrondkleur van container
    justifyContent: "center",   // Verticale centrering van kinderen
    alignItems: "center",       // Horizontale centrering van kinderen
  },
  text: { fontSize: 20, color: "#333" }, // Tekststijl
});

export default function Styled() {            // Voorbeeldcomponent dat stijlen gebruikt
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gestyled component 🎨</Text> {/* Toepassing van StyleSheet */}
      {/* Inline style ter illustratie van override */}
      <Text style={{ fontSize: 16, color: "blue" }}>Inline style</Text>
    </View>
  );
}
```

## Fetch API (HTTP-requests)

**fetch voorbeeld; altijd error handling toevoegen**

```jsx
import React, { useEffect, useState } from "react"; // Importeer hooks
import { View, Text, ActivityIndicator } from "react-native"; // UI voor loading en data

export default function FetchExample() {
  const [data, setData] = useState(null); // State voor response data

  useEffect(() => {                        // Effect hook voor side-effect (fetch)
    // fetch en JSON-parsing, met eenvoudige foutafhandeling
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())           // Parseer JSON-respons
      .then(setData)                       // Sla response data op in state
      .catch(console.error);               // Log fouten in console
  }, []);                                  // Lege dependency array => run één keer

  if (!data) return <ActivityIndicator />; // Toon loader zolang data ontbreekt

  return (
    <View>
      <Text>{data.title}</Text>            // Toon titel uit response
      <Text>{data.body}</Text>             // Toon body uit response
    </View>
  );
}
```

## AsyncStorage (lokale opslag)

**AsyncStorage voor key/value persistente opslag**

```bash
npm install @react-native-async-storage/async-storage  # Installeer AsyncStorage package
```

```jsx
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importeer AsyncStorage
import { useEffect } from "react";                // Importeer useEffect

async function saveData() {
  // Schrijf sleutel/waarde naar lokale opslag
  await AsyncStorage.setItem("username", "Kyell");
}

async function getData() {
  // Lees waarde op basis van key
  const value = await AsyncStorage.getItem("username");
  console.log(value);                              // Log de opgehaalde waarde
}

useEffect(() => {
  // Voorbeeld: schrijf daarna lees de waarde
  saveData().then(getData);
}, []);                                            // Run één keer bij mount
```

## Platform-specifiek gedrag

**Platform.OS gebruiken om platform-afhankelijk te renderen**

```jsx
// importeer Platform en Text uit react-native
import { Platform, Text } from "react-native";

export default function PlatformExample() {
  // Platform.OS geeft 'ios' | 'android' | 'web' | 'windows' etc.
  const os = Platform.OS;

  // Platform.select kiest waarde per platform
  const padding = Platform.select({ ios: 20, android: 12, default: 10 });

  return (
    <>
      {/* Toon het huidige platform */}
      <Text>Je draait op: {os}</Text>

      {/* Platform-specifieke tekst */}
      <Text>
        {Platform.OS === "ios"
          ? "iOS-specifieke tekst"
          : "Android/anders tekst"}
      </Text>

      {/* Gebruik Platform.Version bij logica (nummer/string afhankelijk van platform) */}
      <Text>Versie: {String(Platform.Version)}</Text>

      {/* voorbeeld van Platform.select inline */}
      <Text style={{ padding }}>Gepadde tekst</Text>
    </>
  );
}
```

## Operators & waarden

Korte uitleg over veelgebruikte operators in React Native (JavaScript/TypeScript + JSX).

 Operators werken op waarden (variabelen). Gebruik duidelijke, kleine expressies in JSX en voorkom side-effects tijdens renderen.

**Belangrijkste operators (kort)**

```jsx
- Aritmetisch: + - * / %
- voor numerieke bewerkingen.

- Toewijzing: =, +=, -= ...
- linkerkant moet een variabele zijn.

- Vergelijking: === , !== , < , > , <= , >=
- gebruik === / !== voor voorspelbaarheid.

- Logisch: &&, ||, !
- veel gebruikt voor conditioneel renderen.

- conditionele expressie: cond ? a : b
- inline if/else.

- Nullish coalescing: a ?? b
- fallback alleen bij null/undefined.

- Optional chaining: obj?.prop
- veilig deep-access.

- Spread / rest: ...obj
- props/arrays/objecten spreiden of rest verzamelen.
```

**Voorbeelden in React Native (kort)**

```jsx
import React from "react";
import { View, Text, Button } from "react-native";

export default function OpsExample({ user, count }: { user?: { name?: string }; count: number }) {
  // nullish coalescing: fallback wanneer user?.name null/undefined is
  const displayName = user?.name ?? "Gast";

  // conditionele expressie voor tekst op basis van count
  const message = count > 0 ? `Aantal: ${count}` : "Geen items";

  // optional chaining: veilig lezen van deep properties
  const firstChar = displayName?.[0] ?? "?";

  return (
    <View>
      {/* toon berekende waarden */}
      <Text>Hallo, {displayName}</Text>
      <Text>{message}</Text>

      {/* let op: count && <Text>... kan 0 renderen; gebruik ternary als 0 niet gewenst is */}
      {count ? <Text>Je hebt items</Text> : null}

      {/* spread props voorbeeld */}
      <Button title="+1" onPress={() => console.log(count + 1)} />
      <Text>{`Eerste letter: ${firstChar}`}</Text>
    </View>
  );
}
```

Korte tips
- Gebruik parentheses om complexe expressies leesbaar te houden.
- Vermijd zij-effecten (mutaties, API-calls) in JSX-expressies.
- Geef de voorkeur aan ===/!== en ?? wanneer je null/undefined apart wilt behandelen.
- Gebruik Platform.select of ternary voor platform-specifieke waarden.

## Useful CLI commands

**Handige CLI commando's voor ontwikkeling en debugging**

```bash
npx react-native start             # Start Metro bundler voor development
npx react-native run-android       # Bouw en run de app op Android
npx react-native run-ios           # Bouw en run de app op iOS
npx react-native log-android       # Bekijk logs van Android device/emulator
npx react-native doctor            # Draai diagnostische checks voor omgeving
```
