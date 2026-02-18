import PageHeader from "@/components/layout/PageHeader";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Privacy Policy" />
      <div className="flex-1 p-4 space-y-6">
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Your Privacy Matters</h2>
          <p className="text-sm text-muted-foreground">We are committed to protecting your personal data and your privacy.</p>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">1. Information We Collect</h3>
            <p>We do not collect any personal identification information unless you explicitly provide it. The application uses local storage on your device to save your preferences and progress.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">2. AI Features</h3>
            <p>When you use AI features, your queries are processed by our backend services and shared with AI providers (like OpenAI) to generate responses. We do not store these queries permanently.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">3. Advertisements</h3>
            <p>We use Google AdSense and AdMob to serve advertisements. These providers may use cookies or device identifiers to serve personalized ads based on your interests.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">4. Changes to This Policy</h3>
            <p>We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes.</p>
          </section>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pb-8">
        Last updated: May 2024
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
