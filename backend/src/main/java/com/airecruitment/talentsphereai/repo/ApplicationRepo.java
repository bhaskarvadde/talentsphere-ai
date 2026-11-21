package com.airecruitment.talentsphereai.repo;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airecruitment.talentsphereai.model.Applications;

@Repository
public interface ApplicationRepo extends JpaRepository<Applications, Long> {

}