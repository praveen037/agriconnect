package com.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.entity.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Fetch a location uniquely by state, district, sub-location, and zip code
    Optional<Location> findByStateAndDistrictAndSubLocationAndZipCode(
            String state,
            String district,
            String subLocation,
            String zipCode
    );
 // Find Location by state, district, sub-location (ignores zipCode)
    Optional<Location> findByStateAndDistrictAndSubLocation(String state, String district, String subLocation);

    // Fetch all locations in a district
    List<Location> findByDistrict(String district);

    // Fetch all locations in a state
    List<Location> findByState(String state);

    // Fetch all distinct states
    @Query("SELECT DISTINCT l.state FROM Location l")
    List<String> findAllStates();

    // Fetch distinct districts for a state
    @Query("SELECT DISTINCT l.district FROM Location l WHERE l.state = :state")
    List<String> findDistrictsByState(@Param("state") String state);

    // Fetch distinct villages/sub-locations for a district
    @Query("SELECT DISTINCT l.subLocation FROM Location l WHERE l.district = :district")
    List<String> findVillagesByDistrict(@Param("district") String district);
}
