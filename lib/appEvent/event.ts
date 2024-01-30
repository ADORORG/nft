import type { PopulatedNftContractEventType } from '@/lib/types/event'
import EventEmitter from 'events'
import striptags from 'striptags'
import sendEmail from '@/lib/handlers/mailer'
import activityNotificationEmailTemplate from '@/lib/mail_template/activity_notification'
import appRoutes from '@/config/app.route'
import { AppInfo } from '@/lib/app.config'
import { setAccountDetails } from '@/lib/handlers/account'
import { replaceUrlParams } from '@/utils/main'


const mintingEventEmitter = new EventEmitter()

mintingEventEmitter
.on('newMintOnEvent', newMintOnEvent)
.on('eventMintedOut', eventMintedOut)


function getMintEventUrl(mintEventData: PopulatedNftContractEventType) {
    const tld = process.env.NEXTAUTH_URL
    const rawLink = replaceUrlParams(`${tld}/${appRoutes.viewEvent}`, 
    { 
        eventDocId: mintEventData._id?.toString() as string, 
    })

    return rawLink
}

async function newMintOnEvent({mintEventData}: {mintEventData: PopulatedNftContractEventType}) {
    try {
        // send mail to event creator/owner
        const eventOwner = await setAccountDetails(mintEventData.owner._id?.toString() as string, {})
        if (
            eventOwner.emailVerified && (
                !eventOwner?.notification || 
                eventOwner?.notification.newMintOnEvent
            )
        ) {
            // newMintEvent is enabled or not set by user. The default is true
            // Send email
            const templateConfig = {
                buttonLink: getMintEventUrl(mintEventData),
                buttonLabel: 'View Event',
                title: 'New mint on your event',
                mainContent: `Congratutions! There is a new mint on ${mintEventData.tokenName} event. You can view it on ${AppInfo.name} marketplace.`
            }

            await sendEmail({
                to: eventOwner.email as string,
                subject: 'New mint on your event',
                text: striptags(activityNotificationEmailTemplate(templateConfig)),
                html: activityNotificationEmailTemplate(templateConfig)
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
            const templateConfig = {
                buttonLink: getMintEventUrl(mintEventData),
                buttonLabel: 'View Event',
                title: `${mintEventData.tokenName} minted out!`,
                mainContent: `Congratutions! ${mintEventData.tokenName} minted out. You can view it on ${AppInfo.name} marketplace.`
            }

            await sendEmail({
                to: eventOwner.email as string,
                subject: 'Your event is minted out!',
                text: striptags(activityNotificationEmailTemplate(templateConfig)),
                html: activityNotificationEmailTemplate(templateConfig)
            })
        }
    
    } catch (error) {
        console.log(error)
    }
}

export default mintingEventEmitter