package com.mtech.vmcs.controller;

import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.service.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
@RequestMapping(path = "/machines")
public class MachineController {

  @Autowired private MachineService machineService;

  private String filePath;

  @GetMapping
  public ResponseEntity<List<Machine>> getAllMachines() {
    return new ResponseEntity<>(machineService.getAllMachines(), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<List<Machine>> createMachines(@RequestBody List<Machine> machines) {
    machineService.createMachines(machines);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PutMapping
  public ResponseEntity<List<User>> updateMachines(@RequestBody List<Machine> machines) {
    machineService.updateMachines(machines);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<List<Long>> deleteMachines(@RequestBody List<Long> machineIds) {
    machineService.deleteMachines(machineIds);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping("/start")
  public ResponseEntity<Object> startSimulation(@RequestParam("filePath") String filePath) {
    this.filePath = filePath;
    machineService.startSimulation(filePath);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping("/stop")
  public ResponseEntity<Object> stopSimulation() {
    machineService.stopSimulation(filePath);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
