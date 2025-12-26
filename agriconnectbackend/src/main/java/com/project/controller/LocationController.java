package com.project.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.entity.Location;
import com.project.repository.LocationRepository;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/states")
    public List<String> getAllStates() {
        return locationRepository.findAllStates(); // returns List<String>
    }

    @GetMapping("/districts")
    public List<String> getDistricts(@RequestParam String state) {
        return locationRepository.findDistrictsByState(state);
    }

    @GetMapping("/villages")
    public List<String> getVillages(@RequestParam String district) {
        return locationRepository.findVillagesByDistrict(district);
    }
    
    @GetMapping("/find")
    public Location getLocation(@RequestParam String state,
                                @RequestParam String district,
                                @RequestParam String subLocation) {

        Optional<Location> location = locationRepository
                .findByStateAndDistrictAndSubLocation(state, district, subLocation);

        return location.orElse(new Location());
    }
}

