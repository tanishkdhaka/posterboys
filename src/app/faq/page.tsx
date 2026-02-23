"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery timelines vary depending on your location and product type. In-stock items are dispatched faster. Print-on-demand items may require additional production time before shipping. Once shipped, delivery typically takes 3–7 business days within India.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes. Orders can be cancelled within 24 hours of placing the order, provided the item has not entered production or been shipped. After this period, cancellation may not be possible.",
  },
  {
    question: "Do you accept returns?",
    answer:
      "We accept returns only if the product arrives damaged or if you receive the wrong item. You must report the issue within 48 hours of delivery and provide clear photos of the product and packaging.",
  },
  {
    question: "Are custom posters refundable?",
    answer:
      "No. Custom or personalized posters are non-refundable and non-returnable unless received damaged or incorrect. Since they are made specifically for you, we cannot resell them.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, Cash on Delivery is available for eligible orders. Availability may vary based on delivery location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payments via Razorpay, including UPI, debit/credit cards, net banking, and other supported methods.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive tracking details via email or SMS. You can use those details to track your shipment through our courier partner.",
  },
  {
    question: "Why does my poster look slightly different from the website image?",
    answer:
      "Minor color variations may occur due to screen settings, lighting, and printing processes. These are normal and not considered defects.",
  },
  {
    question: "Can I modify my shipping address after placing an order?",
    answer:
      "Address changes are only possible within 24 hours of placing the order and before shipment. Please contact support immediately if you need assistance.",
  },
  {
    question: "Do you ship outside India?",
    answer:
      "Currently, we only ship within India.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left font-semibold flex justify-between items-center"
              >
                {faq.question}
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>

              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}