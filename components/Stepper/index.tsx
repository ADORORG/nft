
interface StepProps {
    icon?: React.ReactNode,
    title: React.ReactNode,
    subtitle?: React.ReactNode,
    done: boolean,
    active: boolean
}

interface StepperProps {
    steps: StepProps[]
}

export default function Stepper(props: StepperProps) {
    const { steps } = props

    return (
        <ol className="relative text-gray-700 border-l border-gray-200 dark:border-gray-500 dark:text-gray-300">                  
            {
                steps.map((step, index) => (
                    <li className="mb-10 ml-6" key={index}>            
                        <span 
                            className={`${step.done ? "bg-secondary-200 dark:bg-secondary-900" : "bg-gray-100 dark:bg-gray-700"} ${step.active ? "ring-secondary-600 dark:ring-secondary-400" : "ring-gray-600 dark:ring-gray-400"} ring-1 absolute flex items-center justify-center w-8 h-8 rounded-full -left-4`}>
                                {
                                    step.done 
                                    ?
                                    <svg 
                                        className="w-3.5 h-3.5 text-purple-400 dark:text-purple-400" 
                                        aria-hidden="true" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" viewBox="0 0 16 12">
                                        <path 
                                            stroke="currentColor" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M1 5.917 5.724 10.5 15 1.5" 
                                        />
                                    </svg>
                                    :
                                    step.icon
                                }
                                
                        </span>
                        <h3 className="font-medium leading-tight">{step.title}</h3>
                        <p className="text-sm">{step.subtitle}</p>
                  </li>
                ))
            }
        </ol>
    )
}
