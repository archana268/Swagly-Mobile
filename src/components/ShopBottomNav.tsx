import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const items = [
  {label:'Home', icon:'home-outline', active:'home', path:'/'},
  {label:'Categories', icon:'grid-outline', active:'categories', path:'/categories'},
  {label:'Search', icon:'search-outline', active:'search', path:'/search'},
  {label:'Cart', icon:'bag-handle-outline', active:'cart', path:'/cart'},
  {label:'Account', icon:'person-outline', active:'account', path:'/account'},
] as const;
export default function ShopBottomNav(){
  const pathname=usePathname();
  const count=useSelector((s:RootState)=>s.cart.items.reduce((sum,i)=>sum+i.quantity,0));
  return <View style={styles.nav}>{items.map(item=>{
    const active=pathname===item.path || (item.active==='categories' && pathname.startsWith('/category/'));
    return <Pressable key={item.active} accessibilityRole="button" accessibilityLabel={item.label} onPress={()=>router.push(item.path as any)} style={styles.tab}>
      <View><Ionicons name={item.icon} size={23} color={active?'#AE315C':'#6C6870'}/>{item.active==='cart' && count>0 && <View style={styles.dot}><Text style={styles.dotText}>{count>9?'9+':count}</Text></View>}</View>
      <Text style={[styles.text,active&&styles.selected]}>{item.label}</Text>
    </Pressable>;
  })}</View>;
}
const styles=StyleSheet.create({nav:{height:65,borderTopWidth:1,borderColor:'#F0E7E9',backgroundColor:'#FFF',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},tab:{flex:1,alignItems:'center',justifyContent:'center',gap:3},text:{fontSize:10,color:'#6C6870'},selected:{color:'#AE315C',fontWeight:'700'},dot:{position:'absolute',top:-6,right:-12,minWidth:17,height:17,borderRadius:9,backgroundColor:'#AE315C',alignItems:'center',justifyContent:'center',paddingHorizontal:3},dotText:{color:'#FFF',fontSize:9,fontWeight:'700'}});
