package rsud.samrat.springboot.Attendance.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import rsud.samrat.springboot.Attendance.AttendanceState;
import rsud.samrat.springboot.Attendance.AttendanceStatus; // Import the AttendanceStatus enum

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceCreateRequestDTO {
    private Long scheduleId;
    private Long employeeId;
    private LocalDate attendanceDate;
    private LocalDateTime clockIn;
    @JsonIgnore
    private LocalDateTime clockOut;
    private Double locationLatIn;
    private Double locationLongIn;
    private Double locationLatOut;
    private Double locationLongOut;
    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] selfieCheckIn;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] selfieCheckOut;
    private AttendanceStatus status;
    private AttendanceType attendanceType;
    private AttendanceState attendanceState;
}
