package com.callscalendar.repository;

import com.callscalendar.entity.CalendarOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarOwnerRepository extends JpaRepository<CalendarOwner, String> {
}