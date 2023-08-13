import { Twitter, Discord, Telegram, Facebook, Instagram } from "react-bootstrap-icons";

type SocialProps = {
    name: string,
    link?: string,
}

interface SocialIconProps {
    socials: SocialProps[],
    iconClassName?: string
}

export default function SocialIcon(props: SocialIconProps) {
    const { socials, iconClassName } = props

    const SocialIconMap: Record<string, React.ReactNode> = {
        twitter: <Twitter className={iconClassName} />,
        discord: <Discord className={iconClassName} />,
        telegram: <Telegram className={iconClassName} />,
        facebook: <Facebook className={iconClassName} />,
        instagram: <Instagram className={iconClassName} />,
    }

    return (
        <div className="flex flex-wrap">
        {
            socials.map(({name, link = ""}, index) => (
                <span key={index+name} title={name}>
                    {
                        link ? 
                        <a href={link}>{SocialIconMap[name]}</a>
                        :
                        SocialIconMap[name]
                    }
                    
                </span>
            ))
        }
        </div>
    )
}