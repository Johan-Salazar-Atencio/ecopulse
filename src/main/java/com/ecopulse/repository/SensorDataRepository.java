package com.ecopulse.repository;

import com.ecopulse.model.SensorData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorDataRepository extends MongoRepository<SensorData, String> {

    List<SensorData> findTop10ByOrderByTimestampDesc();
}
