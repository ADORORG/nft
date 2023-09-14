import HeroButton from "./HeroButton";

export default function HeroText() {
    return (
        <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
                <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wide subpixel-antialiased">
                    Create & Collect <br/>Unique Digital<br/>Items 
                </h1>
                
                <p className="py-6 opacity-60 text-lg font-normal leading-8 tracking-wide subpixel-antialiased">
                    State of the art Marketplace <br/>Join us, as we build for the Global Creative Community.
                </p>

                <HeroButton />
            </div>
        </div>
    )
  }
  