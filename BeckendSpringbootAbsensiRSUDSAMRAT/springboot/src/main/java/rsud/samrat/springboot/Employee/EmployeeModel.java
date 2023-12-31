package rsud.samrat.springboot.Employee;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import rsud.samrat.springboot.Placement.PlacementModel;
import rsud.samrat.springboot.Schedule.ScheduleModel;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employee")
public class EmployeeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employee_id;
    private String name;
    private String role;

    private String nik;


    @ManyToOne
    @JoinColumn(name = "placement_id")
    @JsonBackReference
    private PlacementModel placement;

    @ManyToMany(mappedBy = "employees")
    @JsonManagedReference
    private List<ScheduleModel> schedules;




}




