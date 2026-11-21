
package com.airecruitment.talentsphereai.service;

import java.util.List;

import com.airecruitment.talentsphereai.model.Jobs;

public interface jobSeviceInterface {

    Jobs saveJob(Jobs job);

    Jobs getJobById(Long jobId);

    List<Jobs> getAllJobs();

    Jobs updateJob(Long jobId, Jobs job);

    void deleteJob(Long jobId);

    List<Jobs> getJobsByRecruiterId(Long recruiterId);

    List<Jobs> searchJobsByTitle(String jobTitle);
}
