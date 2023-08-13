import Image from "next/image"
import imagePlaceholder from "@/assets/images/Catalogue-pana.svg"

export default function HeroImage() {

    return (
        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            <Image 
                className="w-full h-full lg:max-w-3xl" 
                src={imagePlaceholder} 
                alt="Catalogue-pana.svg"
                width={300}
                height={300}
            />
        </div>
    )
}