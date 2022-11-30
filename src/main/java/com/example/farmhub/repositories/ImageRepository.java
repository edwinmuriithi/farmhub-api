package com.example.farmhub.repositories;

import com.example.farmhub.models.ImageData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageData, Long> {
}
