"use client";
import Image from "next/image";
import { New_Rocker } from "next/font/google";
import Category from "@/data/category";
import Link from "next/link";
import { useEffect, useState } from "react";
import Products from "@/data/Products";
import { supabase } from "@/lib/supabaseClient";
import FeaturedProducts from "@/components/FeaturedProducts";

const newRocker = New_Rocker({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [bestSelling, setBestSellingProducts] = useState<Products[]>([]);
  const [newArrivals, setNewArrivals] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      const { data: bestSellingData, error: bestSellingError } = await supabase
        .from("posters")
        .select("*")
        .order("order_count", { ascending: false })
        .limit(10);
      if (bestSellingError) {
        console.error("Error fetching bestSelling products:", bestSellingError);
      } else {
        setBestSellingProducts(bestSellingData);
      }
      const { data: newArrivalsData, error: newArriavalError } = await supabase
        .from("posters")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (newArriavalError) {
        console.error("Error fetching new arrivals:", newArriavalError);
      } else {
        setNewArrivals(newArrivalsData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
      
    )
  }
  return (
    <div className="flex flex-col scrollbar-none w-full min-h-screen bg-[#FDF6F0] text-black   ">
      {/* heroSection */}
      <section className="relative w-full bg-white h-[60vh] overflow-hidden">
        <Image
          src="/heroImage.webp"
          alt="Poster"
          fill
          className="object-cover brightness-60"
          priority
        />
        <div
          className={`${newRocker.className} absolute z-[10]  inset-0 gap-4  flex flex-col items-center justify-center text-white text-4xl md:text-6xl font-bold`}
        >
          <h1>Your Walls,</h1>
          <h1>Best Wingman.</h1>
          <p className="md:text-2xl text-sm text-center">
            We’ve got your wall covered — literally.
          </p>
          <button className="md:text-4xl text-sm bg-black px-6 py-2 rounded-2xl cursor-pointer">
            Starts At Just ₹99/
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="pt-5 flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src={"/Collection.png"}
            alt={""}
            height={1080}
            width={1024}
            className="md:h-[94px] md:w-[330px] h-[75px] w-[251px]"
          />
        </div>
        <div className="flex md:gap-10 gap-2 overflow-x-scroll scrollbar-none scroll-smooth">
          {Category.map((cat, id) => (
            <Link
              href={`/collections/${cat.slug}`}
              key={id}
              className="flex flex-col justify-center md:gap-2 gap-1 md:p-4 p-2  rounded-3xl"
            >
              <div className="relative w-[90px] h-[120px] md:w-[208px] md:h-[260px] rounded-3xl overflow-hidden">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div></div>

              <h2 className="text-sm md:text-lg pl-2 font-semibold">
                {cat.name}
              </h2>
            </Link>
          ))}
          <div className="rounded-3xl md:w-[208px] w-[90px] h-full  bg-black md:mt-3 mt-2 flex items-center justify-center">
            <Link
              href={"/collections"}
              className="text-sm md:text-lg w-[90px] h-[120px] md:w-[208px] md:h-[260px]  font-semibold text-[#338ED1] flex items-center justify-center"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <FeaturedProducts
        product={newArrivals}
        section_image={"/TrendingNow.png"}
      />

      {/* best Selling */}
      <FeaturedProducts
        product={bestSelling}
        section_image={"/Bestselling.png"}
      />

      {/* custom poster */}
      <section className="pt-5 flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src={"/Bestselling.png"}
            alt={""}
            height={1080}
            width={1024}
            className="md:h-[85px] md:w-[350px] h-[55px] w-[240px]"
          />
        </div>
        <div className="flex md:px-5 py-2 relative items-center justify-center">
  <Image
    src="/customPoster.png"
    alt=""
    height={1080}
    width={1024}
    className="w-full md:h-[600px]"
  />

          <div className="absolute z-[10] inset-0 flex flex-col items-center justify-end pb-[10%] text-black">
            <Link
              href=""
              className="md:text-4xl text-xs bg-black text-white px-6 py-2 rounded-2xl cursor-pointer"
            >
              Create Your Poster
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}

      <section className="md:py-15 py-6 flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src={"/WhyChooseUs.png"}
            alt={""}
            height={1080}
            width={1024}
            className="md:h-[75px] md:w-[600px] h-[30px] w-[240px]"
          />
        </div>
        <div className="grid md:grid-cols-4 py-10 grid-cols-2 md:gap-5 gap-4 px-5  max-w-screen-lg mx-auto">
          <div className="flex items-center justify-center flex-col gap-1 md:gap-2">
            <Image
              src={"/whyChooseUs1.png"}
              alt={""}
              height={1080}
              width={1024}
              className="md:h-[60px] md:w-[60px] h-[40px] w-[40px]"
            />
            <h2 className="text-center text-xs md:text-lg font-semibold">
              Premium Print
            </h2>
            <p className="text-center text-[0.6rem] md:text-sm">
              {" "}
              Quality is our top priority. Each poster is meticulously crafted
              using premium materials
            </p>
          </div>
          <div className="flex items-center justify-center flex-col gap-1 md:gap-2">
            <Image
              src={"/whyChooseUs2.png"}
              alt={""}
              height={1080}
              width={1024}
              className="md:h-[60px] md:w-[60px] h-[40px] w-[40px]"
            />
            <h2 className="text-center text-xs md:text-lg font-semibold">
              Custom Creation
            </h2>
            <p className="text-center text-[0.6rem] md:text-sm">
              {" "}
              Upload your own images or designs and create personalized poster
              that reflect your personality.
            </p>
          </div>
          <div className="flex items-center justify-center flex-col gap-1  md:gap-2">
            <Image
              src={"/whyChooseUs3.png"}
              alt={""}
              height={1080}
              width={1024}
              className="md:h-[60px] md:w-[60px] h-[40px] w-[40px]"
            />
            <h2 className="text-center text-xs md:text-lg font-semibold">
              Free Shipping
            </h2>
            <p className="text-center text-[0.6rem] md:text-sm">
              {" "}
              Enjoy free delivery on prepaid orders- no shipping fees means more
              savings and convenience for you!
            </p>
          </div>
          <div className="flex items-center justify-center flex-col gap-1 md:gap-2">
            <Image
              src={"/whyChooseUs4.png"}
              alt={""}
              height={1080}
              width={1024}
              className="md:h-[60px] md:w-[60px] h-[40px] w-[40px]"
            />
            <h2 className="text-center text-xs md:text-lg font-semibold">
              Secure Packaging
            </h2>
            <p className="text-center text-[0.6rem] md:text-sm">
              {" "}
              We ship your posters flat or rolled in rigid, damage-proof
              packaging—so they arrive crisp, clean, and display-ready.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
