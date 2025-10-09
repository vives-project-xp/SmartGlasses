import { router } from "expo-router";
import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function About() {
  const handleback = () => {
    router.push("/");
  };

  const renderItem = ({
    item,
  }: {
    item: {
      key: string;
      title: string;
      content?: string;
      image?: string;
      link?: string;
      members?: { name: string; image?: string; link?: string }[];
    };
  }) => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{item.title}</Text>

      {item.members ? (
        <View style={styles.memberRow}>
          {item.members.map((m) => (
            <View key={m.name} style={styles.member}>
              {m.image ? (
                <Image source={{ uri: m.image }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
              <Text style={styles.memberName}>{m.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {item.content ? <Text style={styles.sectionText}>{item.content}</Text> : null}

      {item.link ? (
        <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
          <Text style={styles.linkText}>Open link</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const aboutData: {
    key: string;
    title: string;
    content?: string;
    image?: string;
    link?: string;
    members?: { name: string; image?: string; link?: string }[];
  }[] = [
    {
      key: "about",
      title: "About the project",
      content: "SmartGlasses — Sign Language → Text",
    },
    {
      key: "mkdocs",
      title: "MKDocs",
      content: "This documentation site contains all the info about the project",
      link: "https://github.com/vives-project-xp/SmartGlasses/tree/main/docs",
    },
    {
      key: "githubrepo",
      title: "GitHub Repository",
      content: "This is the main repository for the project.",
      link: "https://github.com/vives-project-xp/SmartGlasses",
    },
    {
      key: "idea",
      title: "Idea",
      content:
        "Capture sign language in real time using wearable/phone cameras, translate it to written text using a machine learning model, and present the result in a clean React Native UI for quick communication.",
    },
    {
      key: "goals",
      title: "Goals",
      content:
        "• Real-time recognition of a set of sign language gestures.\n• Translate recognized signs into natural text.\n• Provide an accessible React Native interface for display and interaction.\n• Support low-latency on-device inference or an efficient server API fallback.",
    },
    {
      key: "features",
      title: "Core features",
      content:
        "• Camera capture pipeline for video frames (or streamed landmarks).\n• ML inference: sign classification → text output (sentence builder).\n• UI: live camera view, recognized text overlay, history/log, language and settings.\n• Export/share recognized text (clipboard, messaging).\n• Basic user onboarding and privacy notice.",
    },
    {
      key: "roadmap",
      title: "Roadmap",
      content:
        "1. Prototype camera capture\n2. Integrate landmark extraction\n3. Train/test classifier\n4. Hook classifier to app\n5. Improve accuracy & smoothing\n6. Polish UI, add history & settings",
    },
    {
      key: "team",
      title: "Project team",
      members: [
        { name: "Simon Stijnen", image: "https://github.com/SimonStnn.png" },
        { name: "Timo Plets", image: "https://github.com/TimoPlts.png" },
        { name: "Lynn Delaere", image: "https://github.com/lynndelaere.png" },
        { name: "Olivier Westerman", image: "https://github.com/olivierwesterman.png" },
        { name: "Kyell De Windt", image: "https://github.com/kyell182.png" },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={aboutData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        style={{ width: "100%" }}                 // ensure FlatList itself uses full width
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleback}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  listContent: {
    paddingBottom: 24, // removed alignItems so items can stretch
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center", // keeps children centered inside the card
    alignSelf: "stretch", // allow the card to stretch to full FlatList width
    width: "100%", // stays fine but alignSelf is primary
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    textAlign: "left",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  memberRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12, // Android may ignore; use margin in child as fallback
    marginTop: 8,
  },
  member: {
    alignItems: "center",
    width: 90,
    marginRight: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
  },
  avatarPlaceholder: {
    backgroundColor: "#ddd",
  },
  memberName: {
    fontSize: 13,
    textAlign: "center",
  },
});
