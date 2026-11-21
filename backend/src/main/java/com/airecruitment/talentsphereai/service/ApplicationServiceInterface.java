
package com.airecruitment.talentsphereai.service;

import java.util.List;

import com.airecruitment.talentsphereai.model.Applications;

public interface ApplicationServiceInterface {

    Applications saveApplication(Applications application);

    Applications getApplicationById(Long applicationId);

    List<Applications> getAllApplications();

    Applications updateApplication(Long applicationId, Applications application);

    void deleteApplication(Long applicationId);

    List<Applications> getApplicationsByCandidateId(Long candidateId);

    List<Applications> getApplicationsByJobId(Long jobId);

    Applications updateApplicationStatus(Long applicationId, String status);
}
