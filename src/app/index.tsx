import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import ShopBottomNav from '../components/ShopBottomNav';
import { addToCart } from '../features/cart/cartSlice';
import { getHomeData } from '../services/api';
import type { AppDispatch } from '../store/store';
import type { Category, Product } from '../types/catalog';

const PINK='#AE315C';
const imageUrl=(value:string|null|undefined)=>value?.replace(/^http:\/\//i,'https://')||'';
export default function HomeScreen(){
  const [categories,setCategories]=useState<Category[]>([]);
  const [products,setProducts]=useState<Product[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState('');
  const dispatch=useDispatch<AppDispatch>();
  const load=useCallback(async (refresh=false)=>{
    if(refresh)setRefreshing(true);else setLoading(true);
    setError('');
    try{
      const data=await getHomeData();
      setCategories(Array.isArray(data.categories)?data.categories:[]);
      setProducts(Array.isArray(data.products)?data.products:[]);
    }catch(e){setError('Could not load products. Pull down to retry.');}
    finally{setLoading(false);setRefreshing(false);}
  },[]);
  useEffect(()=>{void load();},[load]);
  return <SafeAreaView style={styles.screen} edges={['top','bottom']}>
    <View style={styles.top}><View style={styles.brandWrap}><Text style={styles.brand}>swagly</Text><Text style={styles.tag}>BEAUTY & YOU</Text></View>
      <View style={styles.topActions}><Pressable accessibilityLabel="Search" onPress={()=>router.push('/search' as any)}><Ionicons name="search-outline" color="#302B2C" size={24}/></Pressable><Pressable accessibilityLabel="Shopping cart" onPress={()=>router.push('/cart' as any)}><Ionicons name="bag-handle-outline" color="#302B2C" size={24}/></Pressable></View>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(true)} tintColor={PINK}/>}>
      <Pressable style={styles.searchBox} onPress={()=>router.push('/search' as any)}><Ionicons name="search-outline" size={20} color="#90868A"/><Text style={styles.searchHint}>Search makeup, skincare and more</Text><Ionicons name="arrow-forward-outline" size={18} color="#AE315C"/></Pressable>
      <View style={styles.hero}><Text style={styles.heroEyebrow}>WELCOME TO SWAGLY</Text><Text style={styles.heroTitle}>Your beauty, your way.</Text><Text style={styles.heroSub}>Explore skincare, makeup and everyday beauty essentials.</Text><Pressable style={styles.heroButton} onPress={()=>router.push('/categories' as any)}><Text style={styles.heroButtonText}>SHOP COLLECTIONS</Text><Ionicons name="arrow-forward" color={PINK} size={16}/></Pressable></View>
      <View style={styles.sectionHead}><Text style={styles.heading}>Shop by category</Text><Pressable onPress={()=>router.push('/categories' as any)}><Text style={styles.link}>View all  ›</Text></Pressable></View>
      {loading?<ActivityIndicator color={PINK} style={styles.loader}/>:<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map(c=><Pressable key={c.id} style={styles.category} onPress={()=>router.push({pathname:'/category/[id]',params:{id:String(c.id),name:c.name}} as any)}>
          <View style={styles.categoryCircle}>{c.image?<Image source={{uri:imageUrl(c.image)}} style={styles.categoryImage}/>:<Text style={styles.categoryInitial}>{c.name.slice(0,1)}</Text>}</View><Text style={styles.categoryText} numberOfLines={2}>{c.name}</Text>
        </Pressable>)}
      </ScrollView>}
      <View style={styles.sectionHead}><View><Text style={styles.heading}>Discover your favourites</Text><Text style={styles.subheading}>Explore our beauty collection</Text></View><Pressable onPress={()=>router.push('/search' as any)}><Text style={styles.link}>Browse  ›</Text></Pressable></View>
      {loading?<ActivityIndicator color={PINK} style={styles.loader}/>:<View style={styles.grid}>{products.map(p=><ProductCard key={p.id} name={p.name} image={imageUrl(p.image)} price={String(p.price)} discountedPrice={Number(p.discounted_price??p.price)} discountPercent={Number(p.discount_percent)||0} onPress={()=>router.push(`/product/${p.slug}` as any)} onAdd={()=>dispatch(addToCart({id:p.id,name:p.name,price:Number(p.discounted_price??p.price),image:imageUrl(p.image),quantity:1}))}/>)}</View>}
      {!!error&&<View style={styles.failure}><Text style={styles.error}>{error}</Text><Pressable onPress={()=>void load()}><Text style={styles.link}>Try again</Text></Pressable></View>}
      {!loading&&!error&&!products.length&&<Text style={styles.empty}>No products are currently available.</Text>}
      <View style={styles.promise}><Ionicons name="heart-outline" size={19} color={PINK}/><Text style={styles.promiseText}>Made for your everyday beauty routine</Text></View>
    </ScrollView>
    <ShopBottomNav/>
  </SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#FFF'},top:{height:62,paddingHorizontal:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#F5EBEE'},brandWrap:{alignItems:'center'},brand:{fontSize:29,fontWeight:'800',letterSpacing:-1.5,color:PINK},tag:{fontSize:8,letterSpacing:2.1,color:'#8D6573',marginTop:-3},topActions:{flexDirection:'row',gap:22},content:{paddingBottom:26},searchBox:{margin:16,marginBottom:5,paddingHorizontal:13,height:45,borderWidth:1,borderColor:'#EEE0E5',borderRadius:9,backgroundColor:'#FAF7F8',flexDirection:'row',alignItems:'center',gap:11},searchHint:{flex:1,color:'#95878E',fontSize:13},hero:{marginHorizontal:16,marginTop:14,padding:23,borderRadius:13,backgroundColor:'#F9E6EC',minHeight:190,justifyContent:'center'},heroEyebrow:{color:PINK,fontSize:10,fontWeight:'800',letterSpacing:1.8},heroTitle:{color:'#5E1D35',fontSize:29,fontWeight:'800',lineHeight:34,marginTop:9},heroSub:{color:'#775765',fontSize:13,lineHeight:19,marginTop:7,maxWidth:280},heroButton:{backgroundColor:'#FFF',paddingVertical:11,paddingHorizontal:14,borderRadius:6,alignSelf:'flex-start',marginTop:15,flexDirection:'row',gap:8,alignItems:'center'},heroButtonText:{color:PINK,fontSize:11,fontWeight:'800',letterSpacing:.8},sectionHead:{paddingHorizontal:17,marginTop:25,marginBottom:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},heading:{fontSize:20,fontWeight:'800',color:'#2C2528'},link:{fontSize:12,color:PINK,fontWeight:'700'},subheading:{fontSize:12,color:'#867C80',marginTop:3},categories:{paddingHorizontal:12,paddingBottom:4},category:{alignItems:'center',width:94,marginHorizontal:4},categoryCircle:{height:78,width:78,borderRadius:39,backgroundColor:'#F5E9ED',justifyContent:'center',alignItems:'center',overflow:'hidden',borderWidth:1,borderColor:'#F5E2E8'},categoryImage:{width:'100%',height:'100%'},categoryInitial:{fontSize:29,fontWeight:'700',color:PINK},categoryText:{textAlign:'center',fontSize:12,color:'#40373B',marginTop:9},grid:{paddingHorizontal:13,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},loader:{margin:30},empty:{textAlign:'center',padding:30,color:'#777'},failure:{alignItems:'center',padding:25,gap:10},error:{color:'#B33248',textAlign:'center'},promise:{marginHorizontal:16,marginTop:27,padding:16,backgroundColor:'#FAF5F7',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:9},promiseText:{color:'#895A6C',fontSize:12}});
