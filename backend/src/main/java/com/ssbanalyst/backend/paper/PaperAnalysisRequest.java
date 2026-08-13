package com.ssbanalyst.backend.paper;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PaperAnalysisRequest(
        @NotBlank String company,
        @NotNull LocalDate uploadDate,
        @NotBlank String analysis) {
}
