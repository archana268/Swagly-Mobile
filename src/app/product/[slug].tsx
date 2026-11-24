import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { getProductDetails } from "../../services/api";

type ProductImage = {
  image_path: string;
};

type Swatch = {
  id: number;
  product_id: number;
  product_image: string;
  picture: string;
  name: string;
};

type ProductDetails = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  category_id: number;
  discount_percent: number;
  discounted_price: number;
  images: ProductImage[];
  swatches: Swatch[];
};

export default function ProductDetailsScreen() {
  const { slug } = useLocalSearchParams();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [selectedSwatch, setSelectedSwatch] = useState<number | null>(null);

  const fetchProduct = async () => {
    try {
      const data = await getProductDetails(slug as string);

      setProduct(data);

      if (data.images?.length > 0) {
        setSelectedImage(
          data.images[0].image_path.replace("http://", "https://"),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof slug === "string") {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#222" />
        </Pressable>

        <Text style={styles.headerTitle}>Product Details</Text>

        <Pressable onPress={() => router.push("/cart" as any)}>
          <Ionicons name="bag-handle-outline" size={27} color="#222" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainImageContainer}>
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        <FlatList
          data={product.images ?? []}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item }) => {
            const imageUrl = item.image_path.replace("http://", "https://");

            const isSelected = selectedImage === imageUrl;

            return (
              <Pressable
                onPress={() => setSelectedImage(imageUrl)}
                style={[
                  styles.thumbnailContainer,
                  isSelected && styles.selectedThumbnail,
                ]}
              >
                <Image
                  source={{
                    uri: imageUrl,
                  }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </Pressable>
            );
          }}
        />

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>
              ₹{product.discounted_price.toFixed(2)}
            </Text>

            {product.discount_percent > 0 && (
              <>
                <Text style={styles.originalPrice}>₹{product.price}</Text>

                <Text style={styles.discountText}>
                  {product.discount_percent}% OFF
                </Text>
              </>
            )}
          </View>

          {(product.swatches?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionTitle}>Choose Shade</Text>

              <FlatList
                data={product.swatches ?? []}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedSwatch === item.id;

                  return (
                    <Pressable
                      onPress={() => {
                        setSelectedSwatch(item.id);

                        setSelectedImage(
                          item.product_image.replace("http://", "https://"),
                        );
                      }}
                      style={[
                        styles.swatchCard,
                        isSelected && styles.selectedSwatch,
                      ]}
                    >
                      <Image
                        source={{
                          uri: item.picture.replace("http://", "https://"),
                        }}
                        style={styles.swatchImage}
                      />

                      <Text style={styles.swatchName}>{item.name}</Text>
                    </Pressable>
                  );
                }}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.description}>
            {(product.description ?? "").replace(/<[^>]*>/g, "").trim()}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buyBar}><View><Text style={styles.buyLabel}>PRICE</Text><Text style={styles.buyPrice}>₹{Number(product.discounted_price ?? product.price).toFixed(2)}</Text></View><Pressable style={styles.buyButton} onPress={() => {dispatch(addToCart({id:product.id,name:product.name,price:Number(product.discounted_price ?? product.price),image:(selectedImage || product.image || "").replace(/^http:\/\//i,"https://"),quantity:1}));router.push("/cart" as any);}}><Ionicons name="bag-add-outline" size={19} color="#FFF"/><Text style={styles.buyText}>ADD TO CART</Text></Pressable></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buyBar:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:19,paddingVertical:11,borderTopWidth:1,borderColor:"#EFE4E8",backgroundColor:"#FFF"},buyLabel:{color:"#9B8D93",fontSize:10,fontWeight:"700"},buyPrice:{color:"#272126",fontSize:20,fontWeight:"800"},buyButton:{backgroundColor:"#AE315C",borderRadius:5,flexDirection:"row",alignItems:"center",paddingHorizontal:23,paddingVertical:13,gap:8},buyText:{color:"white",fontSize:12,fontWeight:"800"},
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  mainImageContainer: {
    height: 380,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },

  mainImage: {
    width: "90%",
    height: "90%",
  },

  thumbnailList: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  thumbnailContainer: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 8,
    padding: 3,
  },

  selectedThumbnail: {
    borderColor: "#9b1b5a",
    borderWidth: 2,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222222",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },

  discountedPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
  },

  originalPrice: {
    fontSize: 15,
    color: "#888888",
    textDecorationLine: "line-through",
  },

  discountText: {
    fontSize: 14,
    color: "#9b1b5a",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 12,
  },

  swatchCard: {
    width: 90,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
  },

  selectedSwatch: {
    borderColor: "#9b1b5a",
    borderWidth: 2,
  },

  swatchImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },

  swatchName: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#555555",
  },
});
