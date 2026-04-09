package com.callscalendar.dto;

import lombok.Data;

@Data
public class CreateEventTypeRequest {
    private String name;
    private String description;
    private Integer durationMinutes;
    private String color;
}