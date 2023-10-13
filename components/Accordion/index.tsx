
interface AccordionProps {
    children: React.ReactNode
}

export default function Accordion(props: AccordionProps) {

    return (
        <div className="border-x border-t border-gray-600 rounded-t-sm">
            {props.children}
        </div>
    )
}

function AccordionHeader(props: AccordionProps) {

    return (
        <div className="flex items-center justify-between w-full p-5 cursor-pointer text-left border-b border-gray-600 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
           
            <div>{props.children}</div>
           
            <svg className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
            </svg>
        </div>
    )
}

function AccordionBody(props: AccordionProps) {

    return (
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
            {props.children}
        </div>
    )
}

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody