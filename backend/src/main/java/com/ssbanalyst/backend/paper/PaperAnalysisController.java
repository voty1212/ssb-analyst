package com.ssbanalyst.backend.paper;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaperAnalysisController {

    private final PaperAnalysisRepository repository;

    public PaperAnalysisController(PaperAnalysisRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/api/papers")
    public ResponseEntity<PaperAnalysis> create(@Valid @RequestBody PaperAnalysisRequest request) {
        PaperAnalysis saved = repository.save(
                new PaperAnalysis(request.company(), request.uploadDate(), request.analysis()));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/api/papers")
    public List<PaperAnalysis> list(@RequestParam(required = false) String company) {
        if (company != null && !company.isBlank()) {
            return repository.findByCompanyOrderByUploadDateDesc(company);
        }
        return repository.findAllByOrderByUploadDateDesc();
    }

    @GetMapping("/api/papers/{id}")
    public ResponseEntity<PaperAnalysis> get(@PathVariable UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
