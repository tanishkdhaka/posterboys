"use client";

import Products from "@/data/Products";
import { supabase } from "@/lib/supabaseClient";
import { Rating } from "@mui/material";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";
import React, {  useEffect, useState } from "react";
interface Poster extends Products {
  category: {
    name: string;
  };
}

function PosterClientSide({ slug }: { slug: string }) {
  const [poster, setPoster] = useState<Poster>();
  const [iconSize, setIconSize] = useState<"medium" | "large">("medium");
  const [ratingGap, setRatingGap] = useState("6px");
  const [variantIndex, setVairant] = useState(0);
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
      name
        )
        `
        )
        .eq("slug", slug)
        .single();
      if (error) {
        console.error("Error fetching poster:", error);
        return;
      }
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
            href={`/collections/${poster.category.name.toLocaleLowerCase()}`}
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
          </div>
        </section>
      </div>
    </div>
  );
}

export default PosterClientSide;
