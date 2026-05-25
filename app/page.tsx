import { AgencyFocus } from "@/components/AgencyFocus";
import { CaseStudyEvidence } from "@/components/CaseStudyEvidence";
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
import { collectAssetStatus } from "@/lib/assets";
import { assetFilenames } from "@/lib/site-data";

export default function Home() {
  const assets = collectAssetStatus(assetFilenames);

  return (
    <>
      <Header hasLightLogo={assets["tag-logo-light.svg"]} />
      <main>
        <HeroControlRoom />
        <TrustSignalStrip assets={assets} />
        <ProblemDiagnostics />
        <ServiceArchitecture />
        <ProcessTimeline />
        <CaseStudyEvidence />
        <IndustryUseCases assets={assets} />
        <WhyTagAgency />
        <AgencyFocus assets={assets} />
        <StrategyCallForm />
      </main>
      <Footer hasDarkLogo={assets["tag-logo-dark.svg"]} />
      <MobileStickyCTA />
    </>
  );
}
