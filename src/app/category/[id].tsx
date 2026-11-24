import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ProductCard from '../../components/ProductCard';
import { addToCart } from '../../features/cart/cartSlice';
import { getCategoryProducts } from '../../services/api';
import { imageUrl, Product } from '../../types/catalog';
export default function CategoryListing(){
 const {id,name}=useLocalSearchParams<{id:string;name?:string}>();const [products,setProducts]=useState<Product[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const dispatch=useDispatch();
 const load=useCallback(async()=>{setLoading(true);setError('');try{const result=await getCategoryProducts(String(id));const list=Array.isArray(result)?result:Array.isArray(result?.products)?result.products:Array.isArray(result?.data?.products)?result.data.products:Array.isArray(result?.data)?result.data:[];setProducts(list);}catch(e){setError('Unable to load category products.');}finally{setLoading(false);}},[id]);
 useEffect(()=>{void load();},[load]);
 return <SafeAreaView style={styles.screen} edges={['top','bottom']}><View style={styles.header}><Pressable onPress={()=>router.back()}><Ionicons name="arrow-back" size={24} color="#31282D"/></Pressable><Text style={styles.title} numberOfLines={1}>{name||'Products'}</Text><Pressable onPress={()=>router.push('/cart' as any)}><Ionicons name="bag-handle-outline" size={24} color="#31282D"/></Pressable></View><ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={()=>void load()}/>} contentContainerStyle={styles.grid}>{loading?<ActivityIndicator color="#AE315C" style={styles.loading}/>:error?<Text style={styles.notice}>{error}</Text>:!products.length?<Text style={styles.notice}>No products found in this category.</Text>:products.map(p=><ProductCard key={p.id} name={p.name} image={imageUrl(p.image)} price={String(p.price)} discountedPrice={Number(p.discounted_price??p.price)} discountPercent={Number(p.discount_percent)||0} onPress={()=>router.push(`/product/${p.slug}` as any)} onAdd={()=>dispatch(addToCart({id:p.id,name:p.name,price:Number(p.discounted_price??p.price),image:imageUrl(p.image),quantity:1}))}/>)}</ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#FFF'},header:{height:59,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:17,borderBottomWidth:1,borderColor:'#F2E6EA'},title:{fontSize:19,fontWeight:'800',color:'#31282D',maxWidth:'70%'},grid:{padding:13,flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',gap:10},loading:{marginTop:70},notice:{color:'#777',textAlign:'center',width:'100%',padding:25}});
