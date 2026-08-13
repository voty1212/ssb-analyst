package com.ssbanalyst.backend.paper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "paper_analyses")
public class PaperAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String company;

    @Column(name = "upload_date", nullable = false)
    private LocalDate uploadDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String analysis;

    protected PaperAnalysis() {
        // required by JPA
    }

    public PaperAnalysis(String company, LocalDate uploadDate, String analysis) {
        this.company = company;
        this.uploadDate = uploadDate;
        this.analysis = analysis;
    }

    public UUID getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }
}
