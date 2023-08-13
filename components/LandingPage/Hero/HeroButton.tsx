import Button from "@/components/Button"

export default function HeroButton() {
    
    return (
        <div className="flex gap-6 my-6">
            <Button
                className="font-semibold py-3 px-8 text-2xl transition duration"
                variant="primary"
                inversed
                rounded
            >
                Explore
            </Button>  
            <Button
                className="font-semibold py-3 px-8 text-2xl"
                variant="secondary"
                inversed
                rounded
            >
                Create
            </Button>      
        </div>
    )
}