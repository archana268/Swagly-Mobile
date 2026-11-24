import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import ShopBottomNav from '../components/ShopBottomNav';
import { addToCart } from '../features/cart/cartSlice';
import { getHomeData } from '../services/api';
import { imageUrl, Product } from '../types/catalog';
export default function Search(){
 const [query,setQuery]=useState('');const [products,setProducts]=useState<Product[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const dispatch=useDispatch();
 useEffect(()=>{getHomeData().then(d=>setProducts(Array.isArray(d.products)?d.products:[])).catch(()=>setError('Could not load products.')).finally(()=>setLoading(false));},[]);
 const filtered=useMemo(()=>products.filter(p=>`${p.name} ${p.category||''} ${p.short_description||''}`.toLowerCase().includes(query.trim().toLowerCase())),[products,query]);
 return <SafeAreaView style={styles.screen} edges={['top','bottom']}><Text style={styles.title}>Search beauty</Text><View style={styles.inputWrap}><Ionicons name="search-outline" size={20} color="#AF315C"/><TextInput autoFocus placeholder="Search products" placeholderTextColor="#A69AA0" value={query} onChangeText={setQuery} style={styles.input}/></View><ScrollView contentContainerStyle={styles.results}>{loading?<ActivityIndicator color="#AE315C" style={styles.loader}/>:error?<Text style={styles.notice}>{error}</Text>:<><Text style={styles.resultTitle}>{query?`${filtered.length} results`:'All products'}</Text><View style={styles.grid}>{filtered.map(p=><ProductCard key={p.id} name={p.name} image={imageUrl(p.image)} price={String(p.price)} discountedPrice={Number(p.discounted_price??p.price)} discountPercent={Number(p.discount_percent)||0} onPress={()=>router.push(`/product/${p.slug}` as any)} onAdd={()=>dispatch(addToCart({id:p.id,name:p.name,price:Number(p.discounted_price??p.price),image:imageUrl(p.image),quantity:1}))}/>)}</View>{!filtered.length&&<Text style={styles.notice}>No matching products found.</Text>}</>}</ScrollView><ShopBottomNav/></SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#FFF'},title:{fontSize:23,fontWeight:'800',paddingHorizontal:19,paddingTop:17,color:'#30252B'},inputWrap:{flexDirection:'row',margin:16,paddingHorizontal:13,alignItems:'center',borderWidth:1,borderColor:'#E9D6DD',borderRadius:9,height:48,gap:9},input:{flex:1,fontSize:15,color:'#333'},results:{padding:13},resultTitle:{fontSize:13,color:'#777',marginBottom:12},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},loader:{marginTop:35},notice:{textAlign:'center',padding:25,color:'#777'}});
