package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.Machine;

import java.util.List;

public interface MachineService {

  List<Machine> getAllMachines();

  void createMachines(List<Machine> machines);

  void updateMachines(List<Machine> machines);

  void deleteMachines(List<Long> MachineIds);

  void startSimulation(String filePath);

  void stopSimulation(String filePath);
}
