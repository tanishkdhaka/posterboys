"use client";

import SizeDropdown from "@/components/dropdown";
import Category from "@/data/category";
import Products from "@/data/Products";
import { supabase } from "@/lib/supabaseClient";
import { Rating } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
interface Poster extends Products {
  category: {
    name: string;
    slug: string;
  };
}

function PosterClientSide({ slug }: { slug: string }) {
  const [poster, setPoster] = useState<Poster>();
  const [relatedPosters, setRelatedPosters] = useState<Products[]>([]);
  const [iconSize, setIconSize] = useState<"medium" | "large">("medium");
  const [ratingGap, setRatingGap] = useState("6px");
  const [variantIndex, setVairant] = useState(0);
  const [Quantity, setQuantity] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 768 ? "medium" : "large");
      setRatingGap(window.innerWidth < 768 ? "3px" : "8px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      //fetch poster by slug
      const { data: posters, error } = await supabase
        .from("posters")
        .select(
          `*,
       category:category_id (
      name,slug
        )
        `
        )
        .eq("slug", slug)
        .single();
      if (error) {
        console.error("Error fetching poster:", error);
        return;
      }
      const { data: relatedPosters, error: relatedPostersError } =
        await supabase
          .from("posters")
          .select("*")
          .eq("category_id", posters?.category_id)
          .neq("slug", slug)
          .order("order_count", { ascending: true })
          .limit(4);
          if (relatedPostersError) {
        console.error("Error fetching related posters:", relatedPostersError);
        return;
      }
      setRelatedPosters(relatedPosters || []);
   
      setPoster(posters || undefined);
    };
    fetchData();
  }, [slug]);

  if (!poster) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-[80vh]">
      <div>
        <div className="flex gap-2 items-center md:text-lg text-sm text-gray-700">
          <Link href={`/`} className="">
            Home /
          </Link>
          <Link
            href={`/collections/${poster.category.slug.toLocaleLowerCase()}`}
          >
            {poster.category.name} /
          </Link>
          <span className=" capitalize"> {slug}</span>
        </div>
        {/* Hero Section */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 max-w-screen-xl mx-auto ">
          {/* product image */}
          <div className="flex items-end justify-center">
            <Image
              src={poster.image_url}
              alt={""}
              height={400}
              width={440}
              className="rounded-3xl"
              priority
            />
          </div>

          {/* product details */}
          <div className="flex flex-col gap-1">
            <h1 className="md:text-2xl font-semibold text-xl ">
              {poster.name}
            </h1>
            <div className="flex items-center -ml-2  gap-2">
              <Stack spacing={1}>
                <Rating
                  name="half-rating-read"
                  defaultValue={poster.rating || 0}
                  precision={0.1}
                  value={poster?.rating || 0}
                  readOnly
                  size={iconSize}
                  sx={{
                    color: "#f3c600",

                    "& .MuiRating-iconFilled": {
                      color: "#f3c600", // Color for filled stars
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#e0e0e0", // Color for empty stars
                    },
                    display: "flex",
                    gap: ratingGap, // Add gap between stars
                    padding: "4px", // Optional padding inside border
                  }}
                />
              </Stack>
              <button className=" underline text-gray-600 md:text-sm text-xs">
                ({poster.review_count}) write a review
              </button>
            </div>
            <div className="mb-2">
              <span className="font-semibold gap-3 flex md:text-lg text-md items-center">
                <span className="line-through opacity-40">
                  {" "}
                  ₹{poster.variants[variantIndex].discounted_price}{" "}
                </span>{" "}
                ₹{poster.variants[variantIndex].original_price}
                <div className="bg-[#E68C8C] text-xs text-white rounded-sm md:text-sm flex items-center justify-center px-2  ">
                  {poster.variants[variantIndex].original_price
                    ? Math.round(
                        ((poster.variants[variantIndex].original_price -
                          (poster.variants[variantIndex].discounted_price ??
                            0)) /
                          poster.variants[variantIndex].original_price) *
                          100
                      )
                    : 0}
                  % OFF
                </div>
              </span>
            </div>
            <div>
              <span className="bg-gray-300 text-black px-2 py-1">
                {" "}
                MRP inclusive of all taxes
              </span>
            </div>
            <div>
              <h3 className="font-semibold md:pt-4 pt-2">Sizes</h3>

              <div className="flex gap-3 md:pt-4 text-md md:text-lg pt-2">
                {poster.variants.map((variant, index) => (
                  <button
                    onClick={() => setVairant(index)}
                    key={index}
                    className={`border-1 px-2 py-1 rounded-lg  border-gray-400 cursor-pointer
        ${variantIndex === index ? "bg-white " : "b"}
      `}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:pt-3 pt-2">
              <div className="flex flex-col  ">
                <h3 className="font-semibold ">Select Quantity:</h3>
                <div className="text-lg flex gap-2  items-center pt-2">
                  <button
                    className=" border-1  px-3 py-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-white rounded-lg"
                    disabled={Quantity <= 1}
                    onClick={() => setQuantity(Quantity - 1)}
                  >
                    <Minus className="w-4" />
                  </button>
                  <span className="px-2">{Quantity}</span>
                  <button
                    className="cursor-pointer border-1  px-3 py-1 bg-white rounded-lg"
                    onClick={() => setQuantity(Quantity + 1)}
                  >
                    <Plus className="w-4" />
                  </button>
                </div>
              </div>

              <button className="bg-[#338ED1] z-[9999] fixed bottom-0 left-0 tracking-wider md:relative flex items-center justify-center w-full text-white px-4 py-3.5 md:py-1 uppercase md:rounded-lg cursor-pointer text-2xl md:text-xl lg:text-2xl font-semibold md:mt-0 mt-2">
                Add to Bag
              </button>
            </div>
            <div className="flex flex-col gap-3 mt-6  bg-white rounded-2xl border-1 py-6 px-8 ">
              <h3 className="font-semibold ">Need Custom Poster?</h3>
              <span className="text-sm bg-[#E7F0FE] p-4 rounded-2xl tracking-wide w-fit">
                Upload Your Own Image Here
              </span>
            </div>
            <div className="grid grid-cols-3 border-1 text-xs md:text-lg font-light  rounded-2xl bg-white p-4 mt-6">
              <div className="flex items-center gap-1 justify-center flex-col">
                <Image
                  src={"/delivery.png"}
                  alt={"delivery"}
                  width={45}
                  height={40}
                />
                <h3>Free Delivery</h3>
              </div>
              <div className="flex items-center gap-1 justify-center flex-col">
                <Image
                  src={"/premiumPrint.png"}
                  alt={"delivery"}
                  width={50}
                  height={40}
                />
                <h3>Premium Print</h3>
              </div>
              <div className="flex items-center justify-center pt-2 gap-2 flex-col">
                <Image
                  src={"/customCreation.png"}
                  alt={"delivery"}
                  width={40}
                  height={40}
                />
                <h3>Custom Creation</h3>
              </div>
            </div>
          </div>
        </section>
        {/* you may Also Like */}
        <section className="flex  flex-col items-center justify-center mt-10 mb-5">
          <h1 className="uppercase md:text-4xl text-2xl font-bold mx-auto">
            YOU may also like
          </h1>
          <div className="grid  md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
            {" "}
            {relatedPosters.map((item, id) => (
              <div
                key={id}
                className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2"
              >
                <Link
                  href={`/poster/${item.slug}`}
                  className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2"
                >
                  <div className="relative w-[100px] h-[120px] md:w-[208px] md:h-[260px] rounded-3xl overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="md:text-sm text-[0.6rem] text-center pl-2 ">
                    {item.name}
                  </h2>
                </Link>
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="font-semibold md:text-lg mx-auto text-xs px-3">
                    From Rs.{item.variants[0].discounted_price}
                  </h3>
                  <SizeDropdown
                    options={item.variants.map((v) => ({
                      size: v.size,
                      price: v.discounted_price,
                    }))}
                  />
                  <button className="w-full bg-black text-white px-4 py-1 md:py-2 md:text-md text-xs  rounded-lg cursor-pointer">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Collections */}
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
      </div>
    </div>
  );
}

export default PosterClientSide;
