"use client";

import React from "react";
import { Heart, PawPrint, Users, Home, Award, Calendar } from "lucide-react";

interface TeamMember {
    name: string;
    title: string;
    image: string;
    bio: string;
}

const About: React.FC = () => {
    const teamMembers: TeamMember[] = [
        {
            name: "Sarah Johnson",
            title: "Founder & Director",
            image: "https://i.imgur.com/vPx7Ffd.jpeg",
            bio: "Sarah founded PawfectMatch after rescuing her own dog, Max. With 15 years in animal welfare and a background in tech, she created our matching algorithm to help dogs find their perfect families."
        },
        {
            name: "Michael Rodriguez",
            title: "Adoption Coordinator",
            image: "https://i.imgur.com/uLlHSDx.jpeg",
            bio: "With a background in social work, Michael brings expertise in making perfect matches between dogs and adopters. He ensures each adoption is a good fit for both the family and the pet."
        },
        {
            name: "Dr. Jessica Chen",
            title: "Veterinary Manager",
            image: "https://i.imgur.com/UiPzBhL.jpeg",
            bio: "Dr. Chen oversees the health and wellbeing of all our dogs. She ensures that every dog is healthy, vaccinated, and ready to join their new home with all medical needs addressed."
        },
        {
            name: "David Wilson",
            title: "Community Outreach",
            image: "https://i.imgur.com/WkCktDc.jpeg",
            bio: "David coordinates with local shelters, businesses, and schools to spread awareness about pet adoption through educational programs and events. He's grown our volunteer team to over 120 people."
        }
    ];

    const stats = [
        { label: "Dogs Adopted", value: "5,200+", icon: <Home size={24} /> },
        { label: "Years Active", value: "8", icon: <Calendar size={24} /> },
        { label: "Volunteers", value: "120+", icon: <Users size={24} /> },
        { label: "Partner Shelters", value: "24", icon: <Award size={24} /> }
    ];

    const timelineEvents = [
        {
            year: "2016",
            title: "PawfectMatch Founded",
            description: "Sarah Johnson started with just 5 dogs and a dream to revolutionize pet adoption through better matching."
        },
        {
            year: "2018",
            title: "First Facility Opens",
            description: "We opened our first dedicated adoption center with space for 30 dogs and a play area for potential adopters to meet their matches."
        },
        {
            year: "2020",
            title: "Digital Transformation",
            description: "Launched our online platform with proprietary matching algorithm to make dog adoption more accessible nationwide."
        },
        {
            year: "2022",
            title: "Expansion & Growth",
            description: "Opened two additional facilities and developed partnerships with 15 more shelters across the state."
        },
        {
            year: "2024",
            title: "Today's Impact",
            description: "Now serving nationwide with over 5,000 successful adoptions and expanding our foster network program."
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto my-3 px-4 sm:px-6 py-8 sm:py-12 md:py-16 ">
            {/* Hero Section */}
            <div className="relative rounded-xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 py-16 sm:py-24 px-6 sm:px-8 text-center text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-lilita mb-4 sm:mb-6">Our Story</h1>
                    <div className="w-16 sm:w-24 h-2 bg-[#FFC936] mx-auto mb-6 sm:mb-8 rounded-full"></div>
                    <p className="text-lg sm:text-xl max-w-3xl mx-auto">
                        At PawfectMatch, our mission is simple: connect loving families with their ideal canine companions through our innovative matching process. Every dog deserves a loving home, and every home deserves the perfect furry friend.
                    </p>
                </div>
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundColor: "slategray" }}
                ></div>
            </div>

            {/* Mission Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-20 px-4 my-4 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col justify-center transform transition-transform hover:scale-[1.02] my-4">
                    <h2 className="font-lilita text-2xl sm:text-3xl mb-4 sm:mb-6">Our Mission</h2>
                    <p className="text-base sm:text-lg mb-4">
                        We're dedicated to finding perfect homes for dogs in need through a unique matching process that considers both the dog's personality and the adopter's lifestyle.
                    </p>
                    <p className="text-base sm:text-lg mb-4">
                        Unlike traditional shelters, we focus on compatibility, ensuring long-lasting bonds between dogs and their new families. Our innovative approach has led to over 5,000 successful adoptions with a return rate under 3%.
                    </p>
                    <p className="text-base sm:text-lg">
                        We believe adoption is not just about saving a life—it's about creating perfect partnerships that enrich both human and canine lives for years to come.
                    </p>
                </div>
                <div className="flex items-center justify-center mt-4 sm:mt-0">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-full overflow-hidden border-4 sm:border-8 border-[#FFC936]">
                        <img
                            src="https://i.imgur.com/KcMP6ZJ.jpeg"
                            alt="Happy dog with owner"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="rounded-xl shadow-lg p-6 sm:p-10 mb-12 sm:mb-20 mt-12" style={{ backgroundColor: "slategray" }}>
                <h2 className="font-lilita text-3xl sm:text-3xl text-center mb-8 sm:mb-12 font-bold text-white">PawfectMatch By The Numbers</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFC936] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                {stat.icon}
                            </div>
                            <div className="font-lilita text-2xl sm:text-4xl mb-1 sm:mb-2 text-white">{stat.value}</div>
                            <div className="text-sm sm:text-lg text-gray-600c text-white">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Values */}
            <div className="mb-12 sm:mb-20 px-4 mt-12">
                <h2 className="font-lilita text-3xl sm:text-4xl text-center mb-8 sm:mb-12 font-bold">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFC936] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <Heart size={24} className="text-white" />
                        </div>
                        <h3 className="font-lilita text-xl sm:text-2xl mb-3 sm:mb-4">Compassion</h3>
                        <p className="text-gray-700">
                            We treat every dog with dignity and respect, ensuring their physical and emotional needs are met while they await their forever homes.
                        </p>
                    </div>

                    <div className=" rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105" >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFC936] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <PawPrint size={24} className="text-white" />
                        </div>
                        <h3 className="font-lilita text-xl sm:text-2xl mb-3 sm:mb-4">Connection</h3>
                        <p className="text-gray-700">
                            We believe in the unique bond between humans and dogs, and we work tirelessly to create lasting connections that transform lives.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 ">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFC936] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <Users size={24} className="text-white" />
                        </div>
                        <h3 className="font-lilita text-xl sm:text-2xl mb-3 sm:mb-4">Community</h3>
                        <p className="text-gray-700">
                            We foster a supportive community of adopters, volunteers, and animal lovers who share our passion for giving dogs second chances.
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-12 sm:mb-20 px-4 mt-12">
                <h2 className="font-lilita text-3xl sm:text-4xl text-center mb-8 sm:mb-12 font-bold">Our Journey</h2>

                {/* Mobile Timeline (vertical) */}
                <div className="md:hidden relative pl-8 mb-8 space-y-8" >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFC936]" ></div>

                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute left-0 top-2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#FFC936] z-10"></div>

                            {/* Content */}
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-4" style={{ backgroundColor: "slategray" }}>
                                <div className="font-lilita text-xl text-[#FFC936] mb-1">{event.year}</div>
                                <h3 className="font-lilita text-lg mb-2 text-gray-800">{event.title}</h3>
                                <p className="text-gray-700 text-sm text-white">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Timeline (alternating) */}
                <div className="hidden md:block relative">
                    {/* Vertical line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#FFC936]"></div>

                    {/* Timeline events */}
                    <div className="space-y-12 ">
                        {timelineEvents.map((event, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                    } mt-4`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-[#FFC936] z-10"></div>

                                {/* Content */}
                                <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                                    <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
                                        <div className="font-lilita text-xl text-[#FFC936] mb-2">{event.year}</div>
                                        <h3 className="font-lilita text-lg mb-2">{event.title}</h3>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for the other side */}
                                <div className="w-5/12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section - With consistent image sizing in alternating layout */}
            <div className="mb-12 sm:mb-20 px-4 mt-12">
                <h2 className="font-lilita text-2xl sm:text-4xl text-center mb-8 sm:mb-12 font-bold">Meet Our Team</h2>
                <div className="space-y-8 sm:space-y-12">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.01] mt-4">
                            {/* Flex container that changes direction based on even/odd index */}
                            <div className={`flex flex-col  'sm:flex-row md:flex-row lg:flex-row' : 'sm:flex-row-reverse lg:flex-row-reverse'}`}>
                                {/* Image container with fixed dimensions */}
                                <div className="sm:w-2/5 bg-gray-100 flex items-center justify-center">
                                    <div className="w-full h-64 sm:h-48 md:h-52 lg:h-56 overflow-hidden flex items-start align-center justify-center">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-auto h-auto max-h-[90%] max-w-[90%] object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://via.placeholder.com/300x225.png?text=${encodeURIComponent(member.name)}`;
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Text content */}
                                <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-center">
                                    <h3 className="font-lilita text-xl sm:text-2xl mb-2">{member.name}</h3>
                                    <p className="text-[#FFC936] font-semibold mb-4 text-base sm:text-lg">{member.title}</p>
                                    <p className="text-gray-700 text-sm sm:text-base">{member.bio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="px-4 mb-8 sm:mb-0 mt-12">
                <h2 className="font-lilita text-2xl sm:text-4xl text-center mb-8 sm:mb-12 font-bold">Success Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className="rounded-xl shadow-lg p-6 sm:p-8 relative" style={{ backgroundColor: "slategray" }}>
                            <div className="absolute -top-5 left-6 w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC936] rounded-full flex items-center justify-center">
                                <span className="text-white text-xl sm:text-2xl font-bold">"</span>
                            </div>
                            <p className="text-white mb-6 pt-4 text-sm sm:text-base mx-4">
                                "PawfectMatch helped us find our perfect companion! The matching process was spot-on, and we couldn't be happier with our new family member. {['Bailey', 'Max', 'Luna'][index]} fits into our home like she's always been here, and the support even after adoption has been amazing."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4">
                                    {/* <img 
                                        src={`https://i.imgur.com/testimonial${index + 1}.jpeg`.replace('testimonial', ['5JC8RuS', 'R9PiJKH', '1jF4vDU'][index])} 
                                        alt="Testimonial" 
                                        className="w-full h-full object-cover"
                                    /> */}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm sm:text-base text-gray-700">The {['Martinez', 'Thompson', 'Garcia'][index]} Family</h4>
                                    <p className="text-xs sm:text-sm text-white">Adopted {['Bailey', 'Max', 'Luna'][index]}, {['October', 'August', 'December'][index]} 2023</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;