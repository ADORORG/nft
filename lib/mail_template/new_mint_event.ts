import type { PopulatedNftContractEventType } from '@/lib/types/event'
import { AppInfo } from '@/lib/app.config'
import { replaceUrlParams } from '@/utils/main'
import socialLink from '@/config/social.link'
import appRoutes from '@/config/app.route'

export default function newMintEventEmailTemplate(mintEvent: PopulatedNftContractEventType) {
	const { name, description, website } = AppInfo
	const assetUrl = website + '/email/images'
	const tld = process.env.NEXTAUTH_URL
	const rawLink = replaceUrlParams(`${tld}/${appRoutes.viewEvent}`, 
	{ 
		eventDocId: mintEvent._id?.toString() as string, 
	})
	
	return `
		<!DOCTYPE html>

		<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
		<head>
		<title></title>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
		<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
		<link href="https://fonts.googleapis.com/css2?family=Cabin:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
		<style>
				* {
					box-sizing: border-box;
				}
		
				body {
					margin: 0;
					padding: 0;
				}
		
				a[x-apple-data-detectors] {
					color: inherit !important;
					text-decoration: inherit !important;
				}
		
				#MessageViewBody a {
					color: inherit;
					text-decoration: none;
				}
		
				p {
					line-height: inherit
				}
		
				.desktop_hide,
				.desktop_hide table {
					mso-hide: all;
					display: none;
					max-height: 0px;
					overflow: hidden;
				}
		
				.image_block img+div {
					display: none;
				}
		
				@media (max-width:500px) {
		
					.desktop_hide table.icons-inner,
					.social_block.desktop_hide .social-table {
						display: inline-block !important;
					}
		
					.icons-inner {
						text-align: center;
					}
		
					.icons-inner td {
						margin: 0 auto;
					}
		
					.mobile_hide {
						display: none;
					}
		
					.row-content {
						width: 100% !important;
					}
		
					.stack .column {
						width: 100%;
						display: block;
					}
		
					.mobile_hide {
						min-height: 0;
						max-height: 0;
						max-width: 0;
						overflow: hidden;
						font-size: 0px;
					}
		
					.desktop_hide,
					.desktop_hide table {
						display: table !important;
						max-height: none !important;
					}
				}
			</style>
		</head>
		<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
		<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;" width="100%">
		<tbody>
		<tr>
		<td>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tbody>
		<tr>
		<td>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #12123f; background-image: url('images/background.png'); background-position: top center; background-repeat: no-repeat; color: #000000; width: 480px; margin: 0 auto;" width="480">
		<tbody>
		<tr>
		<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
		<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
		<div align="right" class="alignment" style="line-height:10px">
		<div style="max-width: 240px;"><img alt="Ornament" src="${assetUrl}/ONMTS-1_1.png" style="display: block; height: auto; border: 0; width: 100%;" title="Ornament" width="240"/></div>
		</div>
		</td>
		</tr>
		</table>
		<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
		<div align="center" class="alignment" style="line-height:10px">
		<div style="max-width: 96px;"><img alt="${name}" src="${assetUrl}/safari-pinned-tab.png" style="display: block; height: auto; border: 0; width: 100%;" title="${name}" width="96"/></div>
		</div>
		</td>
		</tr>
		</table>
		<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
		<tr>
		<td class="pad" style="padding-bottom:15px;padding-left:25px;padding-right:25px;padding-top:15px;">
		<div style="color:#ffffff;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:42px;line-height:120%;text-align:center;mso-line-height-alt:50.4px;">
		<p style="margin: 0; word-break: break-word;"><span>
			New mint on ${mintEvent.tokenName} event
		</span></p>
		</div>
		</td>
		</tr>
		</table>
		<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
		<tr>
		<td class="pad" style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:5px;">
		<div style="color:#dcdcdc;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;line-height:180%;text-align:center;mso-line-height-alt:28.8px;">
		<p style="margin: 0; word-break: break-word;"><span>
			Congratutions! There's new mint on ${mintEvent.tokenName} event. You can view it on ${name} marketplace.
		</span></p>
		</div>
		</td>
		</tr>
		</table>
		<table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:20px;text-align:center;">
		<div align="center" class="alignment"><!--[if mso]>
		<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://www.example.com" style="height:42px;width:299px;v-text-anchor:middle;" arcsize="96%" stroke="false" fillcolor="#ab084f">
		<w:anchorlock/>
		<v:textbox inset="0px,0px,0px,0px">
		<center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
		<![endif]--><a href="${rawLink}" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#ab084f;border-radius:40px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">
				VIEW EVENT
		</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
		</td>
		</tr>
		</table>
		<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
		<tr>
		<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
		<div style="color:#dcdcdc;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
		<p style="margin: 0; word-break: break-word;"><span style="color: #0cc1d5;"><a href="${rawLink}" rel="noopener" style="text-decoration: none; color: #8a3b8f;" target="_blank">${rawLink}</a></span></p>
		</div>
		</td>
		</tr>
		</table>
		<div class="spacer_block block-7" style="height:30px;line-height:30px;font-size:1px;"> </div>
		<table border="0" cellpadding="0" cellspacing="0" class="image_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
		<div align="left" class="alignment" style="line-height:10px">
		<div style="max-width: 192px;"><img alt="Ornament" src="${assetUrl}/ONMTS-2_1.png" style="display: block; height: auto; border: 0; width: 100%;" title="Ornament" width="192"/></div>
		</div>
		</td>
		</tr>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tbody>
		<tr>
		<td>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 480px; margin: 0 auto;" width="480">
		<tbody>
		<tr>
		<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
		<table border="0" cellpadding="10" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad">
		<div align="left" class="alignment" style="line-height:10px">
		<div style="max-width: 48px;"><img alt="${name}" src="${assetUrl}/safari-pinned-tab.png" style="display: block; height: auto; border: 0; width: 100%;" title="${name}" width="48"/></div>
		</div>
		</td>
		</tr>
		</table>
		</td>
		<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
		<table border="0" cellpadding="15" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad">
		<div align="right" class="alignment">
		<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="72px">
		<tr>
		<td style="padding:0 0 0 4px;"><a href="${socialLink.twitter}" target="_blank"><img alt="Twitter" height="32" src="${assetUrl}/twitter2x.png" style="display: block; height: auto; border: 0;" title="twitter" width="32"/></a></td>
		<td style="padding:0 0 0 4px;"><a href="${socialLink.discord}" target="_blank"><img alt="discord" height="32" src="${assetUrl}/discord-svgrepo-com.svg" style="display: block; height: auto; border: 0;" title="Discord" width="32"/></a></td>
		</tr>
		</table>
		</div>
		</td>
		</tr>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tbody>
		<tr>
		<td>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 480px; margin: 0 auto;" width="480">
		<tbody>
		<tr>
		<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
		<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
		<tr>
		<td class="pad">
		<div style="color:#8a8a8a;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
		<p style="margin: 0; word-break: break-word;">${name} - ${description}</p>
		</div>
		</td>
		</tr>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
		<tbody>
		<tr>
		<td>
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 480px; margin: 0 auto;" width="480">
		<tbody>
		<tr>
		<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
		<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
		<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
		<tr>
		<td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
		<!--[if !vml]><!-->
		<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"><!--<![endif]-->
		</table>
		</td>
		</tr>
		</table>
		</td>
		</tr>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table><!-- End -->
		</body>
		</html>
	`
}