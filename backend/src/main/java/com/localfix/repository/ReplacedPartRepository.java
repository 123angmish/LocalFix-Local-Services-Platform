package com.localfix.repository;

import com.localfix.model.ReplacedPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplacedPartRepository extends JpaRepository<ReplacedPart, Long> {
    List<ReplacedPart> findByWorkProofId(Long workProofId);
}
