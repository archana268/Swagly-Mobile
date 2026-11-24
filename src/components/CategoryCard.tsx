import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type CategoryCardProps = {
  name: string;
  image: string | null;
};

export default function CategoryCard({ name, image }: CategoryCardProps) {
  return (
    <Pressable style={styles.categoryItem}>
      {image ? (
        <Image source={{ uri: image }} style={styles.categoryImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <Text style={styles.categoryName}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 90,
  },

  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f4e7ee",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#9b1b5a",
  },

  categoryName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
