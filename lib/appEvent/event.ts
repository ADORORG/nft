import type { PopulatedNftContractEventType } from '@/lib/types/event'
import EventEmitter from 'events'
import striptags from 'striptags'
import sendEmail from '@/lib/handlers/mailer'
import newMintEventEmailTemplate from '@/lib/mail_template/new_mint_event'
import eventMintedOutEmailTemplate from '@/lib/mail_template/event_minted_out'
import { setAccountDetails } from '@/lib/handlers/account'

const mintingEvent = new EventEmitter()

mintingEvent
.on('newMintOnEvent', newMintOnEvent)
.on('eventMintedOut', eventMintedOut)

async function newMintOnEvent({mintEventData}: {mintEventData: PopulatedNftContractEventType}) {
    try {
        // send mail to event creator/owner
        const eventOwner = await setAccountDetails(mintEventData.owner._id?.toString() as string, {})
        if (
            eventOwner.emailVerified && (
                !eventOwner?.notification || 
                eventOwner?.notification.newMintEvent
            )
        ) {
            // newMintEvent is enabled or not set by user. The default is true
            // Send email
            await sendEmail({
                to: eventOwner.email as string,
                subject: 'New mint on your event',
                text: striptags(newMintEventEmailTemplate(mintEventData)),
                html: newMintEventEmailTemplate(mintEventData)
            })
        }
    
    } catch (error) {
        console.log(error)
    }
}

async function eventMintedOut({mintEventData}: {mintEventData: PopulatedNftContractEventType}) {
    try {
        // send mail to event creator/owner
        const eventOwner = await setAccountDetails(mintEventData.owner._id?.toString() as string, {})
        if (
            eventOwner.emailVerified && (
                !eventOwner?.notification || 
                eventOwner?.notification.eventMintedOut
            )
        ) {
            // eventMintedOut is enabled or not set by user. The default is true
            // Send email
            await sendEmail({
                to: eventOwner.email as string,
                subject: 'Your event is minted out!',
                text: striptags(eventMintedOutEmailTemplate(mintEventData)),
                html: eventMintedOutEmailTemplate(mintEventData)
            })
        }
    
    } catch (error) {
        console.log(error)
    }
}

export default mintingEvent