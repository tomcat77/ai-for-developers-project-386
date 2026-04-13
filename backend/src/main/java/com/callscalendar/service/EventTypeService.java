package com.callscalendar.service;

import com.callscalendar.dto.CreateEventTypeRequest;
import com.callscalendar.entity.EventType;
import com.callscalendar.repository.EventTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventTypeService {
    
    private final EventTypeRepository eventTypeRepository;
    
    public List<EventType> getAllEventTypes() {
        return eventTypeRepository.findAll();
    }
    
    public EventType getEventTypeById(String id) {
        return eventTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventType not found: " + id));
    }
    
    public EventType createEventType(String id, CreateEventTypeRequest request) {
        EventType eventType = new EventType();
        eventType.setId(id);
        eventType.setName(request.getName());
        eventType.setDescription(request.getDescription());
        eventType.setDurationMinutes(request.getDurationMinutes());
        eventType.setColor(request.getColor());
        return eventTypeRepository.save(eventType);
    }
    
    public EventType updateEventType(String id, EventType request) {
        EventType eventType = eventTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventType not found: " + id));
        eventType.setName(request.getName());
        eventType.setDescription(request.getDescription());
        eventType.setDurationMinutes(request.getDurationMinutes());
        eventType.setColor(request.getColor());
        return eventTypeRepository.save(eventType);
    }
}
