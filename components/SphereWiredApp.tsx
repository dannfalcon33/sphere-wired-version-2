'use client';

import React, { useState } from 'react';
import ScrollProgressBar from './ScrollProgressBar';
import Header from './Header';
import HeroSection from './HeroSection';
import ContentSections from './ContentSections';
import CtaSection from './CtaSection';
import Footer from './Footer';
import NetworkConsoleModal from './NetworkConsoleModal';
import LegalDocumentModal from './LegalDocumentModal';
import type {
  LegalDocId,
  ModalTab,
  SphereEnergyMode,
} from '@/types/sphereWired';

export default function SphereWiredApp() {
  const [energyMode, setEnergyMode] = useState<SphereEnergyMode>('mesh');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('console');
  const [legalDocId, setLegalDocId] = useState<LegalDocId | null>(null);

  const handleOpenModal = (tab: ModalTab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080511] text-[#E8E4F3]">
      <ScrollProgressBar />
      <Header onLaunchApp={() => handleOpenModal('console')} />

      <main>
        <HeroSection
          energyMode={energyMode}
          onGetStarted={() => scrollToSection('get-started')}
          onExploreNetwork={() => scrollToSection('network')}
        />

        <ContentSections
          energyMode={energyMode}
          onSelectEnergyMode={setEnergyMode}
          onOpenDeployModal={() => scrollToSection('get-started')}
        />

        <CtaSection onLaunchApp={() => handleOpenModal('console')} />
      </main>

      <Footer
        onOpenConsole={handleOpenModal}
        onOpenLegal={(docId) => setLegalDocId(docId)}
      />

      <NetworkConsoleModal
        isOpen={modalOpen}
        activeTab={modalTab}
        onChangeTab={setModalTab}
        energyMode={energyMode}
        onChangeEnergyMode={setEnergyMode}
        onClose={() => setModalOpen(false)}
      />

      <LegalDocumentModal
        docId={legalDocId}
        onSelectDoc={setLegalDocId}
        onClose={() => setLegalDocId(null)}
      />
    </div>
  );
}
