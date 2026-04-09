package com.callscalendar.service;

import com.callscalendar.entity.CalendarOwner;
import com.callscalendar.repository.CalendarOwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CalendarOwnerService {
    
    private final CalendarOwnerRepository calendarOwnerRepository;
    
    public CalendarOwner getOwner() {
        return calendarOwnerRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CalendarOwner not found"));
    }
    
    public CalendarOwner createOrUpdateOwner(String name, String contact) {
        CalendarOwner owner = calendarOwnerRepository.findAll().stream()
                .findFirst()
                .orElse(new CalendarOwner());
        
        owner.setId("00000000-0000-0000-0000-000000000001");
        owner.setName(name);
        owner.setContact(contact);
        
        return calendarOwnerRepository.save(owner);
    }
}