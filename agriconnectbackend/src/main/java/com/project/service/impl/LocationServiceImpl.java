package com.project.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.LocationDto;
import com.project.entity.Location;
import com.project.repository.LocationRepository;
import com.project.service.LocationService;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public List<String> getStates() {
        return locationRepository.findAllStates();
    }

    @Override
    public List<String> getDistrictsByState(String state) {
        return locationRepository.findDistrictsByState(state);
    }

    @Override
    public List<String> getVillagesByDistrict(String district) {
        return locationRepository.findVillagesByDistrict(district);
    }

    @Override
    public Optional<LocationDto> getLocationByAllDetails(String state, String district, String subLocation, String zipCode) {
        Optional<Location> location = locationRepository.findByStateAndDistrictAndSubLocationAndZipCode(
            state, district, subLocation, zipCode
        );
        return location.map(loca-> new LocationDto(
            loca.getState(),
            loca.getDistrict(),
            loca.getSubLocation(),
            loca.getZipCode()
        ));
    }
}
