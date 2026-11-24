import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
type Props={name:string;image:string;price:string;discountedPrice:number;discountPercent:number;onPress:()=>void;onAdd?:()=>void};
const PINK='#AE315C';
export default function ProductCard({name,image,price,discountedPrice,discountPercent,onPress,onAdd}:Props){
  return <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.imageFrame}>{!!image&&<Image source={{uri:image}} style={styles.image} resizeMode="contain"/>}{discountPercent>0&&<View style={styles.badge}><Text style={styles.badgeText}>{discountPercent}% OFF</Text></View>}</View>
    <View style={styles.info}><Text numberOfLines={2} style={styles.name}>{name}</Text><View style={styles.prices}><Text style={styles.price}>₹{Number(discountedPrice).toFixed(2)}</Text>{discountPercent>0&&<Text style={styles.old}>₹{price}</Text>}</View>{onAdd&&<Pressable accessibilityLabel={`Add ${name} to cart`} style={styles.add} onPress={e=>{e.stopPropagation();onAdd();}}><Ionicons name="bag-add-outline" size={16} color={PINK}/><Text style={styles.addText}>ADD TO CART</Text></Pressable>}</View>
  </Pressable>;
}
const styles=StyleSheet.create({card:{width:'48%',borderWidth:1,borderColor:'#F1E9EC',borderRadius:10,backgroundColor:'#FFF',overflow:'hidden',marginBottom:8},imageFrame:{height:170,backgroundColor:'#FAF7F8',justifyContent:'center',alignItems:'center'},image:{height:'90%',width:'90%'},badge:{position:'absolute',left:8,top:9,backgroundColor:'#AE315C',borderRadius:3,paddingHorizontal:6,paddingVertical:4},badgeText:{color:'#FFF',fontSize:10,fontWeight:'800'},info:{padding:10},name:{fontSize:13,color:'#292428',lineHeight:19,minHeight:38,fontWeight:'500'},prices:{flexDirection:'row',alignItems:'center',gap:6,marginTop:7,flexWrap:'wrap'},price:{fontWeight:'800',color:'#292428',fontSize:15},old:{textDecorationLine:'line-through',color:'#9C9699',fontSize:11},add:{marginTop:11,height:33,borderWidth:1,borderColor:'#AE315C',borderRadius:4,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},addText:{color:'#AE315C',fontSize:10,fontWeight:'800',letterSpacing:.5}});
