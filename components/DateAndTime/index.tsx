import { useState } from "react"
import { InputField } from "@/components/Form"
import { dateToHtmlInput, getTimeFromDateString } from "@/utils/date"

interface DateAndTimeProps {
    onChange: (date: Date) => void,
    minDate?: Date,
    maxDate?: Date,
    value?: Date | number
}

export default function DateAndTime(props: DateAndTimeProps) {
    const receivedDate = props.value ? new Date(props.value) : new Date()
    const [date, setDate] = useState(dateToHtmlInput(receivedDate))
    const [time, setTime] = useState(getTimeFromDateString(receivedDate))

    /** Handle time and date for auction endsAt */
    const handleDateAndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let newDate = new Date()

        if (name === "date") {
            newDate = new Date(`${value} ${time}`)
            setDate(value)
        } else if (name === "time") {
            newDate = new Date(`${date} ${value}`)
            setTime(value)
        }

        props.onChange(newDate)
    }

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <InputField 
                className="rounded"
                name="date"
                type="date"
                min={props.minDate ? dateToHtmlInput(props.minDate) : undefined}
                max={props.maxDate ? dateToHtmlInput(props.maxDate) : undefined}
                value={date}
                onChange={handleDateAndTimeChange}
            />
            <InputField 
                className="rounded"
                name="time"
                type="time"
                value={time}
                onChange={handleDateAndTimeChange}
            />
        </div>
    )
}