import HeroButton from "./HeroButton";

export default function HeroText() {
    return (
        <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
                <h1 className="dark:text-white text-gray-950 text-4xl md:text-6xl lg:text-7xl tracking-wide subpixel-antialiased">
                    Collect Super <br/>Unique Digital<br/>Artworks 
                </h1>
                
                <p className="py-6 text-gray-600 dark:text-gray-400 text-lg font-normal leading-8 tracking-wide subpixel-antialiased">
                    World&apos;s largest NFT marketplace <br/>with over 45 thousand aritist.
                </p>

                <HeroButton />
            </div>
        </div>
    )
  }
  