import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

type Note = {
  id: string;
  text: string;
  dateAdded: number; // timestamp
  category: string;
  title?: string;
  updatedAt?: number; // timestamp when edited
};

export default function Home() {
  const { logout, user } = useAuth();

  // ---- Notes state ----
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // OPEN MODAL for adding a fresh note
  const handleOpenAddModal = () => {
    setEditingId(null);
    setText("");
    setTitle("");
    setCategory("");
    setError("");
    setModalVisible(true);
  };

  // ADD / UPDATE note (inside modal)
  const handleSaveNote = () => {
    setError("");

    if (!text.trim()) {
      setError("Notes text is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const now = Date.now();

    // UPDATE FUNCTION
    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? {
                ...note,
                text: text.trim(),
                title: title.trim() || undefined,
                category: category.trim(),
                updatedAt: now, // timestamp of when edited
              }
            : note
        )
      );
    } else {
      // ADD FUNCTION
      const newNote: Note = {
        id: `${now}-${Math.random()}`,
        text: text.trim(),
        title: title.trim() || undefined,
        category: category.trim(),
        dateAdded: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    // Reset + close modal
    setText("");
    setTitle("");
    setCategory("");
    setEditingId(null);
    setModalVisible(false);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setText(note.text);
    setTitle(note.title || "");
    setCategory(note.category);
    setError("");
    setModalVisible(true);
  };

  // DELETE FUNCTION
  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setText("");
      setTitle("");
      setCategory("");
      setError("");
      setModalVisible(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // READ + SEARCH + SORT FUNCTION
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
      {item.title ? <Text style={styles.noteTitle}>{item.title}</Text> : null}
      <Text style={styles.noteCategory}>Category: {item.category}</Text>
      <Text style={styles.noteText}>{item.text}</Text>
      <Text style={styles.noteMeta}>
        Added: {new Date(item.dateAdded).toLocaleString()}
      </Text>
      {item.updatedAt && (
        <Text style={styles.noteMeta}>
          Updated: {new Date(item.updatedAt).toLocaleString()}
        </Text>
      )}

      <View style={styles.noteActionsRow}>
        <TouchableOpacity
          style={[styles.smallButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.smallButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.smallButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header + user info */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.username ?? "Guest"} 🎉
        </Text>
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(protected)/profile")}
          >
            <Text style={styles.headerButtonText}>Go to Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={logout}>
            <Text style={styles.headerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Note button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleOpenAddModal}
        >
          <Text style={styles.primaryButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      {/* Search + Sort + Notes list */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Notes</Text>

        <TextInput
          placeholder="Search notes by text, title, or category"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by date added:</Text>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            <Text style={styles.sortButtonText}>
              {sortOrder === "asc" ? "Oldest → Newest" : "Newest → Oldest"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredAndSortedNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notes added yet.</Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>

      {/* Modal for Add / Edit Note */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Note" : "Add Note"}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              placeholder="Title (optional)"
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
              placeholder="Notes (text to be saved)"
              value={text}
              onChangeText={setText}
              style={[styles.input, styles.textArea]}
              multiline
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setError("");
                  setEditingId(null);
                  setText("");
                  setTitle("");
                  setCategory("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveNote}
              >
                <Text style={styles.modalSaveText}>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  sortLabel: {
    fontSize: 14,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  sortButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 10,
    color: "#888",
    textAlign: "center",
  },
  noteCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#fafafa",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  noteCategory: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    color: "#555",
  },
  noteText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noteMeta: {
    fontSize: 11,
    color: "#777",
  },
  noteActionsRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "flex-end",
    gap: 8,
  },
  smallButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "#FFCC00",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  modalCancelButton: {
    backgroundColor: "#eee",
  },
  modalSaveButton: {
    backgroundColor: "#007AFF",
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "600",
  },
  modalSaveText: {
    color: "#fff",
    fontWeight: "600",
  },
});
