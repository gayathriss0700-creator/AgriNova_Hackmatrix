import FarmSetupWizard from '@/components/FarmSetup';
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

export default function SetupPage() {
  return (
    <>
      <FarmSetupWizard />
      <ModuleAIAdvisor
        moduleId="setup"
        moduleName="Setup Guide"
        moduleIcon="⚙️"
        contextData={{
          step: "Farm Configuration",
          isSetup: true
        }}
      />
    </>
  );
}
