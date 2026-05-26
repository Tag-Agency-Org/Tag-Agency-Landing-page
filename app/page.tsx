import { AgencyFocus } from "@/components/AgencyFocus";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroControlRoom } from "@/components/HeroControlRoom";
import { IndustryUseCases } from "@/components/IndustryUseCases";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { ProblemDiagnostics } from "@/components/ProblemDiagnostics";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { ServiceArchitecture } from "@/components/ServiceArchitecture";
import { StrategyCallForm } from "@/components/StrategyCallForm";
import { TrustSignalStrip } from "@/components/TrustSignalStrip";
import { WhyTagAgency } from "@/components/WhyTagAgency";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { collectAssetStatus } from "@/lib/assets";
import { assetFilenames, suppliedClientLogoFiles } from "@/lib/site-data";

export default function Home() {
  const assets = collectAssetStatus([...assetFilenames, ...suppliedClientLogoFiles]);

  return (
    <>
      <Header hasLogo={assets["tag-agency-logo-cropped.png"]} />
      <main>
        <HeroControlRoom />
        <TrustSignalStrip assets={assets} />
        <ProblemDiagnostics />
        <ServiceArchitecture />
        <ProcessTimeline />
        <IndustryUseCases assets={assets} />
        <WhyTagAgency />
        <AgencyFocus assets={assets} />
        <StrategyCallForm />
      </main>
      <Footer hasLogo={assets["tag-agency-logo-cropped.png"]} />
      <MobileStickyCTA />
      <WhatsAppWidget />
    </>
  );
}
