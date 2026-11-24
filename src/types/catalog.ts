export type Category={id:number;name:string;image:string|null};
export type Product={id:number;name:string;slug:string;description?:string;price:string|number;discount_percent:number;category?:string;image:string;discounted_price:number;short_description?:string};
export const imageUrl=(s:string|null|undefined)=>s?.replace(/^http:\/\//i,'https://')||'';
