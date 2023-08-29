import HeroButton from "./HeroButton";

export default function HeroText() {
    return (
        <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
                <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wide subpixel-antialiased">
                    Collect & Trade <br/>Unique Digital<br/>Assets 
                </h1>
                
                <p className="py-6 opacity-60 text-lg font-normal leading-8 tracking-wide subpixel-antialiased">
                    Reputable NFT marketplace <br/>with thousands of curator, creator & artist.
                </p>

                <HeroButton />
            </div>
        </div>
    )
  }
  