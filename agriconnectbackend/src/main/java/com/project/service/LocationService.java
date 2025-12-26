package com.project.service;

import java.util.List;
import java.util.Optional;

import com.project.dto.LocationDto;

public interface LocationService {
    List<String> getStates();
    List<String> getDistrictsByState(String state);
    List<String> getVillagesByDistrict(String district);
    
    Optional<LocationDto> getLocationByAllDetails(String state, String district, String subLocation, String zipCode);
}
