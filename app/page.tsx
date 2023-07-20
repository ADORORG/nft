import HeroSection from "./components/Hero/Hero"
import FeaturedItem from "./components/FeaturedItem/Featured"
import ItemCategory from "./components/ItemCateogry"
import SubscribeSection from "./components/Subscribe"
import SupportedBlockchainNetwork from "./components/SupportedNetwork"
import TopCreator from "./components/TopCreator"
import StepsToBeACreator from "./components/StepToCreate"
import JoinOurCommunity from "./components/JoinCommunity"
import { TrendingAuction, TrendingFixedOrder } from "./components/TrendingItem"

export default function LandingPage() {
  
  return (
    <div className="">
      <HeroSection />
      <SupportedBlockchainNetwork />
      <TrendingAuction />
      <TrendingFixedOrder />
      <TopCreator />
      <StepsToBeACreator />
      <JoinOurCommunity />
    </div>
  )
}
