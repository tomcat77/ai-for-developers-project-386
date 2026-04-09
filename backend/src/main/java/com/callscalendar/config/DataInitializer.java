package com.callscalendar.config;

import com.callscalendar.entity.CalendarOwner;
import com.callscalendar.entity.EventType;
import com.callscalendar.repository.BookingRepository;
import com.callscalendar.repository.CalendarOwnerRepository;
import com.callscalendar.repository.EventTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final CalendarOwnerRepository calendarOwnerRepository;
    private final EventTypeRepository eventTypeRepository;
    private final BookingRepository bookingRepository;
    
    @Override
    public void run(String... args) {
        if (calendarOwnerRepository.count() == 0) {
            CalendarOwner owner = new CalendarOwner();
            owner.setId("00000000-0000-0000-0000-000000000001");
            owner.setName("Владелец календаря");
            owner.setContact("owner@example.com");
            calendarOwnerRepository.save(owner);
            log.info("Created default CalendarOwner");
        }
        
        if (eventTypeRepository.count() == 0) {
            EventType defaultType = new EventType();
            defaultType.setId("DEFAULT");
            defaultType.setName("Консультация");
            defaultType.setDescription("30-минутная консультация");
            defaultType.setDurationMinutes(30);
            defaultType.setColor("#3B82F6");
            eventTypeRepository.save(defaultType);
            
            EventType quickType = new EventType();
            quickType.setId("QUICK");
            quickType.setName("Быстрый звонок");
            quickType.setDescription("15-минутный звонок");
            quickType.setDurationMinutes(15);
            quickType.setColor("#10B981");
            eventTypeRepository.save(quickType);
            
            log.info("Created default EventTypes: DEFAULT, QUICK");
        }
    }
}