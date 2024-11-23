import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ProjectCard = ({ title, description, imagePath }) => (
    <Card className="bg-zinc-900 text-white overflow-hidden w-full max-w-md mx-auto">
        <CardHeader className="p-0">
            <img
                src={`/api/placeholder/400/250`}
                alt={title}
                className="w-full h-48 object-cover"
            />
        </CardHeader>
        <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
            <Button
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
                VIEW POST
            </Button>
        </CardFooter>
    </Card>
);

const ProjectCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const projects = [
        {
            title: "Project Example 1",
            description: "Description of the first project showcasing its key features and innovations.",
            imagePath: "Mazda.jpg"
        },
        {
            title: "Project Example 2",
            description: "Description of the second project highlighting its unique aspects and achievements.",
            imagePath: "Don.jpg"
        },
        {
            title: "Project Example 3",
            description: "Description of the third project emphasizing its impact and technical excellence.",
            imagePath: "MR.jpg"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? projects.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700 text-white border-none rounded-full p-2"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex-1 overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="w-full flex-shrink-0"
                            >
                                <ProjectCard {...project} />
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700 text-white border-none rounded-full p-2"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};

export default ProjectCarousel;