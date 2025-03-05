"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQ: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    // Refs to store the actual heights of answer content
    const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Realistic FAQ Data
    const faqData: FAQItem[] = [
        {
            question: "How does your matching process work?",
            answer: "Our matching process uses a combination of factors including the dog's personality, energy level, size, and specific needs, alongside your lifestyle, living situation, experience with dogs, and preferences. We analyze over 25 different data points to suggest compatible matches with the highest chance of a successful long-term relationship. This process has helped us achieve a 97% successful adoption rate.",
            category: "general"
        },
        {
            question: "What makes PawfectMatch different from other adoption services?",
            answer: "Unlike traditional shelters where you simply browse available dogs, we focus on compatibility first. Our proprietary matching algorithm helps identify dogs that will thrive in your specific home environment. We also provide 30 days of post-adoption support, training resources, and a community of fellow adopters to ensure a smooth transition for both you and your new companion.",
            category: "general"
        },
        {
            question: "How long does the adoption process take?",
            answer: "The typical adoption process takes 1-2 weeks from initial application to bringing your dog home. This includes completing our lifestyle questionnaire, reviewing your matches, meeting potential dogs, home preparation, and finalization. For special cases or dogs with specific needs, the process might take a bit longer to ensure the right fit.",
            category: "adoption"
        },
        {
            question: "What are the requirements to adopt?",
            answer: "Basic requirements include being at least 21 years old, providing proof of residence, landlord approval if renting, meeting income requirements to provide proper care, and verification that all household members are on board with adoption. Some dogs have specific needs that may require additional considerations, such as fenced yards for high-energy breeds or homes without small children for certain dogs.",
            category: "adoption"
        },
        {
            question: "What's included in the adoption fee?",
            answer: "Our adoption fee ranges from $200-350 depending on the dog's age, breed, and special needs. This fee covers spay/neuter surgery, up-to-date vaccinations, microchipping, deworming, flea/tick prevention, a basic health check, and 30 days of pet insurance. It also includes a starter kit with food samples, a collar, ID tag, and basic training resources.",
            category: "payments"
        },
        {
            question: "Do you offer post-adoption support?",
            answer: "Absolutely! We provide 30 days of dedicated support from our adoption counselors who can answer questions, provide training tips, and help with adjustment issues. We also have a veterinarian on call for basic health questions. Our community app connects you with other adopters and trainers, and we offer discounted training classes for all our adopted dogs.",
            category: "care"
        },
        {
            question: "Can I return a dog if it's not working out?",
            answer: "We have a 14-day adjustment period during which you can return the dog if the match truly isn't working out. Rather than an immediate return, we first try to address any issues through our behavior specialists and training resources. If problems persist, we'll help find a more suitable home for the dog and can help match you with a more compatible companion if desired.",
            category: "adoption"
        },
        {
            question: "What veterinary care will my new dog need?",
            answer: "All our dogs are up-to-date on vaccinations, spayed/neutered, microchipped, and have had a basic health screening before adoption. We recommend scheduling a veterinary check-up within the first 2 weeks to establish care with your vet. Ongoing care typically includes annual check-ups, vaccinations, heartworm prevention, dental care, and flea/tick prevention. We provide detailed health records and recommendations at adoption.",
            category: "care"
        }
    ];

    // All unique categories
    const categories = ["all", ...Array.from(new Set(faqData.map(item => item.category)))];

    // Handle toggling FAQ item expansion
    const toggleItem = (index: number) => {
        setExpandedItems(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    // Filter FAQ items based on search and category
    const filteredFAQs = faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
            {/* Header Section */}
            <div className="text-center mb-10 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl font-lilita mb-4 font-bold">Frequently Asked Questions</h1>
                <div className="w-16 sm:w-24 h-2 bg-[#FFC936] mx-auto mb-6 rounded-full"></div>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-700 px-4">
                    Find answers to common questions about our adoption process, dog care, and how our unique matching system works to help you find your perfect canine companion.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-10 px-4 mt-8">
                <div className="max-w-3xl mx-auto">
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search questions or answers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936]"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full capitalize text-sm sm:text-base transition-colors ${activeCategory === category
                                    ? "bg-[#FFC936] text-black font-medium"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Items */}
            <div className="max-w-3xl mx-auto space-y-6 px-4">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                        >
                            {/* Question (always visible) */}
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full p-6 sm:p-7 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                                aria-expanded={expandedItems.includes(index)}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <h3 className="font-lilita text-base sm:text-lg pr-8">{faq.question}</h3>
                                {expandedItems.includes(index) ? (
                                    <ChevronUp className="flex-shrink-0 text-[#FFC936]" size={20} />
                                ) : (
                                    <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
                                )}
                            </button>

                            {/* Answer (expandable) */}
                            <div
                                id={`faq-answer-${index}`}
                                className={`transition-all duration-300 ease-in-out ${expandedItems.includes(index) ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div
                                    className="p-6 sm:p-8 pt-2 sm:pt-3 text-gray-700 text-sm sm:text-base border-t border-gray-100 leading-relaxed"
                                    ref={el => {
                                        if (answerRefs.current.length <= index) {
                                            answerRefs.current = [...answerRefs.current, el];
                                        } else {
                                            answerRefs.current[index] = el;
                                        }
                                    }}
                                >
                                    <p className="py-4">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4 text-gray-400">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="font-lilita text-xl mb-2">No results found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search or category filter to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 sm:mt-20 text-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 max-w-3xl mx-auto">
                    <h2 className="font-lilita text-2xl sm:text-3xl mb-4">Still have questions?</h2>
                    <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg">
                        Can't find the answer you're looking for? Our team is always ready to help with any questions about the adoption process, dog care, or finding your perfect match.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-3 rounded-lg font-lilita text-lg bg-[#FFC936] hover:bg-[#FFB800] text-black transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;