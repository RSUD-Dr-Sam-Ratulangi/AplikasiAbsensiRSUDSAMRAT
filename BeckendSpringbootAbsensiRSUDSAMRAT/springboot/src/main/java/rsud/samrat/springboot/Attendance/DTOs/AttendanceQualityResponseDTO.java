package rsud.samrat.springboot.Attendance.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceQualityResponseDTO {
    private Long employeeId;
    private String employeeName;
    private int month;
    private Map<String, Integer> attendanceStatusCount;
    private Map<String, Integer> attendanceStateCount = new HashMap<>();
    private double qualityRate;

    // Constructors, getters, setters
}
