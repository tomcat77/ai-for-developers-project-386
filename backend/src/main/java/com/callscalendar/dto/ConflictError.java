package com.callscalendar.dto;

import lombok.Data;

@Data
public class ConflictError {
    private String message;
    
    public ConflictError(String message) {
        this.message = message;
    }
}