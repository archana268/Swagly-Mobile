import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ShopBottomNav from '../components/ShopBottomNav';
import { getHomeData } from '../services/api';
import { Category, imageUrl } from '../types/catalog';
export default function Categories(){
 const [categories,setCategories]=useState<Category[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{getHomeData().then(d=>setCategories(Array.isArray(d.categories)?d.categories:[])).catch(()=>setError('Could not load categories.')).finally(()=>setLoading(false));},[]);
 return <SafeAreaView style={styles.screen} edges={['top','bottom']}><Text style={styles.title}>Shop by Category</Text><ScrollView contentContainerStyle={styles.grid}>{loading?<ActivityIndicator color="#AE315C"/>:error?<Text>{error}</Text>:categories.map(c=><Pressable key={c.id} style={styles.item} onPress={()=>router.push({pathname:'/category/[id]',params:{id:String(c.id),name:c.name}} as any)}><View style={styles.circle}>{c.image?<Image source={{uri:imageUrl(c.image)}} style={styles.image}/>:<Text style={styles.initial}>{c.name[0]}</Text>}</View><Text style={styles.label}>{c.name}</Text></Pressable>)}</ScrollView><ShopBottomNav/></SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#FFF'},title:{fontSize:23,fontWeight:'800',padding:20,borderBottomWidth:1,borderBottomColor:'#F3E8EC',color:'#33272C'},grid:{padding:18,flexDirection:'row',flexWrap:'wrap',gap:15},item:{width:'29%',alignItems:'center',paddingVertical:10},circle:{height:86,width:86,borderRadius:43,backgroundColor:'#F8E9EF',justifyContent:'center',alignItems:'center',overflow:'hidden'},image:{width:'100%',height:'100%'},initial:{fontSize:30,color:'#AE315C',fontWeight:'700'},label:{textAlign:'center',fontSize:13,color:'#383236',marginTop:9}});
