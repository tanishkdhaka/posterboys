export default interface Order_items {
    id:string,
    order_id:string,
    product_id:string,
    product_name:string,
    variant_size:string,
    unit_price:number,
    quantity:number,
    created_at:Date,
    updated_at:Date,
    linetotal:number
}
