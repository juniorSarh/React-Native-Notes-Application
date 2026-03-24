import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Note = {
  id: string;
  text: string;
  dateAdded: number;
  category: string;
  title?: string;
  updatedAt?: number;
};

const STORAGE_KEY_PREFIX = "NOTES_";

export default function Home() {
  const { logout, user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const storageKey = useMemo(() => {
    const idPart =
      (user as any)?.id ||
      (user as any)?.email ||
      (user as any)?.username ||
      "guest";
    return `${STORAGE_KEY_PREFIX}${idPart}`;
  }, [user]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoadingNotes(true);
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) setNotes(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load notes", e);
      } finally {
        setLoadingNotes(false);
      }
    };
    loadNotes();
  }, [storageKey]);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(notes));
      } catch (e) {
        console.warn("Failed to save notes", e);
      }
    };

    if (!loadingNotes) saveNotes();
  }, [notes, storageKey, loadingNotes]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setText("");
    setTitle("");
    setCategory("");
    setError("");
    setModalVisible(true);
  };

  const handleSaveNote = () => {
    if (!text.trim()) {
      setError("Notes text is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const now = Date.now();

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? {
                ...note,
                text: text.trim(),
                title: title.trim() || undefined,
                category: category.trim(),
                updatedAt: now,
              }
            : note
        )
      );
    } else {
      const newNote: Note = {
        id: `${now}-${Math.random()}`,
        text: text.trim(),
        title: title.trim() || undefined,
        category: category.trim(),
        dateAdded: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setModalVisible(false);
    setText("");
    setTitle("");
    setCategory("");
    setEditingId(null);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setText(note.text);
    setTitle(note.title || "");
    setCategory(note.category);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const filteredAndSortedNotes = useMemo(() => {
    let data = [...notes];

    const query = search.trim().toLowerCase();
    if (query.length > 0) {
      data = data.filter((note) => {
        const haystack = [note.text, note.title ?? "", note.category ?? ""]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    data.sort((a, b) =>
      sortOrder === "asc"
        ? a.dateAdded - b.dateAdded
        : b.dateAdded - a.dateAdded
    );

    return data;
  }, [notes, search, sortOrder]);

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteCard}>
      {item.title && <Text style={styles.noteTitle}>{item.title}</Text>}
      <Text style={styles.noteCategory}>{item.category}</Text>
      <Text style={styles.noteText}>{item.text}</Text>

      <View style={styles.noteFooter}>
        <Text style={styles.noteMeta}>
          {new Date(item.dateAdded).toLocaleDateString()}
        </Text>

        <View style={styles.noteActionsRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Top Right Icons */}
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }} />

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(protected)/profile")}
            >
              <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={26} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Text BELOW */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.username ?? "Guest"} 👋
          </Text>
          <Text style={styles.subtitle}>Your personal notes</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text >Sort by date:</Text>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Text style={styles.sortButtonText}>
            {sortOrder === "asc" ? "Oldest → Newest" : "Newest → Oldest"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes */}
      <FlatList
        data={filteredAndSortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes added yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenAddModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Note" : "Add Note"}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />

            <TextInput
              placeholder="Write your note..."
              value={text}
              onChangeText={setText}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
              >
                <Text style={styles.saveText}>
                  {editingId ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F8" },

  header: { marginBottom: 20 },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  headerActions: { flexDirection: "row", gap: 12 },

  iconButton: { padding: 4 },

  welcomeContainer: { marginTop: 5 },

  welcomeText: { fontSize: 24, fontWeight: "700" },

  subtitle: { color: "#666", marginTop: 4 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  searchInput: { flex: 1, padding: 10 },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sortButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sortlabel: { color: "#007AFF", fontWeight: "600" },

  sortButtonText: { color: "#007AFF" },

  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },

  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  noteTitle: { fontSize: 16, fontWeight: "700" },

  noteCategory: {
    fontSize: 12,
    color: "#007AFF",
    marginBottom: 6,
  },

  noteText: { fontSize: 14, marginBottom: 8 },

  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteMeta: { fontSize: 11, color: "#777" },

  noteActionsRow: { flexDirection: "row", gap: 12 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  cancelButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
  },

  saveButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
  },

  cancelText: { fontWeight: "600" },

  saveText: { color: "#fff", fontWeight: "600" },

  error: { color: "red", marginBottom: 8 },
});