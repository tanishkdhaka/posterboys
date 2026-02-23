"use client"
import Products from '@/data/Products';
import { supabase } from '@/lib/supabaseClient';
import { useCartStore } from '@/store/navbarStore';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { createCodOrder } from './action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


function CheckOutClient({user}:{user:User}) {
 
    const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");
    const [name, setName] = useState<string>(user.user_metadata.name||"");
    const[email,setEmail]  =useState<string>(user.email||"");
    const[street,setStreet] = useState<string>("");
    const[city, setCity]= useState<string>("");
    const[landmark,setLandmark]= useState<string>("")
    const[state,setState]= useState<string>("")
    const[zipCode,setZipCode] = useState("")
    const[phone,setPhone]=useState("")
    const[cartProducts,setCartProducts]= useState<Products[]>([])
    const items = useCartStore((state)=>state.items)
    const router = useRouter();
  
    useEffect(() => {
       const productIds = items.map((item) => item.id);
       
         const fetchData = async () => {
           const { data, error } = await supabase
             .from("posters")
             .select("*")
             .in("id", productIds);
       
           if (!error && data) {
             setCartProducts(data);
           }
         };
       
         if (productIds.length > 0) {
           fetchData();
         } else {
           setCartProducts([]);
         }
    }, [items]);
    const newPords = items
    .map((cartItem) => {
      const product = cartProducts.find((p) => p.id === cartItem.id);
      if (!product) return null;
  
      const selectedVariant = product.variants?.find(
        (v) => v.size === cartItem.size
      );
  
      if (!selectedVariant) return null;
  
      return {
        ...product,
        selectedVariant: {
          ...selectedVariant,
          quantity: cartItem.quantity,
        },
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
  
    const total = newPords.reduce((acc, product) => {
      return (
        acc +
        product.selectedVariant.discounted_price *
        product.selectedVariant.quantity
      );
    }, 0);
    
    const tax = Math.round((total*18)/100)

//create order
const [isSubmitting, setIsSubmitting] = useState(false);
async function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
const createOrder = async (method: string) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!name || !email || !street || !city || !state || !zipCode || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  toast.error("Please enter a valid email address");
  return;
}

    if (phone.length < 10) {
      toast.error("Invalid phone number");
      return;
    }

    if (zipCode.length < 6) {
      toast.error("Invalid zip code");
      return;
    }

    if (method === "cod") {
      const orderId = await createCodOrder(items, {
        full_name: name,
        email,
        phone,
        street,
        city,
        state,
        zip_code: zipCode,
        landmark,
      });

      useCartStore.getState().clearCart();
      router.push(`/order-confirmation/${orderId}`);
      return;
    }

 

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        items,
        address: {
          full_name: name,
          email,
          phone,
          street,
          city,
          state,
          zip_code: zipCode,
          landmark,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || "Failed to create payment");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: data.currency,
      name: "Poster Store",
      description: "Order Payment",
      order_id: data.razorpayOrderId,
      handler: function () {
        useCartStore.getState().clearCart();
        router.push(`/order-confirmation/${data.internalOrderId}`);
      },
      prefill: {
        name,
        email,
        contact: phone,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error(err);
    toast.error("Error processing order");
  } finally {
    setIsSubmitting(false);
  }
};


    return (
      <div className="bg-[#E7F0FE] min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-6 md:gap-10 p-4 max-w-5xl mx-auto pt-10">
          {/* left part */}
          <div className=" col-span-4  flex flex-col gap-4">
            <h1 className="text-2xl font-semibold tracking-wide">Checkout</h1>
  
            <form className="flex flex-col gap-4">
              <fieldset>
                <legend className="text-lg font-semibold">Payment Method</legend>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {/* Razorpay */}
                  <label
                    htmlFor="razorpay"
                    className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer 
          ${
            paymentMethod === "razorpay"
              ? "border-blue-500 bg-white"
              : "border-gray-200"
          }`}
                  >
                    <input
                      type="radio"
                      id="razorpay"
                      name="paymentType"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className=""
                    />
  
                    <Image
                      src="/razorpayImage.png"
                      alt="Razorpay"
                      height={80}
                      width={80}
                    />
                  </label>
  
                  {/* COD */}
                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer
          ${
            paymentMethod === "cod"
              ? "border-blue-500 bg-white"
              : "border-gray-200"
          }`}
                  >
                    <input
                      type="radio"
                      id="cod"
                      name="paymentType"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className=""
                    />
  
                    <span>Cash On Delivery</span>
                  </label>
                </div>
              </fieldset>
              <div className="flex flex-col gap-2 ">
                <label htmlFor="name">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="text"
                  name="name"
                  id="name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 ">
                <label htmlFor="email">
                 Email<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="email"
                  name="email"
                  id="email"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name">
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setPhone(onlyDigits);
                  }}
                  className="flex items-center gap-3 border py-2 px-4 rounded-2xl border-gray-400"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  name="name"
                  id="name"
                  required
                />
              </div>
              
  
              </div>
              <div className="flex flex-col gap-2 ">
                <label htmlFor="street">
                  Street<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="text"
                  name="street"
                  id="street"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 ">
                <label htmlFor="city">
                 City<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="text"
                  name="city"
                  id="city"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="landmark">
                  Landmark
                </label>
                <input
                  placeholder="Enter Your Landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="text"
                  name="landmark"
                  id="landmark"
                />
              </div>
              
  
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 ">
                <label htmlFor="city">
                 ZIP Code<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your ZipCode"
                  value={zipCode}
                  onChange={async (e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setZipCode(onlyDigits);
                
                    if (onlyDigits.length === 6) {
                      try {
                        const res = await fetch(
                          `https://api.postalpincode.in/pincode/${onlyDigits}`
                        );
                        const data = await res.json();
                
                        if (data[0]?.Status === "Success") {
                          const postOffice = data[0].PostOffice[0];
                          setState(postOffice.State);
                          setCity(postOffice.District);
                        }
                      } catch (err) {
                        console.error("Invalid PIN",err);
                      }
                    }
                  }}
                  inputMode="numeric"
                  maxLength={6}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
               
                  name="zip"
                  id="zip"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="State">
                  State<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`flex items-center gap-3 border py-2 px-4 rounded-2xl cursor-pointer border-gray-400`}
                  type="text"
                  name="State"
                  id="State"
                  required
                />
              </div>
              
  
              </div>
            </form>
          </div>
  
          {/* right part */}
          <div className="flex flex-col pt-15 p-4 md:col-span-2 w-full">
            <h1 className="text-lg font-semibold">Review your cart</h1>
            <div className="flex flex-col gap-3 p-4">
              {newPords.map((item,idx)=>(
                <div key={idx} className="flex gap-3 text-xs">
  
                  <Image src={item.image_url} alt={item.name} height={10} width={60} />
                  <div>
                    <h1 className="font-semibold">{item.name}</h1>
                    <p>Quanity:{item.selectedVariant.quantity}x</p>
                    <p>Size:{item.selectedVariant.size}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full mb-10 mx-auto">
           
            <section className="flex flex-col gap-3 w-full mt-6">
              <div className="flex justify-between w-full">
                <div className="font-semibold">Bag Total</div>
                <div>Rs.{total}</div>
              </div>
              <div className="flex justify-between w-full">
                <div className="">Estimated Tax</div>
                <div>Rs.{tax}</div>
              </div>
              <div className="flex justify-between w-full">
                <div className="">Shipping</div>
                <div>Rs.{items.length===0? 0:100}</div>
              </div>
              <div className="flex justify-between w-full">
                <div className="">Dicount</div>
                <div className="text-green-600">Rs.{items.length===0? 0:100}</div>
              </div>
            </section>
            <div className="h-0.5 bg-gray-300 my-6 " />
            <div className="flex justify-between w-full">
              <div className="font-semibold tracking-wider">Total</div>
              <div className="font-semibold">Rs.{total+tax}</div>
            </div>
  
            <button disabled={isSubmitting} onClick={()=>createOrder(paymentMethod)} className="flex items-center mt-10 justify-center mx-auto bg-black text-white cursor-pointer hover:opacity-85 rounded-3xl py-3 w-full">{isSubmitting? <p>Loading..</p>:<div className=''>Proceed to Checkout</div>}</button>
          </div>
  
          </div>
        </div>
      </div>
    );
  
}

export default CheckOutClient