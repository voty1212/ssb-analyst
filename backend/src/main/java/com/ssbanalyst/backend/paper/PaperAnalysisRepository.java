package com.ssbanalyst.backend.paper;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperAnalysisRepository extends JpaRepository<PaperAnalysis, UUID> {

    List<PaperAnalysis> findAllByOrderByUploadDateDesc();

    List<PaperAnalysis> findByCompanyOrderByUploadDateDesc(String company);
}
