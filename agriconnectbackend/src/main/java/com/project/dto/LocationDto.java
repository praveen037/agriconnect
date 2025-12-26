package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor      // generates default constructor
@AllArgsConstructor     // generates constructor with all fields
public class LocationDto {
    private String state;
    private String district;
    private String subLocation;
    private String zipCode;
}
