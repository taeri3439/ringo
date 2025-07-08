package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleVO {
    private Integer timetableScheduleId;
    private String timetableScheduleContent;
    private Integer timetableScheduleX;
    private Integer timetableScheduleY;
    private Integer timetableScheduleWidth;
    private Integer timetableScheduleHeight;
    private String timetableScheduleColor;
    private String timetableScheduleTextColor;

    private int userPrimaryId;
}

